// src/api/roblox.ts
// Vercel serverless function that aggregates Roblox profile and games data.
// Runs server‑side, so no CORS proxies are needed.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PROJECTS, SITE } from '../config';

// Helper to fetch JSON, throwing on non‑OK responses.
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status} for ${url}`);
  return (await res.json()) as T;
}

// Load profile data (display name, avatar, followers, friends)
async function loadProfile(): Promise<any> {
  const id = SITE.robloxUserId;
  const [user, headshot, followers, friends] = await Promise.all([
    fetchJSON<{ displayName: string; name: string; created: string }>(
      `https://users.roblox.com/v1/users/${id}`
    ),
    fetchJSON<{ data: { imageUrl: string }[] }>(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png`
    ),
    fetchJSON<{ count: number }>(
      `https://friends.roblox.com/v1/users/${id}/followers/count`
    ),
    fetchJSON<{ count: number }>(
      `https://friends.roblox.com/v1/users/${id}/friends/count`
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

function placeId(link: string): string | null {
  return link.match(/\/games\/(\d+)/)?.[1] ?? null;
}

// Load games data for projects defined in config.
async function loadGames(): Promise<any[]> {
  const rbxProjects = PROJECTS.filter((p) => p.link.includes('roblox.com/games'));
  if (!rbxProjects.length) return [];

  const pairs = await Promise.all(
    rbxProjects.map(async (p) => {
      const pid = placeId(p.link);
      if (!pid) return null;
      try {
        const { universeId } = await fetchJSON<{ universeId: number }>(
          `https://apis.roblox.com/universes/v1/places/${pid}/universe`
        );
        return universeId ? { project: p, pid, uid: universeId } : null;
      } catch {
        return null;
      }
    })
  );
  const valid = pairs.filter((x): x is NonNullable<typeof x> => x !== null);
  if (!valid.length) return [];

  const ids = valid.map((v) => v.uid).join(',');
  const [icons, banners, gameData, votesRes] = await Promise.all([
    fetchJSON<{ data: { targetId: number; imageUrl: string }[] }>(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=512x512&format=Png`
    ),
    fetchJSON<{ data: { universeId: number; thumbnails: { imageUrl: string }[] }[] }>(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&size=768x432&format=Png&countPerUniverse=1`
    ),
    fetchJSON<{ data: { id: number; playing: number; visits: number; favoritedCount: number }[] }>(
      `https://games.roblox.com/v1/games?universeIds=${ids}`
    ),
    fetchJSON<{ data: { id: number; upVotes: number; downVotes: number }[] }>(
      `https://games.roblox.com/v1/games/votes?universeIds=${ids}`
    ).catch(() => ({ data: [] })),
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const [profile, games] = await Promise.all([loadProfile(), loadGames()]);
    res.status(200).json({ profile, games });
  } catch (e) {
    console.error('Roblox API error:', e);
    res.status(500).json({ error: 'Failed to fetch Roblox data' });
  }
}
