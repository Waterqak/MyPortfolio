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

// ── CORS proxy helpers (client-only static site) ────────────────
// Roblox APIs don't send CORS headers, so requests are routed through
// public read-only proxies with a fallback chain for reliability.
const PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
  (u: string) => `https://api.allorigins.cf/raw?url=${encodeURIComponent(u)}`,
];

async function get<T>(url: string): Promise<T> {
  let lastErr: unknown;
  for (const wrap of PROXIES) {
    // Try each proxy up to two attempts to mitigate transient failures
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(wrap(url));
        if (!res.ok) {
          // If rate limited, wait before retrying next proxy
          if (res.status === 429) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
          }
          throw new Error(String(res.status));
        }
        return (await res.json()) as T;
      } catch (err) {
        lastErr = err;
        // If first attempt fails, retry after a short delay
        if (attempt === 1) await new Promise(r => setTimeout(r, 200));
      }
    }
  }
  // Final fallback: try direct request (may fail due to CORS)
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } catch (err) {
    // Propagate the most recent error
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

// ── Data loaders ────────────────────────────────────────────────
async function loadProfile(): Promise<RobloxProfile | null> {
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

async function loadGames(): Promise<RobloxGame[]> {
  const rbxProjects = PROJECTS.filter((p) => p.link.includes('roblox.com/games'));
  if (!rbxProjects.length) return [];

  // place id -> universe id
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

  // votes are a separate endpoint
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

// ── Hook ────────────────────────────────────────────────────────
const REFRESH_MS = 60_000; // live player counts refresh every 60 seconds (reduced load)

export function useRoblox(): RobloxData {
  // Attempt to load cached data for instant UI rendering
  const cached = typeof window !== 'undefined' ? localStorage.getItem('robloxData') : null;
  const initialData: RobloxData = cached ? JSON.parse(cached) : {
    profile: null,
    games: [],
    loading: true,
    error: false,
    lastUpdated: null,
  };
  const [data, setData] = useState<RobloxData>(initialData);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // Keep loading true briefly to show spinner even when data is cached
    setTimeout(() => {
      if (mounted.current) {
        setData((prev) => ({ ...prev, loading: false }));
      }
    }, 800);

    const refreshGames = async () => {
      try {
        const res = await fetch('/api/roblox');
      if (!res.ok) throw new Error(`Failed ${res.status} fetching Roblox games`);
      const { games } = await res.json();
      if (!mounted.current) return;
      const updated = {
        games: games.length ? games : data.games,
        loading: false,
        error: (!data.profile && !games.length) || (data.error && !games.length),
        lastUpdated: Date.now(),
      };
      if (typeof window !== 'undefined') {
        const cached = { ...data, ...updated };
        localStorage.setItem('robloxData', JSON.stringify(cached));
      }
      setData((prev) => ({ ...prev, ...updated }));
      } catch {
        if (mounted.current) setData((prev) => ({ ...prev, loading: false }));
      }
    };

    // initial load: profile + games together
    (async () => {
      const res = await fetch('/api/roblox');
      if (!res.ok) throw new Error(`Failed ${res.status} fetching Roblox data`);
      const { profile, games } = await res.json();
      const newData = {
        profile,
        games,
        loading: false,
        error: !profile && !games.length,
        lastUpdated: Date.now(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('robloxData', JSON.stringify(newData));
      }
      setData(newData);})();

    const interval = setInterval(refreshGames, REFRESH_MS);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return data;
}
