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
} from 'lucide-react';

// Data
const PROJECTS = [
  {
    id: 1,
    title: 'Combat System Framework',
    description: 'Modular weapon and damage system supporting multiple damage types, hit detection, and status effects.',
    category: 'GAMEPLAY',
    tags: ['Luau', 'Server-Client', 'Optimized'],
    color: 'crimson',
  },
  {
    id: 2,
    title: 'Tactical UI Library',
    description: 'Military-inspired UI component library with HUD elements, radar displays, and tactical overlays.',
    category: 'UI',
    tags: ['React', 'TypeScript', 'Figma'],
    color: 'silver',
  },
  {
    id: 3,
    title: 'DataStore Manager',
    description: 'Robust data persistence layer with session locking, versioning, and automatic migration support.',
    category: 'BACKEND',
    tags: ['Luau', 'DataStore', 'Migration'],
    color: 'brass',
  },
  {
    id: 4,
    title: 'Performance Optimizer',
    description: 'Diagnostic tool that identifies bottlenecks, memory leaks, and provides optimization recommendations.',
    category: 'OPTIMIZATION',
    tags: ['Profiler', 'Analysis', 'Reports'],
    color: 'crimson',
  },
  {
    id: 5,
    title: 'Inventory System',
    description: 'Slot-based inventory with drag-drop, stacking, sorting, and server-side validation.',
    category: 'GAMEPLAY',
    tags: ['Luau', 'UI', 'Networking'],
    color: 'silver',
  },
  {
    id: 6,
    title: 'Achievement Framework',
    description: 'Flexible achievement system with progress tracking, notifications, and data persistence.',
    category: 'BACKEND',
    tags: ['Luau', 'DataStore', 'Events'],
    color: 'brass',
  },
];

const SKILLS = [
  { name: 'Luau/Rojo', level: 95, category: 'core' },
  { name: 'Server Architecture', level: 90, category: 'core' },
  { name: 'UI/UX Design', level: 85, category: 'design' },
  { name: 'React/TypeScript', level: 80, category: 'web' },
  { name: 'Performance Optimization', level: 88, category: 'core' },
  { name: 'DataStore Systems', level: 92, category: 'core' },
  { name: 'Figma', level: 75, category: 'design' },
  { name: 'Game Design', level: 82, category: 'design' },
];

const TIMELINE = [
  {
    year: '2022',
    title: 'Started Roblox Development',
    description: 'Began learning Luau and game development fundamentals.',
    type: 'milestone',
  },
  {
    year: '2023',
    title: 'First Commission',
    description: 'Completed first paid project - a combat system for a military game.',
    type: 'work',
  },
  {
    year: '2023',
    title: 'Systems Architecture Focus',
    description: 'Shifted focus to backend systems and server-side optimization.',
    type: 'learning',
  },
  {
    year: '2024',
    title: '20+ Projects Completed',
    description: 'Reached milestone of successfully delivering over 20 commissioned projects.',
    type: 'milestone',
  },
  {
    year: '2024',
    title: 'UI/UX Specialization',
    description: 'Expanded into interface design and user experience optimization.',
    type: 'learning',
  },
];

const TERMINAL_COMMANDS: Record<string, string> = {
  help: 'Available commands: help, skills, projects, about, clear, status',
  skills: 'Core: Luau (95%), Server (90%), DataStore (92%)',
  projects: 'Combat System, UI Library, DataStore Manager, Performance Optimizer',
  about: 'Water - Roblox Developer specializing in backend systems and UI',
  status: 'System Online | All nodes operational | Accepting commissions',
  clear: '',
};

// Components
function Header({ currentSection, onNavigate }: { currentSection: string; onNavigate: (id: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'history', label: 'History' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 h-[var(--nav-height)] flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[var(--text-secondary)]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-[var(--border)]">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
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

function TerminalComponent() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    '$ System initialized. Type "help" for commands.',
  ]);
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
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
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
      <div
        ref={outputRef}
        className="terminal-body h-40 overflow-y-auto text-[var(--text-secondary)]"
      >
        {output.map((line, i) => (
          <div
            key={i}
            className={line.startsWith('>') ? 'text-[var(--silver)]' : ''}
          >
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
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <span className="w-2 h-4 bg-[var(--accent)] animate-blink" />
      </div>
    </div>
  );
}

function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [phrase, setPhrase] = useState(0);
  const phrases = ['Systems Online', 'Code Compiled', 'Mission Ready'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase((p) => (p + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-[var(--nav-height)] px-6"
    >
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4 animate-fade-in">
            <div className="section-badge stagger-1">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>Available for commissions</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-tight stagger-2">
              Water<span className="text-[var(--accent)]">.</span>Portfolio
            </h1>

            <p className="text-lg text-[var(--text-secondary)] max-w-md stagger-3">
              Roblox developer focused on backend systems, UI design,
              gameplay mechanics, and performance optimization.
            </p>

            <div className="font-mono text-sm text-[var(--silver-muted)] stagger-4">
              <span className="text-[var(--accent)]">&gt;</span>{' '}
              <span className="text-[var(--text-primary)]">{phrases[phrase]}</span>
              <span className="animate-blink text-[var(--accent)]">_</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 animate-fade-in stagger-4">
            <button
              onClick={() => onNavigate('projects')}
              className="btn btn-primary"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="btn btn-secondary"
            >
              <Radio className="w-4 h-4" />
              Contact
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 animate-fade-in stagger-5">
            <div className="text-center">
              <div className="hud-value">20+</div>
              <div className="hud-label">Projects</div>
            </div>
            <div className="text-center">
              <div className="hud-value">4+</div>
              <div className="hud-label">Years</div>
            </div>
            <div className="text-center">
              <div className="hud-value text-[var(--accent)]">95%</div>
              <div className="hud-label">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <div className="hidden lg:block animate-slide-right">
          <TerminalComponent />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Personnel Card */}
          <div className="card card-accent p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="section-badge">Personnel File</span>
              <span className="font-mono text-[10px] text-[var(--silver-muted)]">
                CLEARANCE: LEVEL 1
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    WATER
                  </h3>
                  <p className="font-mono text-xs text-[var(--text-muted)]">
                    Roblox Developer
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text-muted)]">Role</span>
                  <span className="text-[var(--text-secondary)]">
                    Backend / UI / Gameplay
                  </span>
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
                  <span className="text-[var(--text-muted)]">Response</span>
                  <span className="text-[var(--text-secondary)]">Fast</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="space-y-6">
            <div className="section-badge">
              <Shield className="w-3.5 h-3.5" />
              About
            </div>

            <h2 className="section-title">
              Building Systems That <span className="text-[var(--accent)]">Work</span>
            </h2>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              I'm a self-taught Roblox developer focused on building reliable,
              performant systems. I care about clean code, proper architecture,
              and ensuring the things I build actually work under pressure.
            </p>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              My work spans backend systems, data persistence, gameplay
              mechanics, and user interfaces. I approach each project with
              attention to detail and a focus on delivering something that's
              not just functional, but well-made.
            </p>

            <div className="p-4 bg-[var(--bg-surface)] border-l-2 border-[var(--accent)] rounded-r">
              <p className="text-sm text-[var(--text-primary)] italic">
                "Clean systems lead to better gameplay. Better gameplay leads
                to happier players. Happy players lead to better games."
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Luau', 'React', 'TypeScript', 'UI/UX', 'DataStore', 'Performance'].map(
                (skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="min-h-screen flex items-center py-24 px-6"
    >
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
            <div
              key={skill.name}
              className="card p-5 space-y-3"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-[var(--text-primary)]">
                  {skill.name}
                </span>
                <span className="font-mono text-xs text-[var(--accent)]">
                  {skill.level}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: isVisible ? `${skill.level}%` : '0%',
                    transitionDelay: `${index * 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [filter, setFilter] = useState('ALL');
  const categories = ['ALL', 'GAMEPLAY', 'UI', 'BACKEND', 'OPTIMIZATION'];

  const filteredProjects =
    filter === 'ALL'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);

  const colorMap: Record<string, string> = {
    crimson: 'border-t-[var(--accent)]',
    silver: 'border-t-[var(--silver)]',
    brass: 'border-t-[var(--brass)]',
  };

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
            A selection of systems and tools I've built for Roblox games.
          </p>
        </div>

        {/* Filters */}
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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`card ${colorMap[project.color]} overflow-hidden group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-40 bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--bg-surface)] transition-colors">
                <Code2 className="w-12 h-12 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display font-bold text-[var(--text-primary)] leading-tight">
                    {project.title}
                  </h3>
                  <span className="tag shrink-0">{project.category}</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-[var(--silver-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <p className="text-[var(--text-muted)]">
            Key milestones and progression through the years.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border)]" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {TIMELINE.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--bg-deep)] -translate-x-1/2 z-10" />

                {/* Content */}
                <div
                  className={`card ml-12 md:ml-0 md:w-[calc(50%-2rem)] p-5 ${
                    index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  <div
                    className={`font-mono text-xs text-[var(--accent)] mb-2 ${
                      index % 2 === 0 ? 'md:order-1' : ''
                    }`}
                  >
                    {item.year}
                  </div>
                  <h3
                    className={`font-display font-bold text-[var(--text-primary)] mb-1 ${
                      index % 2 === 0 ? 'md:order-2' : ''
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm text-[var(--text-muted)] ${
                      index % 2 === 0 ? 'md:order-3' : ''
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('hokpy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            Interested in working together? Send a message through Discord or
            check out my Roblox profile.
          </p>
        </div>

        {/* Status Bar */}
        <div className="inline-flex items-center gap-6 px-6 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-mono text-xs text-[#22C55E]">
              ONLINE
            </span>
          </div>
          <div className="w-px h-4 bg-[var(--border)]" />
          <div className="font-mono text-xs text-[var(--text-muted)]">
            Response: Fast
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-4">
          {/* Discord */}
          <button
            onClick={handleCopy}
            className="w-full card p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded bg-[#5865F2]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 8.776-.32 13.043.099 17.262a.08.08 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 14.75c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-1">
                Discord
              </div>
              <div className="font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                hokpy
              </div>
            </div>
            {copied ? (
              <Check className="w-5 h-5 text-[#22C55E]" />
            ) : (
              <Copy className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
            )}
          </button>

          {/* Roblox */}
          <a
            href="https://www.roblox.com/users/2878666652/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full card p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors group"
          >
            <div className="w-12 h-12 rounded bg-[var(--accent-muted)] flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <div className="font-mono text-xs text-[var(--text-muted)] mb-1">
                Roblox Profile
              </div>
              <div className="font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                View Profile
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
          </a>
        </div>

        {/* Footer */}
        <div className="pt-8 space-y-2 text-[var(--text-muted)]">
          <div className="font-mono text-[10px] tracking-wider">
            WATER.PORTFOLIO // ROBLOX DEVELOPER
          </div>
          <div className="font-mono text-[10px] opacity-50">
            Built with React + Tailwind
          </div>
        </div>
      </div>
    </section>
  );
}

// Main App
function App() {
  const [currentSection, setCurrentSection] = useState('hero');

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'history', 'contact'];

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setCurrentSection(id);
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
        <Hero onNavigate={handleNavigate} />
        <About />
        <Skills />
        <Projects />
        <History />
        <Contact />
      </main>
    </div>
  );
}

export default App;
