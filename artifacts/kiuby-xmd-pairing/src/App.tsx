import heroImage from '@assets/kiuby_menu.png';
import backgroundTrack from '@assets/Lonely_-_ELMAC(256k)_1789166383212.mp3';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  HeartPulse,
  LockKeyhole,
  Menu,
  MessageSquare,
  Minus,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
} from 'lucide-react';

const queryClient = new QueryClient();

type PairState = 'idle' | 'loading' | 'success' | 'error';

const commands = [
  { command: 'menu', description: 'Open the complete Kiuby XMD command directory', category: 'Core' },
  { command: 'alive', description: 'Check response time and current bot presence', category: 'Core' },
  { command: 'sticker', description: 'Turn an image or short video into a sticker', category: 'Media' },
  { command: 'play', description: 'Find and send an audio track by title', category: 'Media' },
  { command: 'ytmp4', description: 'Fetch a video for offline sharing', category: 'Media' },
  { command: 'ai', description: 'Ask Kiuby XMD for a focused answer', category: 'Tools' },
  { command: 'translate', description: 'Translate text into your chosen language', category: 'Tools' },
  { command: 'groupinfo', description: 'Read the current group details', category: 'Groups' },
  { command: 'tagall', description: 'Mention everyone with one clean command', category: 'Groups' },
  { command: 'setprefix', description: 'Choose the command prefix for your chat', category: 'Admin' },
  { command: 'antilink', description: 'Keep unwanted links out of your group', category: 'Admin' },
  { command: 'weather', description: 'Get a quick local forecast', category: 'Info' },
];

const navItems = [
  { label: 'Pair your phone', href: '#pair' },
  { label: 'Command deck', href: '#commands' },
  { label: 'System status', href: '#status' },
];

const matrixStreams = [
  'KXMD 0101 LOGIN ACCESS GRANTED 7F2A',
  '01011001 K I U B Y 101101 XMD',
  'AUTH CONSOLE 7A 09 32 1101',
  'PAIR ROUTE ONLINE 11001010',
  'KXMD // COMMAND // READY',
  '01101001 01011000 01001101',
  'LOGIN SESSION TERMINAL 77B',
  'GREEN SIGNAL 0011 KXMD',
  '0101 ACCESS PORT 443 XMD',
  'KIUBY CORE 110011 001101',
  'COMMAND LINK 8F2A 1001',
  '10101 XMD 10101 KXMD',
  'PHONE PAIRING NODE ACTIVE',
  '0001 0110 1011 0010 1110',
  'KIUBY XMD TERMINAL 24/7',
  'SYSTEM CHECK PASS 100%',
];

function copyText(text: string) {
  if (navigator.clipboard) void navigator.clipboard.writeText(text);
}

function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.72;
    const startAudio = () => {
      void audio.play().catch(() => {
        // Browsers may require a user gesture before allowing audible autoplay.
      });
    };
    const interactionEvents = ['pointerdown', 'keydown', 'touchstart', 'click'] as const;

    startAudio();
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, startAudio, { once: true });
    });

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, startAudio);
      });
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      className="background-audio"
      src={backgroundTrack}
      autoPlay
      loop
      preload="auto"
      aria-hidden="true"
    />
  );
}

function LoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!username.trim() || !password.trim()) {
      setError('Enter a username and password to open the KIUBY XMD console.');
      return;
    }
    setError('');
    onUnlock();
  };

  return (
    <main className="login-gate" aria-label="KIUBY XMD login gate">
      <div className="matrix-field" aria-hidden="true">
        {matrixStreams.map((stream, index) => (
          <div key={`${stream}-${index}`} className="matrix-column" style={{ animationDelay: `${-index * 0.42}s` }}>
            {`${stream}\n${stream}\n${stream}\n${stream}\n${stream}\n${stream}\n`}
          </div>
        ))}
      </div>
      <div className="login-content">
        <section className="login-panel rise-in" aria-labelledby="login-title">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <div className="login-kicker mb-3">KIUBY XMD / ACCESS NODE</div>
              <h1 id="login-title" className="login-logo">KIUBY XMD</h1>
              <p className="mt-3 max-w-xs font-mono-custom text-[11px] leading-5 text-[#67a871]">Command access for the fast, focused WhatsApp companion.</p>
            </div>
            <div className="access-chip flex items-center gap-2"><LockKeyhole size={13} /> Login</div>
          </div>
          <div className="mb-6 border-y border-[#164a20] py-3 login-console-line">
            <div><span>root@kiuby-xmd</span>:~$ initialize_console</div>
            <div>status: <span>waiting for credentials_</span></div>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="space-y-4">
            <div>
              <label htmlFor="login-username" className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#76d782]">Username</label>
              <input id="login-username" data-testid="input-login-username" value={username} onChange={(event) => { setUsername(event.target.value); setError(''); }} placeholder="enter username" className="login-input" autoComplete="username" />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#76d782]">Password</label>
              <input id="login-password" data-testid="input-login-password" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} placeholder="enter password" type="password" className="login-input" autoComplete="current-password" />
            </div>
            {error && <div data-testid="status-login-error" className="login-error" role="alert">{error}</div>}
            <button type="submit" data-testid="button-login" className="login-submit mt-2">Login to KIUBY XMD</button>
          </form>
          <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#164a20] pt-4 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#3d7347]">
            <span>Public presentation build</span>
            <span>Front-end access gate</span>
          </div>
        </section>
      </div>
    </main>
  );
}

function Nav({ open, onToggle, onClose }: { open: boolean; onToggle: () => void; onClose: () => void }) {
  const [, setLocation] = useLocation();
  const jump = (href: string) => {
    onClose();
    setLocation('/');
    window.setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 20);
  };
  return (
    <header className="header-glass fixed top-0 z-30 w-full">
      <div className="container-wide flex h-[74px] items-center justify-between">
        <button data-testid="button-brand-home" onClick={() => jump('#top')} className="flex items-center gap-3 text-left">
          <span className="grid h-9 w-9 place-items-center border border-[#ff3f38] bg-[#ef2b2b] text-white shadow-[0_0_18px_rgba(239,43,43,.32)]"><Terminal size={18} strokeWidth={2.5} /></span>
          <span>
            <span className="block text-[13px] font-bold tracking-[.2em] text-[#f6f6f8]">KIUBY XMD</span>
            <span className="font-mono-custom block text-[9px] tracking-[.15em] text-[#767681]">PAIRING CONSOLE</span>
          </span>
        </button>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => <button key={item.href} data-testid={`link-nav-${item.href.slice(1)}`} onClick={() => jump(item.href)} className="nav-link text-[13px]">{item.label}</button>)}
          <button data-testid="button-nav-start" onClick={() => jump('#pair')} className="primary-button flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-[.1em]">Start pairing <ArrowRight size={14} /></button>
        </nav>
        <button data-testid="button-mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} className="grid h-10 w-10 place-items-center border border-[#36363e] text-[#f1f1f4] md:hidden" onClick={onToggle}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#25252c] bg-[#0f0f14] px-5 py-5 md:hidden">
          <div className="container-wide flex flex-col gap-1">
            {navItems.map((item) => <button key={item.href} data-testid={`link-mobile-${item.href.slice(1)}`} onClick={() => jump(item.href)} className="border-b border-[#25252c] py-4 text-left text-sm text-[#a1a1ad]">{item.label}</button>)}
            <button data-testid="button-mobile-start" onClick={() => jump('#pair')} className="primary-button mt-4 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[.12em]">Start pairing <ArrowRight size={14} /></button>
          </div>
        </div>
      )}
    </header>
  );
}

function PairingConsole() {
  const [phone, setPhone] = useState('');
  const [pairState, setPairState] = useState<PairState>('idle');
  const [pairCode, setPairCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const startPairing = () => {
    const clean = phone.replace(/[^\d]/g, '');
    if (clean.length < 8 || clean.length > 15) {
      setPairState('error');
      setError('Enter a complete number with country code, 8–15 digits.');
      return;
    }
    setError('');
    setPairState('loading');
    window.setTimeout(() => {
      setPairCode(`${clean.slice(-4).padStart(4, '0')}-${(clean.length * 137).toString().slice(-4)}`);
      setPairState('success');
    }, 900);
  };
  const reset = () => { setPhone(''); setPairCode(''); setPairState('idle'); setError(''); setCopied(false); };
  const copyCode = () => { copyText(pairCode); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };

  return (
    <div className="console-card p-5 sm:p-7">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div><div className="eyebrow mb-3">Secure pairing / 01</div><h3 className="font-display text-2xl font-bold tracking-[-.04em] text-[#f4f4f6]">Connect a phone</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#8f8f9c]">Generate a WhatsApp pairing code in under a minute. No password, no detours.</p></div>
        <div className="hidden border border-[#34343d] px-3 py-2 text-right sm:block"><div className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-[#777782]">Channel</div><div className="mt-1 flex items-center gap-2 text-xs text-[#b9b9c4]"><span className="status-live text-[11px]">Live</span></div></div>
      </div>
      <div className="mb-9 flex items-center gap-2">
        {[1, 2, 3].map((step, index) => <div key={step} className="contents"><span className={`step-dot ${pairState === 'success' || (pairState === 'loading' && index === 1) ? 'complete' : index === 0 || pairState !== 'idle' && index === 1 ? 'active' : ''}`}>{pairState === 'success' && index < 2 ? <Check size={14} /> : step}</span>{index < 2 && <span className={`step-line ${pairState === 'success' || pairState === 'loading' && index === 0 ? 'complete' : ''}`} />}</div>)}
      </div>
      {pairState === 'success' ? (
        <div className="rise-in">
          <div className="mb-5 flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-[#55df98]" size={22} /><div><h4 className="font-semibold text-[#f4f4f6]">Pairing request ready</h4><p className="mt-1 text-sm leading-6 text-[#8f8f9c]">Open WhatsApp on your phone, then enter this code under Linked devices.</p></div></div>
          <div className="mb-4 flex items-center justify-between border border-[#ef2b2b]/60 bg-[#ef2b2b]/[.07] px-4 py-4"><span data-testid="text-pairing-code" className="font-mono-custom text-2xl tracking-[.12em] text-[#ff6258]">{pairCode}</span><button data-testid="button-copy-pairing-code" onClick={copyCode} className="flex items-center gap-2 text-xs font-medium text-[#f4f4f6] hover:text-[#ff6258]">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy code'}</button></div>
          <div className="flex flex-col gap-3 sm:flex-row"><button data-testid="button-open-whatsapp" onClick={() => window.open('https://wa.me', '_blank')} className="primary-button flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[.1em]">Open WhatsApp <ExternalLink size={14} /></button><button data-testid="button-reset-pairing" onClick={reset} className="ghost-button flex items-center justify-center gap-2 px-4 py-3 text-xs"><RotateCcw size={14} /> Pair another</button></div>
        </div>
      ) : (
        <>
          <label htmlFor="phone-number" className="mb-2 block text-xs font-medium text-[#b9b9c4]">Phone number with country code</label>
          <div className="flex gap-2"><div className="relative flex-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666671]" size={16} /><input id="phone-number" data-testid="input-phone-number" value={phone} onChange={(event) => { setPhone(event.target.value); if (pairState === 'error') setPairState('idle'); }} onKeyDown={(event) => event.key === 'Enter' && startPairing()} placeholder="+234 801 234 5678" className="number-input h-12 w-full pl-10 pr-3 text-sm" inputMode="tel" /></div><button data-testid="button-generate-code" onClick={startPairing} disabled={pairState === 'loading'} className="primary-button flex h-12 items-center gap-2 px-4 text-xs font-bold uppercase tracking-[.08em] disabled:cursor-wait disabled:opacity-60">{pairState === 'loading' ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Working</> : <>Generate <ArrowRight size={14} /></>}</button></div>
          {pairState === 'error' && <div data-testid="status-pairing-error" className="mt-3 flex items-center gap-2 text-xs text-[#ff758f]" role="alert"><X size={14} /> {error}</div>}
          <div className="mt-6 flex items-center gap-2 text-[11px] leading-5 text-[#6f6f7b]"><ShieldCheck size={14} className="shrink-0 text-[#55df98]" /> Your number is used only to create this pairing request.</div>
        </>
      )}
    </div>
  );
}

function CommandDeck() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Core', 'Media', 'Tools', 'Groups', 'Admin', 'Info'];
  const filtered = useMemo(() => commands.filter((item) => (category === 'All' || item.category === category) && `${item.command} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return (
    <section id="commands" className="border-t border-[#24242b] py-24 sm:py-32">
      <div className="container-wide">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><div className="section-label eyebrow mb-5">Command deck / 02</div><h2 className="display max-w-xl text-5xl text-[#f4f4f6] sm:text-6xl">Small commands.<br /><span className="text-[#ff483f]">Big range.</span></h2></div><p className="max-w-sm text-sm leading-7 text-[#8f8f9c]">Everything you need to run a sharper chat, from one-word media tools to group controls that stay out of the way.</p></div>
        <div className="mb-6 flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666671]" size={17} /><input data-testid="input-command-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search commands or what they do..." className="number-input h-12 w-full pl-11 pr-4 text-sm" /></div><div className="flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} data-testid={`button-filter-${item.toLowerCase()}`} onClick={() => setCategory(item)} className={`shrink-0 border px-4 py-2 text-xs transition-colors ${category === item ? 'border-[#ef2b2b] bg-[#ef2b2b] text-white' : 'border-[#35353e] text-[#8f8f9c] hover:border-[#ef2b2b]/60 hover:text-[#f4f4f6]'}`}>{item}</button>)}</div></div>
        <div className="overflow-hidden border border-[#292930]"><div className="hidden grid-cols-[1.05fr_2fr_100px] gap-5 border-b border-[#292930] bg-[#15151b] px-5 py-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#666671] sm:grid"><span>Command</span><span>What it does</span><span>Area</span></div>{filtered.map((item) => <div key={item.command} data-testid={`row-command-${item.command}`} className="command-row grid gap-2 border-b border-[#292930] px-5 py-4 last:border-0 sm:grid-cols-[1.05fr_2fr_100px] sm:items-center sm:gap-5"><span className="font-mono-custom text-sm text-[#ff6258]">.{item.command}</span><span className="text-sm leading-6 text-[#b9b9c4]">{item.description}</span><span className="tag w-fit px-2 py-1 font-mono-custom text-[9px] uppercase tracking-[.1em]">{item.category}</span></div>)}{filtered.length === 0 && <div data-testid="empty-command-results" className="px-5 py-16 text-center"><Minus className="mx-auto mb-3 text-[#666671]" size={20} /><p className="text-sm text-[#8f8f9c]">No commands match that search.</p><button data-testid="button-clear-command-search" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-4 text-xs text-[#ff6258] underline underline-offset-4">Clear filters</button></div>}</div>
        <div className="mt-6 flex items-center gap-2 text-xs text-[#666671]"><Sparkles size={14} className="text-[#ff483f]" /> Type <span className="font-mono-custom text-[#b9b9c4]">.menu</span> in WhatsApp anytime for the live list.</div>
      </div>
    </section>
  );
}

function StatusSection() {
  const checks = [{ label: 'WhatsApp bridge', value: 'Operational', icon: MessageSquare }, { label: 'Pairing service', value: 'Ready', icon: Zap }, { label: 'Command router', value: 'Operational', icon: Terminal }, { label: 'Response edge', value: 'Fast · 184 ms', icon: HeartPulse }];
  return (
    <section id="status" className="border-t border-[#24242b] py-24 sm:py-32">
      <div className="container-wide"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start"><div><div className="section-label eyebrow mb-5">Signal report / 03</div><h2 className="display max-w-lg text-5xl text-[#f4f4f6] sm:text-6xl">Built to stay<br /><span className="text-[#ff483f]">available.</span></h2><p className="mt-7 max-w-md text-sm leading-7 text-[#8f8f9c]">Kiuby XMD is designed for the moment you actually need it: a quick command, a clean answer, and zero ceremony between.</p><div className="mt-10 flex items-center gap-3 border-l border-[#ef2b2b] pl-4"><div className="h-2 w-2 rounded-full bg-[#55df98] pulse-soft" /><span className="font-mono-custom text-xs text-[#b9b9c4]">Last checked just now</span></div></div><div className="console-card divide-y divide-[#292930]"><div className="flex items-center justify-between px-5 py-5 sm:px-7"><div><div className="eyebrow mb-2">Current posture</div><h3 data-testid="status-overall" className="font-display text-2xl font-bold text-[#f4f4f6]">All systems go</h3></div><div className="grid h-12 w-12 place-items-center border border-[#55df98]/40 bg-[#55df98]/10 text-[#55df98]"><CheckCircle2 size={22} /></div></div>{checks.map((item) => { const Icon = item.icon; return <div key={item.label} data-testid={`status-row-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><Icon size={16} className="text-[#666671]" /><span className="text-sm text-[#b9b9c4]">{item.label}</span></div><span className="status-live font-mono-custom text-[11px]">{item.value}</span></div>; })}<div className="flex items-center gap-2 px-5 py-5 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#666671] sm:px-7"><ShieldCheck size={15} className="text-[#55df98]" /> Public readiness: clear to pair</div></div></div></div>
    </section>
  );
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <main id="top" className="kiuby-shell">
      <Nav open={mobileOpen} onToggle={() => setMobileOpen((value) => !value)} onClose={() => setMobileOpen(false)} />
      <section className="red-grid relative overflow-hidden pt-[130px] pb-20 sm:pt-[160px] sm:pb-28"><div className="hero-orb" /><div className="container-wide relative"><div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-20"><div><div className="rise-in eyebrow mb-7 flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#55df98] pulse-soft" /> Public pairing console / v1.0</div><h1 className="rise-in delay-1 display max-w-3xl text-[clamp(3.4rem,8vw,7.6rem)] text-[#f4f4f6]">Your phone.<br /><span className="text-[#ff483f]">His commands.</span></h1><p className="rise-in delay-2 mt-8 max-w-lg text-base leading-8 text-[#a1a1ad] sm:text-lg">Connect to <strong className="font-semibold text-[#f4f4f6]">KIUBY XMD</strong> and put a fast, focused WhatsApp command companion in your pocket.</p><div className="rise-in delay-3 mt-10 flex flex-col gap-3 sm:flex-row"><a data-testid="link-hero-pair" href="#pair" className="primary-button flex items-center justify-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-[.12em]">Pair a phone <ArrowRight size={15} /></a><a data-testid="link-hero-commands" href="#commands" className="ghost-button flex items-center justify-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-[.12em]">Explore commands <ChevronDown size={15} /></a></div><div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-[#292930] pt-5"><div><div className="font-mono-custom text-xl text-[#f4f4f6]">12+</div><div className="mt-1 text-[11px] text-[#666671]">Useful commands</div></div><div><div className="font-mono-custom text-xl text-[#f4f4f6]">184ms</div><div className="mt-1 text-[11px] text-[#666671]">Typical response</div></div><div><div className="font-mono-custom text-xl text-[#f4f4f6]">24/7</div><div className="mt-1 text-[11px] text-[#666671]">Ready to respond</div></div></div></div><div className="mx-auto w-full max-w-[440px] lg:ml-auto"><div className="portrait-frame aspect-[4/5] overflow-hidden bg-[#15151b]"><img src={heroImage} alt="KIUBY XMD portrait menu" /><div className="scanline" /><div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-white/20 bg-[#0c0c10]/80 px-3 py-2 backdrop-blur-sm"><span className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#f4f4f6]">The console is online</span><span className="status-live font-mono-custom text-[10px]">Live</span></div></div><div className="mt-8 flex items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#666671]"><span>Fast. Smart. Unstoppable.</span><span>01 / XMD</span></div></div></div></div></section>
      <section className="border-y border-[#24242b] bg-[#111116] py-5"><div className="container-wide flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3 text-xs text-[#8f8f9c]"><ShieldCheck size={15} className="text-[#ff483f]" /> No password stored. No noise added.</div><div className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#666671]">A companion by KIUBY XMD</div></div></section>
      <section id="pair" className="py-24 sm:py-32"><div className="container-wide"><div className="mb-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><div className="section-label eyebrow mb-5">Get connected / 01</div><h2 className="display max-w-md text-5xl text-[#f4f4f6] sm:text-6xl">One number<br />away.</h2></div><p className="max-w-md text-sm leading-7 text-[#8f8f9c]">Start with your WhatsApp number. We will take care of the handoff and return a one-time code for your device.</p></div><PairingConsole /></div></section>
      <CommandDeck /><StatusSection />
      <section className="relative overflow-hidden border-t border-[#24242b] bg-[#ef2b2b] py-20 text-white sm:py-28"><div className="container-wide relative z-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"><div><div className="font-mono-custom text-[11px] font-medium uppercase tracking-[.16em] text-[#ffd1cf]">Ready when you are</div><h2 className="display mt-4 max-w-2xl text-5xl sm:text-7xl">Make the chat<br />work harder.</h2></div><a data-testid="link-final-pair" href="#pair" className="flex items-center gap-3 border border-white px-5 py-4 text-xs font-bold uppercase tracking-[.1em] transition-transform hover:-translate-y-1">Start pairing <ArrowRight size={15} /></a></div><div className="pointer-events-none absolute -right-6 -top-16 font-mono-custom text-[190px] font-bold leading-none text-black/[.12] sm:text-[280px]">X</div></section>
      <footer className="border-t border-[#24242b] bg-[#0c0c10] py-9"><div className="container-wide flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="footer-mark">KIUBY XMD</div><div className="mt-2 text-xs text-[#666671]">The public pairing and command companion.</div></div><div className="flex items-center gap-5 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#666671]"><span>System ready</span><span className="h-1 w-1 rounded-full bg-[#55df98]" /><span>© 2024 XMD</span></div></div></footer>
    </main>
  );
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [unlocked, setUnlocked] = useState(false);
  return <QueryClientProvider client={queryClient}><TooltipProvider><BackgroundAudio />{unlocked ? <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter> : <LoginGate onUnlock={() => setUnlocked(true)} />}<Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;