import { useState, useEffect } from 'react';
import {
  Database,
  Shield,
  Radio,
  ArrowRight,
  ExternalLink,
  Calendar,
  Code2,
  Copy,
  Check,
  Menu,
  X,
  Users,
  Eye,
  Heart,
  ThumbsUp,
  Gamepad2,
  Activity,
  Play,
  Image as ImageIcon,
} from 'lucide-react';
import {
  SITE,
  SKILLS,
  TIMELINE,
  PROJECTS,
  GALLERY,
  type ProjectColor,
  type GalleryItem,
} from './config';
import { useRoblox, fmtNum, type RobloxGame } from './useRoblox';

const COLOR_TEXT: Record<ProjectColor, string> = {
  gold: 'text-[#CA8A04]',
  blue: 'text-[#94A3B8]',
  purple: 'text-[#DC2626]',
  green: 'text-[#22C55E]',
  red: 'text-[#DC2626]',
  gray: 'text-[#64748B]',
};

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'roblox', label: 'Live' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'history', label: 'History' },
  { id: 'contact', label: 'Contact' },
];

function ytId(url: string): string | null {
  return url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/)?.[1] ?? null;
}

// ── Header ───────────────────────────────────────────────────────
function Header({ currentSection, onNavigate }: { currentSection: string; onNavigate: (id: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-bg">
      <div className="max-w-4xl mx-auto px-6 h-[var(--nav-height)] flex items-center justify-between">
        <button onClick={() => onNavigate('hero')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
            <Database className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <span className="font-display font-bold text-lg">
            <span className="text-[var(--text-primary)]">Water</span>
            <span className="text-[var(--text-muted)]">.Portfolio</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`font-mono text-xs tracking-wider uppercase transition-colors ${
                currentSection === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[var(--text-secondary)]">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden header-bg border-t border-[var(--border)]">
          <nav className="flex flex-col p-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`font-mono text-sm tracking-wider uppercase text-left px-4 py-2 rounded transition-colors ${
                  currentSection === item.id ? 'text-[var(--accent)] bg-[rgba(185,28,28,0.1)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────
function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section id="hero" className="min-h-[90vh] flex items-center pt-[var(--nav-height)] px-6">
      <div className="max-w-3xl mx-auto w-full">
        <div className="space-y-8 animate-fade-in">
          <div className="section-badge stagger-1">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            Available for commissions
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] stagger-2">
            Water<span className="text-[var(--accent)]">.</span>Portfolio
          </h1>

          <p className="text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed stagger-3">
            Roblox developer focused on backend systems, UI design, gameplay mechanics, and performance optimization.
          </p>

          <div className="pt-6 stagger-4">
            <button onClick={() => onNavigate('projects')} className="btn btn-primary">
              View Projects
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 stagger-5">
            {SITE.stats.map((s) => (
              <div key={s.label} className="stat-item cursor-default">
                <div className="hud-value transition-colors">{s.value}</div>
                <div className="hud-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="card card-accent p-6 space-y-5 md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                <Code2 className="w-7 h-7 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">WATER</h3>
                <p className="font-mono text-xs text-[var(--text-muted)]">Roblox Developer · {SITE.age}</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between py-2.5 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Role</span>
                <span className="text-[var(--text-secondary)]">Backend / UI / Gameplay</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Experience</span>
                <span className="text-[var(--text-secondary)]">4+ Years</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Status</span>
                <span className="flex items-center gap-2 text-[#22C55E]">
                  <span className="w-2 h-2 rounded-full bg-current" /> Available
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-[var(--text-muted)]">Discord</span>
                <span className="text-[var(--text-secondary)]">{SITE.discord}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:col-span-3">
            <div className="section-badge"><Shield className="w-3.5 h-3.5" /> About</div>
            <div className="section-divider" />
            <h2 className="section-title">
              Building Systems That <span className="section-accent">Work</span>
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
              I&apos;m a self-taught Roblox developer focused on building reliable, performant systems. I care about clean code, proper architecture, and ensuring the things I build actually work under pressure.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              My work spans backend systems, data persistence, gameplay mechanics, and user interfaces. I approach each project with attention to detail and a focus on delivering something that&apos;s not just functional, but well-made.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {['Luau', 'DataStore', 'ProfileService', 'UI/UX', 'Figma', 'Optimization'].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Skills ───────────────────────────────────────────────────────
function Skills() {
  const coreSkills = SKILLS.filter(s => ['Luau', 'Backend', 'Gameplay', 'UI/UX'].includes(s.name));
  const toolSkills = SKILLS.filter(s => !['Luau', 'Backend', 'Gameplay', 'UI/UX'].includes(s.name));

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="section-badge">Skills</div>
          <h2 className="section-title">Technical Capabilities</h2>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-5">
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border)]">
              Core Development
            </h3>
            <div className="skills-list">
              {coreSkills.map((skill) => (
                <span key={skill.name} className={`tag ${COLOR_TEXT[skill.color]}`}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] pb-3 border-b border-[var(--border)]">
              Tools & Systems
            </h3>
            <div className="skills-list">
              {toolSkills.map((skill) => (
                <span key={skill.name} className={`tag ${COLOR_TEXT[skill.color]}`}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Live Roblox ──────────────────────────────────────────────────
function GameCard({ game }: { game: RobloxGame }) {
  const ratio = game.upVotes + game.downVotes > 0 ? Math.round((game.upVotes / (game.upVotes + game.downVotes)) * 100) : null;

  return (
    <a href={game.link} target="_blank" rel="noopener noreferrer" className="card overflow-hidden flex flex-col">
      <div className="relative h-40 bg-[var(--bg-elevated)]">
        {game.bannerUrl ? (
          <img src={game.bannerUrl} alt={game.title} crossOrigin="anonymous" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 text-[var(--text-muted)]" />
          </div>
        )}
        <div className="absolute top-3 left-3 live-badge">
          <span className="live-dot" /> {fmtNum(game.playing)} playing
        </div>
        {game.iconUrl && (
          <img src={game.iconUrl} alt="" crossOrigin="anonymous" className="absolute bottom-3 left-3 w-12 h-12 rounded-lg border border-[var(--border)]" />
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{game.title}</h3>
        <div className="flex gap-5 text-sm text-[var(--text-muted)]">
          <span><Eye className="w-4 h-4 inline mr-1.5" />{fmtNum(game.visits)}</span>
          <span><Heart className="w-4 h-4 inline mr-1.5" />{fmtNum(game.favorites)}</span>
          {ratio != null && <span><ThumbsUp className="w-4 h-4 inline mr-1.5" />{ratio}%</span>}
        </div>
      </div>
    </a>
  );
}

function RobloxLive({ data }: { data: ReturnType<typeof useRoblox> }) {
  const { profile, games, loading, lastUpdated } = data;

  return (
    <section id="roblox" className="py-32 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="section-badge"><Activity className="w-3.5 h-3.5" /> Live Stats</div>
          <h2 className="section-title">Live Roblox Stats</h2>
          <div className="section-divider mx-auto" />
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">
            Real-time player counts and statistics from the Roblox API.
          </p>
          {lastUpdated && (
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Last synced {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="card card-accent p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
            {profile?.headshotUrl ? (
              <img src={profile.headshotUrl} alt="Avatar" crossOrigin="anonymous" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-10 h-10 text-[var(--text-muted)]" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              {profile?.displayName ?? SITE.name}
            </h3>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              @{profile?.username ?? 'water'}
            </p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="hud-value text-[var(--accent)]">{fmtNum(profile?.followers)}</div>
              <div className="hud-label">Followers</div>
            </div>
            <div className="text-center">
              <div className="hud-value">{fmtNum(profile?.friends)}</div>
              <div className="hud-label">Friends</div>
            </div>
          </div>
        </div>

        {loading && <div className="flex justify-center"><div className="spinner" /></div>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading && !games.length ? (
            <>
              <div className="card"><div className="h-40 bg-[var(--bg-elevated)] rounded-t" /><div className="p-4 space-y-2"><div className="h-5 w-2/3 bg-[var(--bg-elevated)] rounded" /></div></div>
              <div className="card"><div className="h-40 bg-[var(--bg-elevated)] rounded-t" /><div className="p-4 space-y-2"><div className="h-5 w-2/3 bg-[var(--bg-elevated)] rounded" /></div></div>
              <div className="card"><div className="h-40 bg-[var(--bg-elevated)] rounded-t" /><div className="p-4 space-y-2"><div className="h-5 w-2/3 bg-[var(--bg-elevated)] rounded" /></div></div>
            </>
          ) : (
            games.map((game) => <GameCard key={game.universeId} game={game} />)
          )}
        </div>
      </div>
    </section>
  );
}

// ── Projects ─────────────────────────────────────────────────────
function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  const isYt = project.media === 'youtube';
  const videoId = isYt ? ytId(project.src) : null;
  const thumb = isYt && videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : project.src;
  const href = project.link || project.src;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="card overflow-hidden flex flex-col">
      <div className="relative h-32 bg-[var(--bg-elevated)]">
        {thumb ? (
          <img src={thumb} alt={project.title} crossOrigin="anonymous" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Code2 className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
        )}
        {isYt && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-base)]/50">
            <span className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display font-bold text-[var(--text-primary)]">{project.title}</h3>
          <span className="tag shrink-0">{project.category}</span>
        </div>
        <p className="text-sm text-[var(--text-muted)] line-clamp-2">{project.description}</p>
      </div>
    </a>
  );
}

function Projects() {
  const categories = ['ALL', ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="space-y-4">
          <div className="section-badge"><Database className="w-3.5 h-3.5" /> Projects</div>
          <h2 className="section-title">Featured Work</h2>
          <div className="section-divider" />
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`filter-btn ${filter === cat ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => <ProjectCard key={project.title} project={project} />)}
        </div>
      </div>
    </section>
  );
}

// ── Gallery ──────────────────────────────────────────────────────
function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const categories = ['ALL', ...Array.from(new Set(GALLERY.map((p) => p.category)))];
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? GALLERY : GALLERY.filter((p) => p.category === filter);

  const handlePrev = () => {
    if (selectedIndex > 0) { setSelectedItem(filtered[selectedIndex - 1]); setSelectedIndex(selectedIndex - 1); }
  };
  const handleNext = () => {
    if (selectedIndex < filtered.length - 1) { setSelectedItem(filtered[selectedIndex + 1]); setSelectedIndex(selectedIndex + 1); }
  };

  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = ''; };
  }, [selectedItem, selectedIndex]);

  return (
    <section id="gallery" className="py-32 px-6">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <div className="space-y-4">
          <div className="section-badge"><ImageIcon className="w-3.5 h-3.5" /> Gallery</div>
          <h2 className="section-title">UI Showcase</h2>
          <div className="section-divider" />
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`filter-btn ${filter === cat ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, index) => (
            <button
              key={item.title}
              onClick={() => { setSelectedItem(item); setSelectedIndex(index); }}
              className="card overflow-hidden text-left"
            >
              <div className="relative h-40 bg-[var(--bg-elevated)]">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3">
                  <span className="tag">{item.category}</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-display font-bold text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--bg-base)]/95" onClick={() => setSelectedItem(null)} />
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-10 p-2">
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            {selectedIndex > 0 && (
              <button onClick={handlePrev} className="absolute left-4 z-10 p-2">
                <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] rotate-180" />
              </button>
            )}
            {selectedIndex < filtered.length - 1 && (
              <button onClick={handleNext} className="absolute right-4 z-10 p-2">
                <ArrowRight className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            )}
            <div className="relative z-10 max-w-4xl w-full">
              <div className="card overflow-hidden">
                <img src={selectedItem.src} alt={selectedItem.title} className="w-full max-h-[70vh] object-contain bg-[var(--bg-elevated)]" />
              </div>
              <div className="pt-4 space-y-2">
                <span className="tag">{selectedItem.category}</span>
                <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{selectedItem.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── History ──────────────────────────────────────────────────────
function History() {
  return (
    <section id="history" className="py-32 px-6">
      <div className="max-w-3xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="section-badge"><Calendar className="w-3.5 h-3.5" /> Timeline</div>
          <h2 className="section-title">Development Timeline</h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />
          <div className="space-y-8">
            {TIMELINE.map((item, index) => (
              <div key={index} className={`relative flex items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div
                  className={`timeline-node absolute left-4 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 ${
                    item.accent ? 'bg-[var(--accent)] timeline-node accent' : 'bg-[var(--silver-muted)]'
                  }`}
                />
                <div
                  className={`card ml-10 md:ml-0 md:w-[calc(50%-1.5rem)] p-5 ${
                    index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  } ${item.dim ? 'opacity-60' : ''}`}
                >
                  <div className="font-mono text-xs text-[var(--accent)] mb-2 tracking-wider">{item.period}</div>
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ──────────────────────────────────────────────────────
function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(SITE.discord); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-lg mx-auto w-full space-y-12 text-center">
        <div className="space-y-4">
          <div className="section-badge"><Radio className="w-3.5 h-3.5" /> Contact</div>
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-divider mx-auto" />
          <p className="text-[var(--text-muted)]">
            Interested in working together? Reach out through Discord.
          </p>
        </div>

        <div className="inline-flex items-center gap-4 px-5 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="font-mono text-xs text-[#22C55E] uppercase tracking-wider">Online</span>
        </div>

        <div className="space-y-4">
          <button onClick={handleCopy} className="w-full card p-5 flex items-center gap-5 text-left">
            <div className="w-12 h-12 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 8.776-.32 13.043.099 17.262a.08.08 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 14.75c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-1">Discord</div>
              <div className="font-display text-lg font-bold text-[var(--text-primary)]">{SITE.discord}</div>
            </div>
            {copied ? <Check className="w-5 h-5 text-[#22C55E]" /> : <Copy className="w-5 h-5 text-[var(--text-muted)]" />}
          </button>

          <a href={SITE.robloxProfile} target="_blank" rel="noopener noreferrer" className="w-full card p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-[rgba(185,28,28,0.1)] flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-1">Roblox Profile</div>
              <div className="font-display text-lg font-bold text-[var(--text-primary)]">View Profile</div>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--text-muted)]" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── App ──────────────────────────────────────────────────────────
function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const roblox = useRoblox();

  const handleNavigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      for (const item of NAV_ITEMS) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setCurrentSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Header currentSection={currentSection} onNavigate={handleNavigate} />
      <main>
        <Hero onNavigate={handleNavigate} />
        <About />
        <Skills />
        <RobloxLive data={roblox} />
        <Projects />
        <Gallery />
        <History />
        <Contact />
      </main>
    </div>
  );
}

export default App;
