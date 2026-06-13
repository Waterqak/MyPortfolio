import { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Database,
  Cpu,
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
} from 'lucide-react';
import {
  SITE,
  SKILLS,
  FUN_SKILLS,
  TIMELINE,
  PROJECTS,
  type ProjectColor,
} from './config';
import { useRoblox, fmtNum, type RobloxGame } from './useRoblox';

// ── Color maps (kept within the steel / crimson / brass palette) ──
const COLOR_TEXT: Record<ProjectColor, string> = {
  gold: 'text-[var(--brass-bright)]',
  blue: 'text-[var(--silver-bright)]',
  purple: 'text-[var(--accent-bright)]',
  green: 'text-[#22C55E]',
  red: 'text-[var(--accent-bright)]',
  gray: 'text-[var(--text-muted)]',
};
const COLOR_BORDER_TOP: Record<ProjectColor, string> = {
  gold: 'border-t-[var(--brass)]',
  blue: 'border-t-[var(--silver)]',
  purple: 'border-t-[var(--accent)]',
  green: 'border-t-[#22C55E]',
  red: 'border-t-[var(--accent)]',
  gray: 'border-t-[var(--silver-muted)]',
};
const COLOR_FILL: Record<ProjectColor, string> = {
  gold: 'var(--brass-bright)',
  blue: 'var(--silver)',
  purple: 'var(--accent)',
  green: '#22C55E',
  red: 'var(--accent)',
  gray: 'var(--silver-muted)',
};

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'roblox', label: 'Live' },
  { id: 'projects', label: 'Projects' },
  { id: 'history', label: 'History' },
  { id: 'contact', label: 'Contact' },
];

const TERMINAL_COMMANDS: Record<string, string> = {
  help: 'Available commands: help, skills, projects, about, clear, status',
  skills: 'Luau (98%), Backend (95%), Gameplay (92%), UI/UX (90%)',
  projects: 'Chillin Place, Escape Lava, Operation: Azure Rift, Yan-Chan Simulator',
  about: 'Water - Roblox developer focused on backend systems, UI & gameplay',
  status: 'System Online | Live stats syncing | Accepting commissions',
  clear: '',
};

function ytId(url: string): string | null {
  return url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/)?.[1] ?? null;
}

// ── Signature indexed section header ─────────────────────────────
function SectionHeader({
  index,
  label,
  title,
  description,
  icon: Icon,
  center = false,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  center?: boolean;
}) {
  return (
    <div className={`flex gap-4 sm:gap-5 ${center ? 'flex-col items-center text-center' : 'items-start'}`}>
      <span
        aria-hidden="true"
        className="section-index font-display font-bold leading-none select-none"
      >
        {index}
      </span>
      <div className={`space-y-3 ${center ? '' : 'pt-1'}`}>
        <div
          className={`flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent-bright)] ${center ? 'justify-center' : ''}`}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{label}</span>
          <span className="h-px w-10 bg-[var(--border-accent)]" />
        </div>
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className={`text-[var(--text-muted)] leading-relaxed ${center ? 'max-w-lg mx-auto' : 'max-w-lg'}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────
function Header({ currentSection, onNavigate }: { currentSection: string; onNavigate: (id: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 h-[var(--nav-height)] flex items-center justify-between">
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded bg-[var(--bg-surface)] border border-[var(--border-accent)] flex items-center justify-center">
            <Database className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <span className="font-display font-bold text-lg tracking-wide">
            <span className="text-[var(--text-primary)]">Water</span>
            <span className="text-[var(--silver-muted)]">.Portfolio</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`font-mono text-xs tracking-widest uppercase transition-colors relative
                ${currentSection === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
            >
              {item.label}
              {currentSection === item.id && (
                <span className="absolute -bottom-2 left-0 right-0 h-px bg-[var(--accent)]" />
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[var(--text-secondary)]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-[var(--border)]">
          <nav className="flex flex-col p-4 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`font-mono text-sm tracking-wider uppercase text-left px-4 py-2 rounded transition-colors
                  ${currentSection === item.id
                    ? 'text-[var(--accent)] bg-[var(--accent-muted)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'}`}
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

// ── Terminal ─────────────────────────────────────────────────────
function TerminalComponent() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['$ System initialized. Type "help" for commands.']);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'clear') {
      setOutput([]);
    } else if (TERMINAL_COMMANDS[trimmed]) {
      setOutput((prev) => [...prev, `> ${cmd}`, TERMINAL_COMMANDS[trimmed]]);
    } else {
      setOutput((prev) => [...prev, `> ${cmd}`, `Command not found: ${cmd}`]);
    }
    setInput('');
  };

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
            Command Interface
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="terminal-dot bg-[#EF4444]" />
          <div className="terminal-dot bg-[#EAB308]" />
          <div className="terminal-dot bg-[#22C55E]" />
        </div>
      </div>
      <div ref={outputRef} className="terminal-body h-40 overflow-y-auto text-[var(--text-secondary)]">
        {output.map((line, i) => (
          <div key={i} className={line.startsWith('>') ? 'text-[var(--silver)]' : ''}>
            {line}
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] px-4 py-3 flex items-center gap-2">
        <span className="text-[var(--accent)] font-mono">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          placeholder="Enter command..."
          aria-label="Terminal command input"
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <span className="w-2 h-4 bg-[var(--accent)] animate-blink" />
      </div>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────
function Hero({ onNavigate, totalPlaying }: { onNavigate: (id: string) => void; totalPlaying: number | null }) {
  const [phrase, setPhrase] = useState(0);
  const phrases = ['Systems Online', 'Code Compiled', 'Mission Ready'];

  useEffect(() => {
    const interval = setInterval(() => setPhrase((p) => (p + 1) % phrases.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-[var(--nav-height)] px-6">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4 animate-fade-in">
            <div className="section-badge stagger-1">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>
                {totalPlaying != null && totalPlaying > 0
                  ? `${fmtNum(totalPlaying)} playing my games now`
                  : 'Available for commissions'}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-tight stagger-2">
              Water<span className="text-glow">.</span>Portfolio
            </h1>

            <p className="text-lg text-[var(--text-secondary)] max-w-md stagger-3">
              Roblox developer focused on backend systems, UI design, gameplay mechanics, and performance
              optimization.
            </p>

            <div className="font-mono text-sm text-[var(--silver-muted)] stagger-4">
              <span className="text-[var(--accent)]">&gt;</span>{' '}
              <span className="text-[var(--text-primary)]">{phrases[phrase]}</span>
              <span className="animate-blink text-[var(--accent)]">_</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 animate-fade-in stagger-4">
            <button onClick={() => onNavigate('projects')} className="btn btn-primary">
              View Projects
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onNavigate('roblox')} className="btn btn-secondary">
              <Activity className="w-4 h-4" />
              Live Stats
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 animate-fade-in stagger-5">
            {SITE.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="hud-value">{s.value}</div>
                <div className="hud-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block animate-slide-right">
          <TerminalComponent />
        </div>
      </div>
    </section>
  );
}

// ── About ────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="card card-accent p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="section-badge">Personnel File</span>
              <span className="font-mono text-[10px] text-[var(--silver-muted)]">CLEARANCE: LEVEL 1</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">WATER</h3>
                  <p className="font-mono text-xs text-[var(--text-muted)]">Roblox Developer · {SITE.age}</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Role</span>
                  <span className="text-[var(--text-secondary)]">Backend / UI / Gameplay</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Experience</span>
                  <span className="text-[var(--text-secondary)]">4+ Years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Status</span>
                  <span className="flex items-center gap-2 text-[#22C55E]">
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    Available
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[var(--text-muted)]">Discord</span>
                  <span className="text-[var(--text-secondary)]">{SITE.discord}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="section-badge">
              <Shield className="w-3.5 h-3.5" />
              About
            </div>

            <h2 className="section-title">
              Building Systems That <span className="text-glow">Work</span>
            </h2>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              I&apos;m a self-taught Roblox developer focused on building reliable, performant systems. I care about
              clean code, proper architecture, and ensuring the things I build actually work under pressure.
            </p>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              My work spans backend systems, data persistence, gameplay mechanics, and user interfaces. I approach
              each project with attention to detail and a focus on delivering something that&apos;s not just functional,
              but well-made.
            </p>

            <div className="p-4 bg-[var(--bg-surface)] border-l-2 border-[var(--accent)] rounded-r">
              <p className="text-sm text-[var(--text-primary)] italic">
                &quot;Clean systems lead to better gameplay. Better gameplay leads to happier players. Happy players
                lead to better games.&quot;
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Luau', 'DataStore', 'ProfileService', 'UI/UX', 'Figma', 'Optimization'].map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Skills ───────────────────────────────────────────────────────
function SkillBar({ skill, isVisible, index }: { skill: (typeof SKILLS)[number]; isVisible: boolean; index: number }) {
  return (
    <div className="card p-5 space-y-3" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="flex justify-between items-center">
        <span className="font-mono text-sm text-[var(--text-primary)]">{skill.name}</span>
        <span className={`font-mono text-xs ${COLOR_TEXT[skill.color]}`}>{skill.pct}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: isVisible ? `${skill.pct}%` : '0%',
            transitionDelay: `${index * 0.1}s`,
            background: COLOR_FILL[skill.color],
          }}
        />
      </div>
      <p className="font-mono text-[10px] text-[var(--text-muted)]">{skill.desc}</p>
    </div>
  );
}

function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="section-badge inline-flex">
            <Cpu className="w-3.5 h-3.5" />
            Systems Specs
          </div>
          <h2 className="section-title">Technical Capabilities</h2>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            Core competencies in Roblox development, from backend to UI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {SKILLS.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} isVisible={isVisible} index={index} />
          ))}
        </div>

        <div className="text-center pt-4">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">
            // Unofficial Diagnostics
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {FUN_SKILLS.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} isVisible={isVisible} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Live Roblox ──────────────────────────────────────────────────
function StatPill({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-2 rounded bg-[var(--bg-elevated)] border border-[var(--border)]">
      <div className="flex items-center gap-1.5 text-[var(--silver)]">
        {icon}
        <span className="font-display font-bold text-sm text-[var(--text-primary)]">{value}</span>
      </div>
      <span className="hud-label !text-[9px]">{label}</span>
    </div>
  );
}

function GameCard({ game }: { game: RobloxGame }) {
  const ratio =
    game.upVotes + game.downVotes > 0
      ? Math.round((game.upVotes / (game.upVotes + game.downVotes)) * 100)
      : null;

  return (
    <a
      href={game.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card overflow-hidden group flex flex-col"
    >
      <div className="relative h-44 overflow-hidden bg-[var(--bg-elevated)]">
        {game.bannerUrl ? (
          <img
            src={game.bannerUrl}
            alt={`${game.title} thumbnail`}
            crossOrigin="anonymous"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
        )}
        {/* Live playing badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--bg-deep)]/85 border border-[#22C55E]/40 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-[#22C55E]">
            {fmtNum(game.playing)} playing
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent opacity-80" />
        {game.iconUrl && (
          <img
            src={game.iconUrl}
            alt=""
            crossOrigin="anonymous"
            className="absolute bottom-3 left-3 w-12 h-12 rounded-lg border border-[var(--border)] shadow-lg"
          />
        )}
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] transition-colors">
            {game.title}
          </h3>
          <Play className="w-4 h-4 text-[var(--text-muted)] shrink-0 group-hover:text-[var(--accent)] transition-colors" />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-auto">
          <StatPill icon={<Eye className="w-3.5 h-3.5" />} value={fmtNum(game.visits)} label="Visits" />
          <StatPill icon={<Heart className="w-3.5 h-3.5" />} value={fmtNum(game.favorites)} label="Favorites" />
          <StatPill
            icon={<ThumbsUp className="w-3.5 h-3.5" />}
            value={ratio != null ? `${ratio}%` : '—'}
            label="Rating"
          />
        </div>
      </div>
    </a>
  );
}

function GameSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-44 bg-[var(--bg-elevated)] animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="h-5 w-2/3 bg-[var(--bg-elevated)] rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-[var(--bg-elevated)] rounded animate-pulse" />
          <div className="h-12 bg-[var(--bg-elevated)] rounded animate-pulse" />
          <div className="h-12 bg-[var(--bg-elevated)] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function RobloxLive({ data }: { data: ReturnType<typeof useRoblox> }) {
  const { profile, games, loading, error, lastUpdated } = data;

  return (
    <section id="roblox" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="section-badge inline-flex">
            <Activity className="w-3.5 h-3.5" />
            Live Telemetry
          </div>
          <h2 className="section-title">
            Live <span className="text-glow">Roblox</span> Stats
          </h2>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">
            Real-time player counts, visits, and favorites pulled straight from the Roblox API. Player counts
            auto-refresh every 30 seconds.
          </p>
          {lastUpdated && (
            <p className="font-mono text-[10px] text-[var(--silver-muted)]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22C55E] mr-2 align-middle animate-pulse" />
              Last synced {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Profile card */}
        <div className="card card-accent p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)] shrink-0 flex items-center justify-center">
            {profile?.headshotUrl ? (
              <img
                src={profile.headshotUrl}
                alt="Roblox avatar"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
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
              {profile?.created && ` · since ${new Date(profile.created).getFullYear()}`}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4">
              <div className="hud-value text-[var(--accent)]">{fmtNum(profile?.followers)}</div>
              <div className="hud-label">Followers</div>
            </div>
            <div className="w-px bg-[var(--border)]" />
            <div className="text-center px-4">
              <div className="hud-value">{fmtNum(profile?.friends)}</div>
              <div className="hud-label">Friends</div>
            </div>
          </div>
        </div>

        {/* Games grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && !games.length ? (
            <>
              <GameSkeleton />
              <GameSkeleton />
              <GameSkeleton />
            </>
          ) : (
            games.map((game) => <GameCard key={game.universeId} game={game} />)
          )}
        </div>

        {error && !games.length && (
          <div className="card p-6 text-center space-y-2">
            <p className="text-[var(--text-secondary)]">Live stats are temporarily unavailable.</p>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              The Roblox API may be rate-limiting requests — try refreshing in a moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Projects ─────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const isYt = project.media === 'youtube';
  const videoId = isYt ? ytId(project.src) : null;
  const thumb = isYt && videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : project.src;
  const href = project.link || project.src;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`card ${COLOR_BORDER_TOP[project.color]} overflow-hidden group flex flex-col`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative h-40 bg-[var(--bg-elevated)] overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={`${project.title} preview`}
            crossOrigin="anonymous"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Code2 className="w-12 h-12 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
          </div>
        )}
        {isYt && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-deep)]/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </span>
          </div>
        )}
      </div>
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] transition-colors">
            {project.title}
          </h3>
          <span className="tag shrink-0">{project.category}</span>
        </div>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-[var(--silver-muted)]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

function Projects() {
  const categories = ['ALL', ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        <div className="space-y-4">
          <div className="section-badge">
            <Database className="w-3.5 h-3.5" />
            Project Database
          </div>
          <h2 className="section-title">Featured Work</h2>
          <p className="text-[var(--text-muted)] max-w-md">
            A selection of games, systems, and tools I&apos;ve built for Roblox.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded transition-colors
                ${filter === cat
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── History ──────────────────────────────────────────────────────
function History() {
  return (
    <section id="history" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-3xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="section-badge">
            <Calendar className="w-3.5 h-3.5" />
            Service Record
          </div>
          <h2 className="section-title">Development Timeline</h2>
          <p className="text-[var(--text-muted)]">Key milestones and progression through the years.</p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border)]" />
          <div className="space-y-8">
            {TIMELINE.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div
                  className={`absolute left-4 md:left-1/2 w-3 h-3 rounded-full border-2 border-[var(--bg-deep)] -translate-x-1/2 z-10 ${item.accent ? 'bg-[var(--accent)]' : 'bg-[var(--silver-muted)]'}`}
                />
                <div
                  className={`card ml-12 md:ml-0 md:w-[calc(50%-2rem)] p-5 ${item.dim ? 'opacity-70' : ''} ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                >
                  <div className="font-mono text-xs text-[var(--accent)] mb-2">{item.period}</div>
                  <h3 className="font-display font-bold text-[var(--text-primary)] mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                  {item.tags.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 pt-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
    try {
      await navigator.clipboard.writeText(SITE.discord);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-2xl mx-auto w-full space-y-12 text-center">
        <div className="space-y-4">
          <div className="section-badge inline-flex">
            <Radio className="w-3.5 h-3.5" />
            Contact
          </div>
          <h2 className="section-title">Open Communication</h2>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            Interested in working together? Send a message through Discord or check out my Roblox profile.
          </p>
        </div>

        <div className="inline-flex items-center gap-6 px-6 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-mono text-xs text-[#22C55E]">ONLINE</span>
          </div>
          <div className="w-px h-4 bg-[var(--border)]" />
          <div className="font-mono text-xs text-[var(--text-muted)]">Response: Fast</div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCopy}
            className="w-full card p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded bg-[#5865F2]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 8.776-.32 13.043.099 17.262a.08.08 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 14.75c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-1">Discord</div>
              <div className="font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {SITE.discord}
              </div>
            </div>
            {copied ? (
              <Check className="w-5 h-5 text-[#22C55E]" />
            ) : (
              <Copy className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
            )}
          </button>

          <a
            href={SITE.robloxProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full card p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors group"
          >
            <div className="w-12 h-12 rounded bg-[var(--accent-muted)] flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-1">Roblox Profile</div>
              <div className="font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                View Profile
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
          </a>
        </div>

        <div className="pt-8 space-y-2 text-[var(--text-muted)]">
          <div className="font-mono text-[10px] tracking-wider">WATER.PORTFOLIO // ROBLOX DEVELOPER</div>
          <div className="font-mono text-[10px] opacity-50">Built with React + Tailwind</div>
        </div>
      </div>
    </section>
  );
}

// ── App ──────────────────────────────────────────────────────────
function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const roblox = useRoblox();
  const totalPlaying = roblox.games.length
    ? roblox.games.reduce((sum, g) => sum + g.playing, 0)
    : null;

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
    <div className="min-h-screen grid-pattern">
      <Header currentSection={currentSection} onNavigate={handleNavigate} />
      <main>
        <Hero onNavigate={handleNavigate} totalPlaying={totalPlaying} />
        <About />
        <Skills />
        <RobloxLive data={roblox} />
        <Projects />
        <History />
        <Contact />
      </main>
    </div>
  );
}

export default App;
