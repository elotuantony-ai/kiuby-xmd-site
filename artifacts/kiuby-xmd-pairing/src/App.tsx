import heroImage from '@assets/kiuby_menu.png';
import { useMemo, useState } from 'react';
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

function copyText(text: string) {
  if (navigator.clipboard) navigator.clipboard.writeText(text);
}

function Nav({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          <span className="grid h-9 w-9 place-items-center border border-[#ffe500] bg-[#ffe500] text-[#161827]">
            <Terminal size={18} strokeWidth={2.5} />
          </span>
          <span>
            <span className="block text-[13px] font-bold tracking-[.2em] text-[#fff9db]">KIUBY XMD</span>
            <span className="font-mono-custom block text-[9px] tracking-[.15em] text-[#8990a6]">PAIRING CONSOLE</span>
          </span>
        </button>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.href} data-testid={`link-nav-${item.href.slice(1)}`} onClick={() => jump(item.href)} className="nav-link text-[13px]">
              {item.label}
            </button>
          ))}
          <button data-testid="button-nav-start" onClick={() => jump('#pair')} className="primary-button flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-[.1em]">
            Start pairing <ArrowRight size={14} />
          </button>
        </nav>
        <button data-testid="button-mobile-menu" className="grid h-10 w-10 place-items-center border border-[#32364a] text-[#fff9db] md:hidden" onClick={onClose}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#292d40] bg-[#121522] px-5 py-5 md:hidden">
          <div className="container-wide flex flex-col gap-1">
            {navItems.map((item) => (
              <button key={item.href} data-testid={`link-mobile-${item.href.slice(1)}`} onClick={() => jump(item.href)} className="border-b border-[#292d40] py-4 text-left text-sm text-[#b2b7c8]">
                {item.label}
              </button>
            ))}
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
        <div>
          <div className="eyebrow mb-3">Secure pairing / 01</div>
          <h3 className="text-2xl font-semibold tracking-[-.04em] text-[#fff9db]">Connect a phone</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#8990a6]">Generate a WhatsApp pairing code in under a minute. No password, no detours.</p>
        </div>
        <div className="hidden border border-[#2f354a] px-3 py-2 text-right sm:block">
          <div className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-[#8990a6]">Channel</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[#b6bdcf]"><span className="status-live text-[11px]">Live</span></div>
        </div>
      </div>
      <div className="mb-9 flex items-center gap-2">
        {[1, 2, 3].map((step, index) => (
          <div key={step} className="contents">
            <span className={`step-dot ${pairState === 'success' || (pairState === 'loading' && index === 1) ? 'complete' : index === 0 || pairState !== 'idle' && index === 1 ? 'active' : ''}`}>{pairState === 'success' && index < 2 ? <Check size={14} /> : step}</span>
            {index < 2 && <span className={`step-line ${pairState === 'success' || pairState === 'loading' && index === 0 ? 'complete' : ''}`} />}
          </div>
        ))}
      </div>
      {pairState === 'success' ? (
        <div className="rise-in">
          <div className="mb-5 flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-[#71df9a]" size={22} />
            <div><h4 className="font-semibold text-[#fff9db]">Pairing request ready</h4><p className="mt-1 text-sm leading-6 text-[#8990a6]">Open WhatsApp on your phone, then enter this code under Linked devices.</p></div>
          </div>
          <div className="mb-4 flex items-center justify-between border border-[#ffe500]/50 bg-[#ffe500]/[.06] px-4 py-4">
            <span data-testid="text-pairing-code" className="font-mono-custom text-2xl tracking-[.12em] text-[#ffe500]">{pairCode}</span>
            <button data-testid="button-copy-pairing-code" onClick={copyCode} className="flex items-center gap-2 text-xs font-medium text-[#fff9db] hover:text-[#ffe500]">{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy code'}</button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button data-testid="button-open-whatsapp" onClick={() => window.open('https://wa.me', '_blank')} className="primary-button flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[.1em]">Open WhatsApp <ExternalLink size={14} /></button>
            <button data-testid="button-reset-pairing" onClick={reset} className="ghost-button flex items-center justify-center gap-2 px-4 py-3 text-xs"><RotateCcw size={14} /> Pair another</button>
          </div>
        </div>
      ) : (
        <>
          <label htmlFor="phone-number" className="mb-2 block text-xs font-medium text-[#b6bdcf]">Phone number with country code</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#626a82]" size={16} />
              <input id="phone-number" data-testid="input-phone-number" value={phone} onChange={(event) => { setPhone(event.target.value); if (pairState === 'error') setPairState('idle'); }} onKeyDown={(event) => event.key === 'Enter' && startPairing()} placeholder="+234 801 234 5678" className="number-input h-12 w-full pl-10 pr-3 text-sm" inputMode="tel" />
            </div>
            <button data-testid="button-generate-code" onClick={startPairing} disabled={pairState === 'loading'} className="primary-button flex h-12 items-center gap-2 px-4 text-xs font-bold uppercase tracking-[.08em] disabled:cursor-wait disabled:opacity-60">
              {pairState === 'loading' ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#161827] border-t-transparent" /> Working</> : <>Generate <ArrowRight size={14} /></>}
            </button>
          </div>
          {pairState === 'error' && <div data-testid="status-pairing-error" className="mt-3 flex items-center gap-2 text-xs text-[#ff758f]"><X size={14} /> {error}</div>}
          <div className="mt-6 flex items-center gap-2 text-[11px] leading-5 text-[#687188]"><ShieldCheck size={14} className="shrink-0 text-[#71df9a]" /> Your number is used only to create this pairing request.</div>
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
    <section id="commands" className="border-t border-[#24283a] py-24 sm:py-32">
      <div className="container-wide">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div><div className="section-label eyebrow mb-5">Command deck / 02</div><h2 className="display max-w-xl text-5xl text-[#fff9db] sm:text-6xl">Small commands.<br /><span className="text-[#ffe500]">Big range.</span></h2></div>
          <p className="max-w-sm text-sm leading-7 text-[#8990a6]">Everything you need to run a sharper chat, from one-word media tools to group controls that stay out of the way.</p>
        </div>
        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687188]" size={17} /><input data-testid="input-command-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search commands or what they do..." className="number-input h-12 w-full pl-11 pr-4 text-sm" /></div>
          <div className="flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} data-testid={`button-filter-${item.toLowerCase()}`} onClick={() => setCategory(item)} className={`shrink-0 border px-4 py-2 text-xs transition-colors ${category === item ? 'border-[#ffe500] bg-[#ffe500] text-[#161827]' : 'border-[#30354a] text-[#8990a6] hover:border-[#ffe500]/60 hover:text-[#fff9db]'}`}>{item}</button>)}</div>
        </div>
        <div className="overflow-hidden border border-[#292d40]">
          <div className="hidden grid-cols-[1.05fr_2fr_100px] gap-5 border-b border-[#292d40] bg-[#151827] px-5 py-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687188] sm:grid"><span>Command</span><span>What it does</span><span>Area</span></div>
          {filtered.map((item) => <div key={item.command} data-testid={`row-command-${item.command}`} className="command-row grid gap-2 border-b border-[#292d40] px-5 py-4 last:border-0 sm:grid-cols-[1.05fr_2fr_100px] sm:items-center sm:gap-5"><span className="font-mono-custom text-sm text-[#ffe500]">.{item.command}</span><span className="text-sm leading-6 text-[#b6bdcf]">{item.description}</span><span className="tag w-fit px-2 py-1 font-mono-custom text-[9px] uppercase tracking-[.1em]">{item.category}</span></div>)}
          {filtered.length === 0 && <div data-testid="empty-command-results" className="px-5 py-16 text-center"><Minus className="mx-auto mb-3 text-[#687188]" size={20} /><p className="text-sm text-[#8990a6]">No commands match that search.</p><button data-testid="button-clear-command-search" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-4 text-xs text-[#ffe500] underline underline-offset-4">Clear filters</button></div>}
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs text-[#687188]"><Sparkles size={14} className="text-[#ffe500]" /> Type <span className="font-mono-custom text-[#b6bdcf]">.menu</span> in WhatsApp anytime for the live list.</div>
      </div>
    </section>
  );
}

function StatusSection() {
  const checks = [{ label: 'WhatsApp bridge', value: 'Operational', icon: MessageSquare }, { label: 'Pairing service', value: 'Ready', icon: Zap }, { label: 'Command router', value: 'Operational', icon: Terminal }, { label: 'Response edge', value: 'Fast · 184 ms', icon: HeartPulse }];
  return (
    <section id="status" className="border-t border-[#24283a] py-24 sm:py-32">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div><div className="section-label eyebrow mb-5">Signal report / 03</div><h2 className="display max-w-lg text-5xl text-[#fff9db] sm:text-6xl">Built to stay<br /><span className="text-[#ff477e]">available.</span></h2><p className="mt-7 max-w-md text-sm leading-7 text-[#8990a6]">Kiuby XMD is designed for the moment you actually need it: a quick command, a clean answer, and zero ceremony between.</p><div className="mt-10 flex items-center gap-3 border-l border-[#ffe500] pl-4"><div className="h-2 w-2 rounded-full bg-[#71df9a] pulse-soft" /><span className="font-mono-custom text-xs text-[#b6bdcf]">Last checked just now</span></div></div>
          <div className="console-card divide-y divide-[#292d40]">
            <div className="flex items-center justify-between px-5 py-5 sm:px-7"><div><div className="eyebrow mb-2">Current posture</div><h3 data-testid="status-overall" className="text-2xl font-semibold text-[#fff9db]">All systems go</h3></div><div className="grid h-12 w-12 place-items-center border border-[#71df9a]/40 bg-[#71df9a]/10 text-[#71df9a]"><CheckCircle2 size={22} /></div></div>
            {checks.map((item) => { const Icon = item.icon; return <div key={item.label} data-testid={`status-row-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><Icon size={16} className="text-[#687188]" /><span className="text-sm text-[#b6bdcf]">{item.label}</span></div><span className="status-live font-mono-custom text-[11px]">{item.value}</span></div>; })}
            <div className="flex items-center gap-2 px-5 py-5 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687188] sm:px-7"><ShieldCheck size={15} className="text-[#71df9a]" /> Public readiness: clear to pair</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <main id="top" className="kiuby-shell">
      <Nav open={mobileOpen} onClose={() => setMobileOpen((value) => !value)} />
      <section className="hero-grid relative overflow-hidden pt-[130px] pb-20 sm:pt-[160px] sm:pb-28">
        <div className="hero-orb" />
        <div className="container-wide relative">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <div>
              <div className="rise-in eyebrow mb-7 flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#71df9a] pulse-soft" /> Public pairing console / v1.0</div>
              <h1 className="rise-in delay-1 display max-w-3xl text-[clamp(3.4rem,8vw,7.6rem)] text-[#fff9db]">Your phone.<br /><span className="text-[#ffe500]">His commands.</span></h1>
              <p className="rise-in delay-2 mt-8 max-w-lg text-base leading-8 text-[#a6adbf] sm:text-lg">Connect to <strong className="font-semibold text-[#fff9db]">KIUBY XMD</strong> and put a fast, focused WhatsApp command companion in your pocket.</p>
              <div className="rise-in delay-3 mt-10 flex flex-col gap-3 sm:flex-row"><a data-testid="link-hero-pair" href="#pair" className="primary-button flex items-center justify-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-[.12em]">Pair a phone <ArrowRight size={15} /></a><a data-testid="link-hero-commands" href="#commands" className="ghost-button flex items-center justify-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-[.12em]">Explore commands <ChevronDown size={15} /></a></div>
              <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-[#292d40] pt-5"><div><div className="font-mono-custom text-xl text-[#fff9db]">12+</div><div className="mt-1 text-[11px] text-[#687188]">Useful commands</div></div><div><div className="font-mono-custom text-xl text-[#fff9db]">184ms</div><div className="mt-1 text-[11px] text-[#687188]">Typical response</div></div><div><div className="font-mono-custom text-xl text-[#fff9db]">24/7</div><div className="mt-1 text-[11px] text-[#687188]">Ready to respond</div></div></div>
            </div>
            <div className="mx-auto w-full max-w-[440px] lg:ml-auto">
              <div className="relative aspect-[4/5] portrait-frame overflow-hidden bg-[#161827]"><img src={heroImage} alt="KIUBY XMD creator wearing red glasses" /><div className="scanline" /><div className="absolute bottom-4 left-4 right-4 flex items-center justify-between border border-white/20 bg-[#161827]/80 px-3 py-2 backdrop-blur-sm"><span className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#fff9db]">The boss is online</span><span className="status-live font-mono-custom text-[10px]">Live</span></div></div>
              <div className="mt-8 flex items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687188]"><span>Fast. Smart. Unstoppable.</span><span>01 / XMD</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-[#24283a] bg-[#131622] py-5"><div className="container-wide flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3 text-xs text-[#8990a6]"><ShieldCheck size={15} className="text-[#ffe500]" /> No password stored. No noise added.</div><div className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#687188]">A companion by KIUBY XMD</div></div></section>
      <section id="pair" className="py-24 sm:py-32"><div className="container-wide"><div className="mb-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><div className="section-label eyebrow mb-5">Get connected / 01</div><h2 className="display max-w-md text-5xl text-[#fff9db] sm:text-6xl">One number<br />away.</h2></div><p className="max-w-md text-sm leading-7 text-[#8990a6]">Start with your WhatsApp number. We will take care of the handoff and return a one-time code for your device.</p></div><PairingConsole /></div></section>
      <CommandDeck />
      <StatusSection />
      <section className="relative overflow-hidden border-t border-[#24283a] bg-[#ffe500] py-20 text-[#161827] sm:py-28"><div className="container-wide relative z-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"><div><div className="font-mono-custom text-[11px] font-medium uppercase tracking-[.16em] text-[#5b5500]">Ready when you are</div><h2 className="display mt-4 max-w-2xl text-5xl sm:text-7xl">Make the chat<br />work harder.</h2></div><a data-testid="link-final-pair" href="#pair" className="flex items-center gap-3 border border-[#161827] px-5 py-4 text-xs font-bold uppercase tracking-[.1em] transition-transform hover:-translate-y-1">Start pairing <ArrowRight size={15} /></a></div><div className="pointer-events-none absolute -right-6 -top-16 font-mono-custom text-[190px] font-bold leading-none text-[#161827]/[.06] sm:text-[280px]">X</div></section>
      <footer className="border-t border-[#24283a] bg-[#10121d] py-9"><div className="container-wide flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="footer-mark">KIUBY XMD</div><div className="mt-2 text-xs text-[#687188]">The public pairing and command companion.</div></div><div className="flex items-center gap-5 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687188]"><span>System ready</span><span className="h-1 w-1 rounded-full bg-[#71df9a]" /><span>© 2024 XMD</span></div></div></footer>
    </main>
  );
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;