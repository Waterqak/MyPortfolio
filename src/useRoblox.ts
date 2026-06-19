import { useEffect, useRef, useState } from 'react';
import { PROJECTS, SITE } from './config';

// ── Types ───────────────────────────────────────────────────────
export interface RobloxProfile {
  displayName: string;
  username: string;
  created: string;
  followers: number;
  friends: number;
  headshotUrl: string;
}

export interface RobloxGame {
  title: string;
  link: string;
  universeId: number;
  placeId: string;
  playing: number;
  visits: number;
  favorites: number;
  upVotes: number;
  downVotes: number;
  bannerUrl: string;
  iconUrl: string;
}

export interface RobloxData {
  profile: RobloxProfile | null;
  games: RobloxGame[];
  loading: boolean;
  error: boolean;
  lastUpdated: number | null;
}

// ── CORS proxy helpers (fallback for local dev) ─────────────────
// Roblox APIs don't send CORS headers, so when the Vercel serverless
// endpoint isn't available (local dev), we fall back to public proxies.
const PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
  (u: string) => `https://api.allorigins.cf/raw?url=${encodeURIComponent(u)}`,
];

async function get<T>(url: string): Promise<T> {
  let lastErr: unknown;
  for (const wrap of PROXIES) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(wrap(url));
        if (!res.ok) {
          if (res.status === 429) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
          }
          throw new Error(String(res.status));
        }
        return (await res.json()) as T;
      } catch (err) {
        lastErr = err;
        if (attempt === 1) await new Promise(r => setTimeout(r, 200));
      }
    }
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } catch (err) {
    throw lastErr ?? err;
  }
}

export function fmtNum(n: number | null | undefined): string {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function placeId(link: string): string | null {
  return link.match(/\/games\/(\d+)/)?.[1] ?? null;
}

// ── Client-side data loaders (used as fallback) ─────────────────
async function loadProfileClient(): Promise<RobloxProfile | null> {
  const id = SITE.robloxUserId;
  const [user, headshot, followers, friends] = await Promise.all([
    get<{ displayName: string; name: string; created: string }>(
      `https://users.roblox.com/v1/users/${id}`,
    ),
    get<{ data: { imageUrl: string }[] }>(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png`,
    ),
    get<{ count: number }>(`https://friends.roblox.com/v1/users/${id}/followers/count`),
    get<{ count: number }>(`https://friends.roblox.com/v1/users/${id}/friends/count`),
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

async function loadGamesClient(): Promise<RobloxGame[]> {
  const rbxProjects = PROJECTS.filter((p) => p.link.includes('roblox.com/games'));
  if (!rbxProjects.length) return [];

  const pairs = await Promise.all(
    rbxProjects.map(async (p) => {
      const pid = placeId(p.link);
      if (!pid) return null;
      try {
        const { universeId } = await get<{ universeId: number }>(
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
  const [icons, banners, gameData] = await Promise.all([
    get<{ data: { targetId: number; imageUrl: string }[] }>(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=512x512&format=Png`,
    ),
    get<{ data: { universeId: number; thumbnails: { imageUrl: string }[] }[] }>(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids}&size=768x432&format=Png&countPerUniverse=1`,
    ),
    get<{
      data: { id: number; playing: number; visits: number; favoritedCount: number }[];
    }>(`https://games.roblox.com/v1/games?universeIds=${ids}`),
  ]);

  let votes: Record<number, { upVotes: number; downVotes: number }> = {};
  try {
    const v = await get<{ data: { id: number; upVotes: number; downVotes: number }[] }>(
      `https://games.roblox.com/v1/games/votes?universeIds=${ids}`,
    );
    v.data?.forEach((g) => (votes[g.id] = { upVotes: g.upVotes, downVotes: g.downVotes }));
  } catch {
    votes = {};
  }

  const iconMap: Record<number, string> = {};
  icons.data?.forEach((g) => { if (g.imageUrl) iconMap[g.targetId] = g.imageUrl; });

  const bannerMap: Record<number, string> = {};
  banners.data?.forEach((g) => {
    const u = g.thumbnails?.[0]?.imageUrl;
    if (u) bannerMap[g.universeId] = u;
  });

  const infoMap: Record<number, { playing: number; visits: number; favorites: number }> = {};
  gameData.data?.forEach((g) => {
    infoMap[g.id] = { playing: g.playing, visits: g.visits, favorites: g.favoritedCount };
  });

  return valid.map(({ project, pid, uid }) => ({
    title: project.title,
    link: project.link,
    universeId: uid,
    placeId: pid,
    playing: infoMap[uid]?.playing ?? 0,
    visits: infoMap[uid]?.visits ?? 0,
    favorites: infoMap[uid]?.favorites ?? 0,
    upVotes: votes[uid]?.upVotes ?? 0,
    downVotes: votes[uid]?.downVotes ?? 0,
    bannerUrl: bannerMap[uid] || project.src,
    iconUrl: iconMap[uid] || '',
  }));
}

// ── Combined loader: Supabase Edge Function first → client fallback ─────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

async function loadAll(): Promise<{ profile: RobloxProfile | null; games: RobloxGame[] }> {
  // 1) Try the Supabase Edge Function
  if (SUPABASE_URL) {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/roblox-stats`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        return { profile: json.profile ?? null, games: json.games ?? [] };
      }
    } catch {
      // endpoint unavailable – fall through
    }
  }

  // 2) Fallback: client-side CORS proxy loading
  const [profileRes, gamesRes] = await Promise.allSettled([
    loadProfileClient(),
    loadGamesClient(),
  ]);
  return {
    profile: profileRes.status === 'fulfilled' ? profileRes.value : null,
    games: gamesRes.status === 'fulfilled' ? gamesRes.value : [],
  };
}

// ── Hook ────────────────────────────────────────────────────────
const REFRESH_MS = 60_000;
const MIN_SPINNER_MS = 800; // minimum time to show the loading spinner

export function useRoblox(): RobloxData {
  // Hydrate from cache for instant UI, but always start with loading: true
  // so the spinner is visible on every page load.
  const cached = typeof window !== 'undefined' ? localStorage.getItem('robloxData') : null;
  const parsed = cached ? JSON.parse(cached) : null;

  const [data, setData] = useState<RobloxData>({
    profile: parsed?.profile ?? null,
    games: parsed?.games ?? [],
    loading: true,          // always true so spinner shows
    error: false,
    lastUpdated: parsed?.lastUpdated ?? null,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // ── Initial load (with minimum spinner duration) ──────────
    (async () => {
      const start = Date.now();
      try {
        const { profile, games } = await loadAll();

        // Guarantee the spinner is visible for at least MIN_SPINNER_MS
        const elapsed = Date.now() - start;
        if (elapsed < MIN_SPINNER_MS) {
          await new Promise((r) => setTimeout(r, MIN_SPINNER_MS - elapsed));
        }

        if (!mounted.current) return;
        const newData: RobloxData = {
          profile,
          games,
          loading: false,
          error: !profile && !games.length,
          lastUpdated: Date.now(),
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('robloxData', JSON.stringify(newData));
        }
        setData(newData);
      } catch {
        // Still honour the minimum spinner time on error
        const elapsed = Date.now() - start;
        if (elapsed < MIN_SPINNER_MS) {
          await new Promise((r) => setTimeout(r, MIN_SPINNER_MS - elapsed));
        }
        if (mounted.current) {
          setData((prev) => ({ ...prev, loading: false, error: true }));
        }
      }
    })();

    // ── Periodic refresh (no spinner needed) ──────────────────
    const refresh = async () => {
      try {
        const { profile, games } = await loadAll();
        if (!mounted.current) return;
        setData((prev) => {
          const updated: RobloxData = {
            profile: profile ?? prev.profile,
            games: games.length ? games : prev.games,
            loading: false,
            error: false,
            lastUpdated: Date.now(),
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('robloxData', JSON.stringify(updated));
          }
          return updated;
        });
      } catch {
        // silently ignore refresh errors
      }
    };

    const interval = setInterval(refresh, REFRESH_MS);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return data;
}
