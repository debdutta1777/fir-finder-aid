import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Database,
  FileCheck2,
  FileUp,
  Languages,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LandingDemo } from "@/components/landing-demo";

const FEATURES = [
  {
    icon: FileCheck2,
    title: "Structured extraction",
    text: "Fourteen core FIR fields pulled from scanned pages, shown beside the original OCR narrative.",
  },
  {
    icon: Sparkles,
    title: "Local summarization",
    text: "A locally hosted model writes the case brief, so documents never leave the workstation.",
  },
  {
    icon: Search,
    title: "Fast retrieval",
    text: "Look up an FIR number, a complainant name, a station, or ask in plain language.",
  },
  {
    icon: MessageSquareText,
    title: "Record assistant",
    text: "Ask a question and get the matching FIR context back with links to the full record.",
  },
  {
    icon: Languages,
    title: "Optional translation",
    text: "Twelve-plus output languages including Urdu, Assamese, and Nepali when the network allows.",
  },
  {
    icon: Database,
    title: "Local record store",
    text: "Every processed FIR is indexed on this machine and paginated for review.",
  },
];

const STEPS = [
  { title: "Upload the scan", text: "Drop a PDF, photo, or TIFF of the FIR straight from the station scanner." },
  { title: "Read the page", text: "OCR lifts the Hindi, Bengali, or English narrative from the handwritten sheet." },
  { title: "Extract & summarize", text: "Fourteen fields and a plain-English brief are produced by the local model." },
  { title: "File & retrieve", text: "The record joins the local index, searchable by number, name, or question." },
];

const STATS = [
  { value: 14, suffix: "", label: "Metadata fields" },
  { value: 12, suffix: "+", label: "Output languages" },
  { value: 5, suffix: "", label: "File formats" },
  { value: 100, suffix: "%", label: "On-premise" },
];


function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const { ref, inView } = useInView<HTMLParagraphElement>();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <p ref={ref} className="font-serif text-4xl font-bold text-primary sm:text-5xl">
      {shown}
      {suffix}
    </p>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="landing-reveal"
      data-visible={inView ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function HomeLanding() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-sidebar-border bg-sidebar/95 text-sidebar-foreground backdrop-blur">
        <div className="mx-auto flex h-16 w-[min(100%-2rem,1180px)] items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div>
              <span className="block font-serif text-sm font-bold tracking-wide">FIR SUMMARIZER</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/65">
                Investigation portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden border-sidebar-border bg-sidebar/70 text-sidebar-foreground sm:inline-flex">
              Local-first workspace
            </Badge>
            <Button asChild size="sm" variant="secondary">
              <Link to="/dashboard">Open portal</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero banner */}
        <section className="landing-hero relative overflow-hidden border-b border-border">
          <div className="landing-mesh" aria-hidden />
          <div className="landing-glow" aria-hidden />
          <div className="relative mx-auto w-[min(100%-2rem,1180px)] py-16 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr]">
              <div>
                <span className="landing-stagger inline-flex items-center gap-2 rounded-full border border-accent bg-accent/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-foreground" style={{ animationDelay: "60ms" }}>
                  <span className="landing-ping" aria-hidden />
                  Runs entirely on your workstation
                </span>
                <h1 className="landing-stagger mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: "140ms" }}>
                  Turn handwritten FIRs into a{" "}
                  <span className="landing-underline text-chart-1">clear case brief</span>
                </h1>
                <p className="landing-stagger mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg" style={{ animationDelay: "220ms" }}>
                  Scan the record, read the extracted fields, review a plain-English summary, and find related
                  FIRs — from one focused portal that keeps every document on this machine.
                </p>
                <div className="landing-stagger mt-9 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
                  <Button asChild size="lg" className="group">
                    <Link to="/dashboard">
                      Enter investigation portal
                      <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/upload">
                      Upload an FIR <FileUp />
                    </Link>
                  </Button>
                </div>
                <ul className="landing-stagger mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground" style={{ animationDelay: "380ms" }}>
                  <li className="flex items-center gap-2">
                    <WifiOff className="size-3.5 text-chart-1" aria-hidden /> Air-gap friendly
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-chart-1" aria-hidden /> No case data uploaded
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="size-3.5 text-chart-1" aria-hidden /> Local record index
                  </li>
                </ul>
              </div>

              <div className="landing-stagger" style={{ animationDelay: "260ms" }}>
                <LandingDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 90}>
                <div>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-border">
          <div className="mx-auto w-[min(100%-2rem,1180px)] py-16 sm:py-20">
            <Reveal>
              <div className="max-w-2xl">
                <p className="portal-kicker">Workflow</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Four steps from scanned page to filed record
                </h2>
              </div>
            </Reveal>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((entry, index) => (
                <li key={entry.title} className="bg-card">
                  <Reveal delay={index * 80}>
                    <div className="h-full p-6">
                      <span className="font-serif text-sm font-bold text-chart-1">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 font-serif text-lg font-bold">{entry.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>


        {/* Features */}
        <section className="portal-grid border-b border-border">
          <div className="mx-auto w-[min(100%-2rem,1180px)] py-16 sm:py-20">
            <Reveal>
              <div className="max-w-2xl">
                <p className="portal-kicker">Capabilities</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Everything the case file needs, on one desk
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Each capability maps directly to the local processing service — nothing here depends on an
                  external provider except optional translation.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.title} delay={index * 70}>
                    <article className="landing-card group h-full border border-border bg-card p-6">
                      <span className="flex size-11 items-center justify-center rounded-md bg-accent/30 text-chart-1 transition-transform duration-300 group-hover:-translate-y-0.5">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="mt-5 font-serif text-lg font-bold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Supported inputs */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid w-[min(100%-2rem,1180px)] gap-10 py-16 lg:grid-cols-[.9fr_1.1fr]">
            <Reveal>
              <div>
                <p className="portal-kicker">Accepted inputs</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">Bring the file as it arrived</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                  Scanned PDFs, photographs from a station phone, TIFF archives, or plain text transcripts are
                  all read the same way.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["PDF", "PNG", "JPG / JPEG", "TIFF", "TXT", "Hindi & Bengali OCR"].map((item, index) => (
                <Reveal key={item} delay={index * 60}>
                  <div className="landing-card flex h-full items-center gap-2 border border-border bg-background px-4 py-4 text-sm font-semibold">
                    <FileCheck2 className="size-4 shrink-0 text-chart-1" aria-hidden />
                    {item}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
          <div className="landing-mesh landing-mesh-dark" aria-hidden />
          <div className="relative mx-auto w-[min(100%-2rem,1180px)] py-16 text-center sm:py-20">
            <Reveal>
              <div className="mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start with a single FIR</h2>
                <p className="mt-4 text-sm leading-7 text-sidebar-foreground/75 sm:text-base">
                  Upload a scanned report and see the extracted record, the summary, and the raw OCR side by side.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" variant="secondary" className="group">
                    <Link to="/upload">
                      Upload & summarize
                      <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Link to="/records">Browse all records</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-sidebar-border bg-sidebar py-6 text-sidebar-foreground">
        <div className="mx-auto w-[min(100%-2rem,1180px)] text-xs text-sidebar-foreground/70">
          Local workstation mode. Records stay on this machine.
        </div>
      </footer>
    </div>
  );
}
