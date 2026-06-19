// Real portfolio data (synced from config.js)

export type ProjectColor = 'gold' | 'blue' | 'purple' | 'green' | 'red' | 'gray';
export type ProjectMedia = 'image' | 'youtube';

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  link: string;
  media: ProjectMedia;
  src: string;
  color: ProjectColor;
}

export interface Skill {
  name: string;
  pct: number;
  desc: string;
  color: ProjectColor;
}

export interface TimelineItem {
  title: string;
  period: string;
  description: string;
  tags: string[];
  accent?: boolean;
  dim?: boolean;
}

export interface GalleryItem {
  title: string;
  category: string;
  description: string;
  src: string;
  tags: string[];
}

export const SITE = {
  name: 'Water',
  age: 16,
  discord: 'hokpy',
  robloxUserId: '2878666652',
  robloxProfile: 'https://www.roblox.com/users/2878666652/profile',

  stats: [
    { value: '20+', label: 'Commissions' },
    { value: '4 yrs', label: 'Experience' },
    { value: '40%', label: 'Avg Lag Fix' },
  ],
};

export const SKILLS: Skill[] = [
  { name: 'Luau Engineering', pct: 98, desc: 'OOP · Modules · Parallel Luau', color: 'blue' },
  { name: 'Backend Systems', pct: 95, desc: 'DataStores · ProfileService · Networking', color: 'gold' },
  { name: 'UI / UX Design', pct: 90, desc: 'Figma · Interface Design · User Flow', color: 'purple' },
  { name: 'Gameplay Systems', pct: 92, desc: 'Quest Engines · Combat · Mechanics', color: 'blue' },
];

export const FUN_SKILLS: Skill[] = [
  { name: 'Sleep Schedule', pct: 2, desc: 'caffeine-dependent', color: 'red' },
  { name: 'Touching Grass', pct: 5, desc: 'rare event, treat gently', color: 'green' },
  { name: 'Googling Errors', pct: 99, desc: 'Stack Overflow MVP', color: 'gold' },
  { name: 'Charging Fair Rates', pct: 75, desc: 'fair & negotiable', color: 'blue' },
];

export const TIMELINE: TimelineItem[] = [
  {
    title: 'Freelance Systems Engineer',
    period: '2022 – Present',
    description:
      'Built backend systems, gameplay mechanics, and user interfaces for Roblox games ranging from small commissions to full experiences.',
    tags: ['DataStore', 'UI', 'Gameplay', 'Optimization'],
    accent: true,
  },
  {
    title: 'Junior Developer',
    period: '2021 – 2022',
    description: 'Started with Lua and learned through practice, mistakes, debugging, and a lot of trial and error.',
    tags: [],
  },
  {
    title: 'The Beginning',
    period: '~2020',
    description: 'Opened Studio for the first time, moved a baseplate around, and thought that counted as development.',
    tags: [],
    dim: true,
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Chillin Place',
    category: 'FULL GAME',
    description: 'Complete hangout place with DataStore persistence and polished presentation.',
    tags: ['Game Design', 'DataStore', 'UI'],
    link: 'https://www.roblox.com/games/17290214724/Chillin-Place',
    media: 'image',
    src: 'https://tr.rbxcdn.com/180DAY-c69740761a8556385075f48b5b71147a/768/432/Image/Png/noFilter',
    color: 'gold',
  },
  {
    title: 'Escape Lava: Collect Brainrots',
    category: 'FULL GAME',
    description: 'Casual escape game with progression, UI flow, and saved player data.',
    tags: ['Game Design', 'DataStore', 'UI'],
    link: 'https://www.roblox.com/games/85862915773488/Escape-Lava-to-collect-brainrots',
    media: 'image',
    src: 'https://tr.rbxcdn.com/180DAY-1f5e4f49f3ff9eddbf732387c8b19cd7/768/432/Image/Webp/noFilter',
    color: 'gold',
  },
  {
    title: 'Operation: Azure Rift',
    category: 'FULL GAME',
    description: 'Story-driven FPS with systems, UI, and narrative structure inspired by Blue Archive.',
    tags: ['FPS', 'Narrative', 'UI'],
    link: 'https://www.roblox.com/games/140471518514522/Operation-Azure-Rift',
    media: 'image',
    src: 'https://tr.rbxcdn.com/180DAY-48fa84d77e3cb3cddf71475cd9b09d67/768/432/Image/Webp/noFilter',
    color: 'blue',
  },
  {
    title: 'Yan-Chan Simulator',
    category: 'FULL GAME',
    description: 'A Roblox adaptation focused on progression, presentation, and gameplay flow.',
    tags: ['Story', 'Simulator', 'UI'],
    link: 'https://www.roblox.com/games/90515983274647/Yan-Chan-Simulator',
    media: 'image',
    src: 'https://tr.rbxcdn.com/180DAY-cae9bb90f7a6e78c66ed1e18af2727e6/768/432/Image/Webp/noFilter',
    color: 'purple',
  },
  {
    title: 'Blind Mode Logic',
    category: 'GAMEPLAY',
    description: 'Vision restriction mechanic with dynamic spawn handling and clean game-state control.',
    tags: ['Lighting', 'Camera'],
    link: '',
    media: 'youtube',
    src: 'https://youtu.be/k8hV66kJ8cc',
    color: 'blue',
  },
  {
    title: 'Quest Engine',
    category: 'RPG SYSTEM',
    description: 'Branching dialogue system with quest progression and smooth UI transitions.',
    tags: ['ModuleScript', 'UI Tweening'],
    link: '',
    media: 'youtube',
    src: 'https://www.youtube.com/watch?v=_HTzGpFwIiU',
    color: 'purple',
  },
  {
    title: 'Dialogue System',
    category: 'RPG SYSTEM',
    description: 'Simple FPS dialogue system built for readability, pacing, and clean interaction flow.',
    tags: ['ModuleScript', 'UI Tweening'],
    link: '',
    media: 'youtube',
    src: 'https://youtu.be/XJgOCA_q4mM',
    color: 'purple',
  },
  {
    title: 'Farm Optimization',
    category: 'OPTIMIZATION',
    description: 'Backend refactor that reduced server lag by 40% and improved overall stability.',
    tags: ['Optimization', 'Memory'],
    link: '',
    media: 'youtube',
    src: 'https://youtu.be/YyX5ma58v2Q',
    color: 'gray',
  },
  {
    title: 'Door Kicking Engine',
    category: 'GAMEPLAY',
    description: 'Physics-based door interaction system using CFrame and responsive player control.',
    tags: ['ModuleScript', 'CFrame'],
    link: '',
    media: 'youtube',
    src: 'https://youtu.be/FjZHsIuzUlY',
    color: 'purple',
  },
];

export const GALLERY: GalleryItem[] = [
  {
    title: 'Main Menu System',
    category: 'UI DESIGN',
    description: 'Clean, responsive main menu with animated transitions and hover effects.',
    src: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Menu', 'Animation', 'Responsive'],
  },
  {
    title: 'Inventory Interface',
    category: 'UI DESIGN',
    description: 'Drag-and-drop inventory system with item tooltips and category filtering.',
    src: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Inventory', 'Drag & Drop', 'Tooltips'],
  },
  {
    title: 'Settings Panel',
    category: 'UI DESIGN',
    description: 'Comprehensive settings panel with sliders, toggles, and real-time preview.',
    src: 'https://images.pexels.com/photos/261528/pexels-photo-261528.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Settings', 'Sliders', 'Controls'],
  },
  {
    title: 'Health & HUD System',
    category: 'UI DESIGN',
    description: 'Dynamic health bars, ammo counters, and minimap integration for gameplay.',
    src: 'https://images.pexels.com/photos/316466/pexels-photo-316466.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['HUD', 'Health Bar', 'Minimap'],
  },
  {
    title: 'Quest Journal',
    category: 'UI DESIGN',
    description: 'Quest tracking interface with progress indicators and reward previews.',
    src: 'https://images.pexels.com/photos/1114410/pexels-photo-1114410.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Quest', 'Progress', 'Journal'],
  },
  {
    title: 'Shop Interface',
    category: 'UI DESIGN',
    description: 'In-game shop with item previews, pricing, and purchase confirmation flow.',
    src: 'https://images.pexels.com/photos/230676/pexels-photo-230676.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Shop', 'Purchase', 'Preview'],
  },
  {
    title: 'Notification System',
    category: 'UI DESIGN',
    description: 'Animated notification popups with queuing and priority handling.',
    src: 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Notifications', 'Animation', 'Queue'],
  },
  {
    title: 'Character Customization',
    category: 'UI DESIGN',
    description: 'Character editor with color pickers, sliders, and live 3D preview.',
    src: 'https://images.pexels.com/photos/1222272/pexels-photo-1222272.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Customization', 'Color Picker', '3D Preview'],
  },
];
