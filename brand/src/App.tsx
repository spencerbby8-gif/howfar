import { useEffect, useMemo, useState } from "react";
import { AppIcon, Mark, MarkMono, Wordmark } from "./components/Logo";

const COLORS = [
  {
    name: "flare",
    hex: "#FF4A1C",
    role: "primary",
    note: "The beacon. Heat, greeting, now.",
  },
  {
    name: "volt",
    hex: "#C6FF3D",
    role: "signal",
    note: "The echo. Distance, afterimage, far.",
  },
  {
    name: "void",
    hex: "#0A0908",
    role: "ground",
    note: "Night. The space a ping travels through.",
  },
  {
    name: "bone",
    hex: "#F1EBE0",
    role: "light",
    note: "Paper, skin, daytime surfaces.",
  },
  {
    name: "dust",
    hex: "#8A8076",
    role: "mute",
    note: "Captions, meta, the in-between.",
  },
  {
    name: "ink",
    hex: "#141210",
    role: "raised",
    note: "Cards, sheets, a step off void.",
  },
] as const;

const PEXELS = {
  tokyo:
    "https://images.pexels.com/photos/29356751/pexels-photo-29356751.jpeg?auto=compress&cs=tinysrgb&w=1600",
  rain: "https://images.pexels.com/photos/19245476/pexels-photo-19245476.jpeg?auto=compress&cs=tinysrgb&w=1600",
  shibuya:
    "https://images.pexels.com/photos/2067057/pexels-photo-2067057.jpeg?auto=compress&cs=tinysrgb&w=1600",
  aerial:
    "https://images.pexels.com/photos/17112780/pexels-photo-17112780.jpeg?auto=compress&cs=tinysrgb&w=1600",
  friends:
    "https://images.pexels.com/photos/5054598/pexels-photo-5054598.jpeg?auto=compress&cs=tinysrgb&w=1600",
  portraitW:
    "https://images.pexels.com/photos/12809817/pexels-photo-12809817.jpeg?auto=compress&cs=tinysrgb&w=900",
  portraitM:
    "https://images.pexels.com/photos/14440801/pexels-photo-14440801.jpeg?auto=compress&cs=tinysrgb&w=900",
  neonWoman:
    "https://images.pexels.com/photos/9513834/pexels-photo-9513834.jpeg?auto=compress&cs=tinysrgb&w=1400",
  leather:
    "https://images.pexels.com/photos/19665186/pexels-photo-19665186.jpeg?auto=compress&cs=tinysrgb&w=1400",
  smile:
    "https://images.pexels.com/photos/30127945/pexels-photo-30127945.jpeg?auto=compress&cs=tinysrgb&w=1400",
  diverse:
    "https://images.pexels.com/photos/5384360/pexels-photo-5384360.jpeg?auto=compress&cs=tinysrgb&w=1400",
  times:
    "https://images.pexels.com/photos/31687021/pexels-photo-31687021.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

const LINKS = [
  { href: "#mark", label: "mark" },
  { href: "#color", label: "color" },
  { href: "#type", label: "type" },
  { href: "#voice", label: "voice" },
  { href: "#world", label: "world" },
];

function SectionKicker({ n, children }: { n: string; children: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-mono text-[11px] tracking-[0.22em] text-flare uppercase">
        {n}
      </span>
      <span className="h-px flex-1 bg-bone/15" />
      <span className="font-mono text-[11px] tracking-[0.22em] text-dust uppercase">
        {children}
      </span>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [sent, setSent] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), 2400);
    return () => clearTimeout(t);
  }, [sent]);

  const echoShift = useMemo(
    () => ({
      x: mouse.x * 18,
      y: mouse.y * 14,
    }),
    [mouse]
  );

  const copyHex = (hex: string, name: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(name);
  };

  return (
    <div
      className="relative min-h-screen bg-void text-bone"
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouse({ x, y });
      }}
    >
      <div className="grain" />

      {copied && (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-volt px-4 py-2 font-mono text-xs tracking-widest text-void uppercase">
          copied {copied}
        </div>
      )}

      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-void/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-2">
            <Mark className="h-8 w-8" />
            <span className="font-display text-lg font-extrabold tracking-tight">
              how far
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[11px] tracking-[0.22em] text-dust uppercase transition-colors hover:text-flare"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#product"
              className="rounded-full bg-flare px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-void uppercase transition-transform hover:scale-105"
            >
              open app
            </a>
          </div>
          <button
            className="md:hidden font-mono text-[11px] tracking-[0.2em] uppercase text-dust"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? "close" : "menu"}
          </button>
        </div>
        {menu && (
          <div className="border-t border-bone/10 bg-void px-5 py-4 md:hidden">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="block py-3 font-mono text-xs tracking-[0.22em] uppercase"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <header
        id="top"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pt-20"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,74,28,0.16) 0%, rgba(10,9,8,0) 68%)",
            }}
          />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-flare/20"
              style={{ animation: `pulse-ring 3.6s ease-out ${i * 1.2}s infinite` }}
            />
          ))}
        </div>

        <div className="relative animate-floaty">
          <div
            className="relative h-[min(58vw,340px)] w-[min(58vw,340px)]"
            style={{
              transform: `translate(${mouse.x * 8}px, ${mouse.y * 6}px)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${echoShift.x}px, ${echoShift.y}px)`,
              }}
            >
              <Mark
                echo={false}
                color="#C6FF3D"
                className="h-full w-full"
              />
            </div>
            <Mark echo={false} animated className="relative h-full w-full" />
          </div>
        </div>

        <div className="hero-copy relative z-10 mt-10 text-center">
          <h1 className="font-display text-[clamp(3.4rem,14vw,10.5rem)] font-extrabold leading-[0.85] tracking-tight">
            <span>how</span>
            <span className="inline-block w-[0.35em]" />
            <span>far</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md font-sans text-base text-dust md:text-lg">
            the greeting that outran distance.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-volt" />
            <span className="font-mono text-[10px] tracking-[0.28em] text-volt uppercase">
              est. wherever you are
            </span>
            <span className="h-px w-8 bg-volt" />
          </div>
        </div>

        <a
          href="#story"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.28em] text-dust uppercase"
        >
          scroll the system
        </a>
      </header>

      <div className="relative overflow-hidden border-y border-bone/10 bg-flare py-4">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12">
              {[
                "a greeting",
                "a distance",
                "a network",
                "how far",
                "wherever you are",
                "ping me",
                "the gap is the point",
                "near · far",
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-12 font-display text-2xl font-extrabold text-void lowercase md:text-4xl"
                >
                  {t}
                  <Mark echo={false} color="#0A0908" className="h-8 w-8" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="story" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionKicker n="01">origin</SectionKicker>
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.4rem,6vw,5.2rem)] font-extrabold leading-[0.95] tracking-tight">
              two meanings.
              <br />
              one network.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-dust">
              In streets from Lagos to London, <em className="text-bone not-italic">how far</em> is
              how you say hello. What’s up. I see you. Talk to me.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-dust">
              In English it is also the question of gap — how much road, how much time, how much
              between us. We built a platform out of that double meaning. A ping. A pulse. A way
              to collapse the space without pretending it isn’t there.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[28px]">
              <img
                src={PEXELS.aerial}
                alt="City lights stretching into the distance at night"
                className="h-80 w-full object-cover md:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
              <p className="absolute bottom-5 left-5 right-5 font-mono text-[11px] tracking-[0.18em] text-bone uppercase">
                the space a greeting has to cross
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="mark" className="border-t border-bone/10 bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionKicker n="02">the mark</SectionKicker>
          <h2 className="max-w-3xl font-display text-[clamp(2.2rem,5.5vw,4.6rem)] font-extrabold leading-[0.95] tracking-tight">
            a ring that stays. a dot that leaves.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-dust">
            The ring is you — here, whole, holding. The dot is them — already further on. The gap
            is the question the brand is named after. Nothing else belongs in this symbol.
          </p>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            <div className="flex aspect-square items-center justify-center rounded-[32px] bg-void">
              <Mark className="h-[58%] w-[58%]" animated />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center rounded-[28px] bg-bone">
                <Mark className="h-[62%] w-[62%]" />
              </div>
              <div className="flex items-center justify-center rounded-[28px] bg-flare">
                <Mark
                  echo={false}
                  color="#0A0908"
                  className="h-[62%] w-[62%]"
                />
              </div>
              <div className="flex items-center justify-center rounded-[28px] bg-volt">
                <Mark
                  echo={false}
                  color="#0A0908"
                  className="h-[62%] w-[62%]"
                />
              </div>
              <div className="relative flex items-center justify-center overflow-hidden rounded-[28px]">
                <img
                  src={PEXELS.tokyo}
                  alt="Neon street"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-void/40" />
                <Mark className="relative h-[62%] w-[62%]" />
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "the ring",
                d: "Here. A full presence with an opening — never closed, never a target, never a camera shutter.",
              },
              {
                t: "the dot",
                d: "Far. Always up and to the right, the direction of going. Smaller, because distance shrinks things.",
              },
              {
                t: "the gap",
                d: "The name, drawn. Do not close it. Do not fill it. The awkward space is the brand.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-[24px] border border-bone/10 p-6">
                <div className="mb-4 h-1.5 w-8 bg-flare" />
                <h3 className="font-display text-2xl font-bold">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dust">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <p className="mb-6 font-mono text-[11px] tracking-[0.22em] text-dust uppercase">
              lockup — the mark lives in the name
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-center rounded-[28px] bg-void px-6 py-14">
                <Wordmark className="text-[clamp(2.2rem,8vw,6.5rem)] text-bone" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-center rounded-[28px] bg-bone px-6 py-12">
                  <Wordmark className="text-[clamp(1.8rem,5vw,3.4rem)] text-void" />
                </div>
                <div className="flex items-center justify-center rounded-[28px] bg-flare px-6 py-12">
                  <span className="inline-flex items-center font-display text-[clamp(1.8rem,5vw,3.4rem)] font-extrabold leading-none text-void">
                    how
                    <Mark
                      echo={false}
                      color="#0A0908"
                      className="mx-[0.12em] h-[0.92em] w-[0.92em]"
                    />
                    far
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionKicker n="03">the echo</SectionKicker>
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
                every signal
                <br />
                leaves a ghost.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-dust">
                Like a screenprint knocked a few millimetres out of register. The volt echo always
                sits up and to the right — the direction of far. It is not a drop shadow. It is
                the greeting still travelling.
              </p>
              <ul className="mt-8 space-y-3 font-mono text-xs tracking-wide text-dust">
                <li className="flex gap-3">
                  <span className="text-volt">01</span> echo color is always volt
                </li>
                <li className="flex gap-3">
                  <span className="text-volt">02</span> offset is always up-right, never down
                </li>
                <li className="flex gap-3">
                  <span className="text-volt">03</span> flare sits on top, volt sits behind
                </li>
                <li className="flex gap-3">
                  <span className="text-volt">04</span> never blend the two into a gradient
                </li>
              </ul>
            </div>
            <div className="relative flex items-center justify-center rounded-[32px] bg-void p-10">
              <div className="relative h-64 w-64 md:h-80 md:w-80">
                <Mark echo={false} color="#C6FF3D" className="absolute inset-0 h-full w-full translate-x-6 -translate-y-5" />
                <Mark echo={false} className="relative h-full w-full" />
              </div>
              <span className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.2em] text-dust uppercase">
                misregistration · 8 / −7
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="color" className="border-t border-bone/10 bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionKicker n="04">color</SectionKicker>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
            heat against voltage.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-dust">
            No blue. No friendly teal. No purple gradient. Flare and volt clash on purpose — warm
            greeting, cold distance — the same way cyan and magenta made another network
            unforgettable, without copying a note of it.
          </p>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => copyHex(c.hex, c.name)}
                className="group overflow-hidden rounded-[24px] text-left transition-transform hover:-translate-y-1"
              >
                <div
                  className="h-40 w-full"
                  style={{ background: c.hex }}
                />
                <div className="border border-t-0 border-bone/10 bg-void p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold">{c.name}</span>
                    <span className="font-mono text-[11px] text-dust uppercase">{c.role}</span>
                  </div>
                  <p className="mt-2 font-mono text-sm text-flare">{c.hex}</p>
                  <p className="mt-2 text-sm text-dust">{c.note}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="type" className="border-t border-bone/10 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionKicker n="05">type</SectionKicker>
          <h2 className="font-display text-[clamp(2.8rem,12vw,9rem)] font-extrabold leading-[0.85] tracking-tight">
            how far
          </h2>
          <p className="mt-2 font-display text-xl text-flare md:text-3xl">
            always lowercase. never How Far. never HOW FAR.
          </p>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="rounded-[28px] border border-bone/10 p-8">
              <p className="font-mono text-[11px] tracking-[0.22em] text-dust uppercase">
                display — unbounded extra bold
              </p>
              <p className="mt-6 font-display text-5xl font-extrabold leading-[0.95] md:text-7xl">
                the gap
                <br />
                is the
                <br />
                point
              </p>
              <p className="mt-8 font-mono text-xs text-dust">
                Wide. Geometric. A little boxed-in, like a transmission window. Headlines only.
              </p>
            </div>
            <div className="rounded-[28px] border border-bone/10 p-8">
              <p className="font-mono text-[11px] tracking-[0.22em] text-dust uppercase">
                body — manrope
              </p>
              <p className="mt-6 text-xl leading-relaxed md:text-2xl">
                Write like a 1am text. Short sentences. Warm. No slogans that sound like a
                billboard trying to be your friend. If it wouldn’t come out of someone’s mouth on
                a street corner, cut it.
              </p>
              <p className="mt-8 font-mono text-xs text-dust">
                IBM Plex Mono for specs, timestamps, distances, hex.
              </p>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-[28px] bg-void p-8">
            <p className="font-mono text-[11px] tracking-[0.22em] text-dust uppercase">
              word space — 0.35em minimum between how and far
            </p>
            <div className="mt-6 flex flex-wrap items-end gap-x-12 gap-y-6">
              <span className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
                how<span className="inline-block w-[0.35em]" />far
              </span>
              <span className="font-mono text-xs text-volt">the space is part of the logo</span>
            </div>
          </div>
        </div>
      </section>

      <section id="voice" className="border-t border-bone/10 bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionKicker n="06">voice</SectionKicker>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
            sounds like a text,
            <br />
            not a press release.
          </h2>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-void p-8">
              <p className="font-mono text-[11px] tracking-[0.22em] text-volt uppercase">do</p>
              <ul className="mt-6 space-y-5 text-lg">
                <li>“how far”</li>
                <li>“just landed. you up?”</li>
                <li>“ping me when you’re close”</li>
                <li>“an ocean away, still here”</li>
                <li>“send a how far”</li>
              </ul>
            </div>
            <div className="rounded-[28px] border border-bone/10 p-8">
              <p className="font-mono text-[11px] tracking-[0.22em] text-flare uppercase">
                don’t
              </p>
              <ul className="mt-6 space-y-5 text-lg text-dust line-through decoration-flare/70">
                <li>“Welcome to HowFar™”</li>
                <li>“Connect with friends nearby!”</li>
                <li>“Your story. Your world. Your way.”</li>
                <li>HOW FAR ARE YOU??? 🔥🔥🔥</li>
                <li>“A revolutionary social platform”</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="world" className="border-t border-bone/10 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionKicker n="07">in the world</SectionKicker>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
            built to live on streets,
            <br />
            screens, and skin.
          </h2>

          <div className="mt-14 grid grid-cols-6 gap-3 md:gap-4">
            <div className="relative col-span-6 overflow-hidden rounded-[28px] md:col-span-4 md:row-span-2">
              <img
                src={PEXELS.shibuya}
                alt="Night crossing"
                className="h-[280px] w-full object-cover md:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <Wordmark className="text-3xl text-bone md:text-5xl" />
              </div>
            </div>
            <div className="relative col-span-3 overflow-hidden rounded-[28px] md:col-span-2">
              <img src={PEXELS.portraitW} alt="Portrait" className="h-64 w-full object-cover md:h-72" />
            </div>
            <div className="relative col-span-3 overflow-hidden rounded-[28px] md:col-span-2">
              <img src={PEXELS.portraitM} alt="Portrait" className="h-64 w-full object-cover md:h-72" />
            </div>
            <div className="relative col-span-6 overflow-hidden rounded-[28px] md:col-span-3">
              <img src="/images/billboard.jpg" alt="how far billboard" className="h-64 w-full object-cover md:h-80" />
            </div>
            <div className="relative col-span-6 overflow-hidden rounded-[28px] md:col-span-3">
              <img src={PEXELS.friends} alt="Friends" className="h-64 w-full object-cover md:h-80" />
              <div className="absolute inset-0 bg-flare/20 mix-blend-multiply" />
            </div>
            <div className="relative col-span-3 overflow-hidden rounded-[28px] md:col-span-2">
              <img src="/images/hoodie.jpg" alt="how far hoodie" className="h-72 w-full object-cover" />
            </div>
            <div className="relative col-span-3 overflow-hidden rounded-[28px] md:col-span-2">
              <img src="/images/sticker-sheet.jpg" alt="stickers" className="h-72 w-full object-cover" />
            </div>
            <div className="relative col-span-6 overflow-hidden rounded-[28px] md:col-span-2">
              <img src={PEXELS.neonWoman} alt="Neon portrait" className="h-72 w-full object-cover" />
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] tracking-[0.22em] text-dust uppercase">
                app icon
              </p>
              <div className="mt-6 flex flex-wrap items-end gap-6">
                <AppIcon className="h-28 w-28 shadow-2xl shadow-black/50" />
                <AppIcon className="h-20 w-20" />
                <AppIcon className="h-14 w-14" />
                <AppIcon className="h-10 w-10" />
                <AppIcon className="h-7 w-7" />
              </div>
              <p className="mt-6 max-w-sm text-sm text-dust">
                Squircle. Void field. Flare mark. Volt echo. No wordmark inside the icon — the
                silhouette has to hold at 16px.
              </p>
            </div>
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] tracking-[0.22em] text-dust uppercase">
                social avatar · favicon · mono
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="flex aspect-square items-center justify-center rounded-full bg-void ring-1 ring-bone/10">
                  <Mark className="h-[70%] w-[70%]" />
                </div>
                <div className="flex aspect-square items-center justify-center rounded-[28px] bg-bone">
                  <MarkMono className="h-[60%] w-[60%] text-void" color="#0A0908" />
                </div>
                <div className="flex aspect-square items-center justify-center rounded-[28px] bg-flare">
                  <MarkMono className="h-[60%] w-[60%]" color="#0A0908" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="border-t border-bone/10 bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionKicker n="08">the product</SectionKicker>
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
                send a how far.
                watch who answers.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-dust">
                Not a feed. Not a streak. A pulse you throw into the dark — voice, photo, or
                nothing but the ping — and a map of the people who ping back, plotted by how far
                they really are.
              </p>
              <button
                onClick={() => setSent(true)}
                className="mt-10 rounded-full bg-flare px-7 py-3 font-display text-sm font-bold text-void transition-transform hover:scale-105"
              >
                {sent ? "sent. travelling…" : "send a how far"}
              </button>
            </div>

            <div className="flex justify-center">
              <div className="phone-bezel relative w-[300px] rounded-[42px] p-3 md:w-[320px]">
                <div className="relative overflow-hidden rounded-[32px] bg-void">
                  <div className="flex items-center justify-between px-5 pb-2 pt-4">
                    <Mark className="h-7 w-7" />
                    <span className="font-display text-sm font-extrabold">how far</span>
                    <span className="h-7 w-7 rounded-full bg-stone" />
                  </div>

                  <div className="relative mx-auto my-4 h-[340px] w-[340px] max-w-full">
                    <div className="absolute inset-8 rounded-full border border-bone/10" />
                    <div className="absolute inset-16 rounded-full border border-bone/10" />
                    <div className="absolute inset-24 rounded-full border border-flare/30" />
                    <div
                      className="absolute inset-8 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent 0deg, rgba(198,255,61,0.16) 28deg, transparent 55deg)",
                        animation: "radar-sweep 5.5s linear infinite",
                      }}
                    />
                    {sent && (
                      <div
                        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-volt"
                        style={{ animation: "send-pulse 2.2s ease-out forwards" }}
                      />
                    )}
                    <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flare shadow-[0_0_20px_#FF4A1C]" />
                    <Ping label="amara · 2.1 km" x="68%" y="28%" />
                    <Ping label="dele · 840 km" x="22%" y="22%" volt />
                    <Ping label="noura · 4 m" x="58%" y="62%" />
                    <Ping label="kai · an ocean" x="30%" y="70%" volt />
                  </div>

                  <div className="px-5 pb-6">
                    <button
                      onClick={() => setSent(true)}
                      className="w-full rounded-full bg-flare py-3 font-display text-sm font-bold text-void"
                    >
                      send a how far
                    </button>
                    <p className="mt-3 text-center font-mono text-[10px] tracking-[0.18em] text-dust uppercase">
                      4 people within range of you
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-bone/10">
        <img
          src="/images/abstract-signal.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-void/70" />
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center md:py-40">
          <Mark className="mx-auto mb-10 h-24 w-24" animated />
          <h2 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight">
            wherever you are,
            <br />
            how far.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-dust">
            A brand for the space between people — and the greeting that refuses to let that space
            win.
          </p>
        </div>
      </section>

      <footer className="border-t border-bone/10 px-5 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Wordmark className="text-4xl" />
            <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-dust uppercase">
              the greeting that outran distance
            </p>
          </div>
          <div className="flex gap-8 font-mono text-[11px] tracking-[0.18em] text-dust uppercase">
            <a href="#mark" className="hover:text-flare">
              mark
            </a>
            <a href="#color" className="hover:text-flare">
              color
            </a>
            <a href="#product" className="hover:text-flare">
              app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Ping({
  label,
  x,
  y,
  volt = false,
}: {
  label: string;
  x: string;
  y: string;
  volt?: boolean;
}) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div
        className={`h-2.5 w-2.5 rounded-full ${volt ? "bg-volt" : "bg-flare"}`}
      />
      <span className="mt-1 block whitespace-nowrap font-mono text-[9px] tracking-wide text-bone/80">
        {label}
      </span>
    </div>
  );
}
