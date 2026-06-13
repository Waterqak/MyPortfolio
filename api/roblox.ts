// api/roblox.ts
// Vercel serverless function – fully self-contained (no imports from src/).
// Aggregates Roblox profile + games data server-side to avoid CORS.

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Config (inlined to avoid cross-directory import issues) ─────
const ROBLOX_USER_ID = '2878666652';

// Only the Roblox game projects (title, link, fallback banner)
const ROBLOX_PROJECTS = [
  {
    title: 'Chillin Place',
    link: 'https://www.roblox.com/games/17290214724/Chillin-Place',
    src: 'https://tr.rbxcdn.com/180DAY-c69740761a8556385075f48b5b71147a/768/432/Image/Png/noFilter',
  },
  {
    title: 'Escape Lava: Collect Brainrots',
    link: 'https://www.roblox.com/games/85862915773488/Escape-Lava-to-collect-brainrots',
    src: 'https://tr.rbxcdn.com/180DAY-1f5e4f49f3ff9eddbf732387c8b19cd7/768/432/Image/Webp/noFilter',
  },
  {
    title: 'Operation: Azure Rift',
    link: 'https://www.roblox.com/games/140471518514522/Operation-Azure-Rift',
    src: 'https://tr.rbxcdn.com/180DAY-1384a973e73995479b5db690aa51e902/768/432/Image/Png/noFilter',
  },
  {
    title: 'Yan-Chan Simulator',
    link: 'https://www.roblox.com/games/90515983274647/Yan-Chan-Simulator',
    src: 'https://tr.rbxcdn.com/180DAY-cae9bb90f7a6e78c66ed1e18af2727e6/768/432/Image/Webp/noFilter',
  },
];

// ── Helpers ─────────────────────────────────────────────────────
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} from ${url}`);
  return (await res.json()) as T;
}

function placeId(link: string): string | null {
  return link.match(/\/games\/(\d+)/)?.[1] ?? null;
}

// ── Loaders ─────────────────────────────────────────────────────
async function loadProfile() {
  const id = ROBLOX_USER_ID;
  const [user, headshot, followers, friends] = await Promise.all([
    fetchJSON<{ displayName: string; name: string; created: string }>(
      `https://users.roblox.com/v1/users/${id}`,
    ),
    fetchJSON<{ data: { imageUrl: string }[] }>(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png`,
    ),
    fetchJSON<{ count: number }>(
      `https://friends.roblox.com/v1/users/${id}/followers/count`,
    ),
    fetchJSON<{ count: number }>(
      `https://friends.roblox.com/v1/users/${id}/friends/count`,
    ),
  ]);

  return {
    displayName: user.displayName,
    username: user.name,
    created: user.created,
    followers: followers.count ?? 0,
    friends: friends.count ?? 0,
    headshotUrl: headshot.data?.[0]?.imageUrl ?? '',
  };
}

async function loadGames() {
  if (!ROBLOX_PROJECTS.length) return [];

  const pairs = await Promise.all(
    ROBLOX_PROJECTS.map(async (p) => {
      const pid = placeId(p.link);
      if (!pid) return null;
      try {
        const { universeId } = await fetchJSON<{ universeId: number }>(
          `https://apis.roblox.com/universes/v1/places/${pid}/universe`,
        );
        return universeId ? { project: p, pid, uid: universeId } : null;
      } catch {
        return null;
      }
    }),
  );
  const valid = pairs.filter((x): x is NonNullable<typeof x> => x !== null);
  if (!valid.length) return [];

  const ids = valid.map((v) => v.uid).join(',');
  const [icons, banners, gameData, votesRes] = await Promise.all([
    fetchJSON<{ data: { targetId: number; imageUrl: string }[] }>(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=512x512&format=Png`,
    ),
    fetchJSON<{ data: { universeId: number; thumbnails: { imageUrl: string }[] }[] }>(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&size=768x432&format=Png&countPerUniverse=1`,
    ),
    fetchJSON<{
      data: { id: number; playing: number; visits: number; favoritedCount: number }[];
    }>(`https://games.roblox.com/v1/games?universeIds=${ids}`),
    fetchJSON<{ data: { id: number; upVotes: number; downVotes: number }[] }>(
      `https://games.roblox.com/v1/games/votes?universeIds=${ids}`,
    ).catch(() => ({ data: [] as { id: number; upVotes: number; downVotes: number }[] })),
  ]);

  const iconMap: Record<number, string> = {};
  icons.data?.forEach((g) => {
    if (g.imageUrl) iconMap[g.targetId] = g.imageUrl;
  });
  const bannerMap: Record<number, string> = {};
  banners.data?.forEach((g) => {
    const u = g.thumbnails?.[0]?.imageUrl;
    if (u) bannerMap[g.universeId] = u;
  });
  const infoMap: Record<number, { playing: number; visits: number; favorites: number }> = {};
  gameData.data?.forEach((g) => {
    infoMap[g.id] = { playing: g.playing, visits: g.visits, favorites: g.favoritedCount };
  });
  const voteMap: Record<number, { upVotes: number; downVotes: number }> = {};
  votesRes.data?.forEach((g) => {
    voteMap[g.id] = { upVotes: g.upVotes, downVotes: g.downVotes };
  });

  return valid.map(({ project, pid, uid }) => ({
    title: project.title,
    link: project.link,
    universeId: uid,
    placeId: pid,
    playing: infoMap[uid]?.playing ?? 0,
    visits: infoMap[uid]?.visits ?? 0,
    favorites: infoMap[uid]?.favorites ?? 0,
    upVotes: voteMap[uid]?.upVotes ?? 0,
    downVotes: voteMap[uid]?.downVotes ?? 0,
    bannerUrl: bannerMap[uid] || project.src,
    iconUrl: iconMap[uid] || '',
  }));
}

// ── Handler ─────────────────────────────────────────────────────
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [profile, games] = await Promise.all([loadProfile(), loadGames()]);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ profile, games });
  } catch (e: any) {
    console.error('Roblox API error:', e?.message ?? e);
    return res.status(500).json({ error: 'Failed to fetch Roblox data', detail: e?.message });
  }
}
