import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Lock as LockIcon,
  Boxes,
} from "lucide-react";
import { categories, tools } from "../lib/tools";
import { categoryIcons } from "../lib/categoryIcons";
import { siteConfig } from "../lib/siteConfig";
import { LandingNav } from "../components/LandingNav";
import { FaqItem } from "../components/FaqItem";

const valueProps = [
  { icon: ShieldCheck, title: "100% free", desc: "No tiers, no paywalls, no \"pro\" version." },
  { icon: LockIcon, title: "Runs in your browser", desc: "Every operation happens on-device. Nothing is ever uploaded." },
  { icon: Zap, title: "No accounts", desc: "No sign-up, no rate limits, no tracking." },
  { icon: Boxes, title: "30 tools, one workspace", desc: "Stop juggling tabs across seven different sites." },
];

const faqs = [
  {
    q: "Is DevKit actually free?",
    a: "Yes — entirely. It's a static site with no backend, so there's no server cost tied to your usage and nothing to subscribe to.",
  },
  {
    q: "Does any of my data get sent to a server?",
    a: "No. Every tool — JWT decoding, encryption, hashing, JSON processing — runs locally in your browser using the Web Crypto API and client-side libraries. Nothing you type is transmitted anywhere.",
  },
  {
    q: "What is the JWT Fuzzer, and is it safe to use?",
    a: "It generates mutated tokens covering known JWT attack vectors (alg:none, RS/HS confusion, jku injection, and more) so you can test whether your own verifier rejects them. It's a defensive testing tool, intended for your own systems.",
  },
  {
    q: "What JWT algorithms are supported?",
    a: "HS256/384/512 for HMAC signing and verification, plus RS256/384/512 and ES256/384/512 for RSA/EC key pairs — generated with the Web Crypto API.",
  },
  {
    q: "Can I self-host this?",
    a: "Yes. It's a static Vite build with no environment variables or API keys required — deploy the dist/ folder anywhere that serves static files.",
  },
  {
    q: "Should I use this for production secrets?",
    a: "The cryptography itself uses standard, audited primitives (Web Crypto API), but always evaluate any client-side tool against your own security requirements before handling highly sensitive production secrets.",
  },
];

export default function Landing() {
  return (
    <div id="top" className="min-h-screen bg-[var(--color-bg)]">
      <LandingNav />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-20 text-center md:px-6 md:pt-28">
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[12px] font-medium text-[var(--color-ink-dim)]">
          <ShieldCheck size={13} className="text-[var(--color-accent)]" />
          Free · Client-side · {tools.length} tools
        </span>
        <h1 className="text-balance text-[40px] font-bold leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-[56px]">
          Developer tools,
          <br />
          without the tab hoarding.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-[17px] leading-relaxed text-[var(--color-ink-dim)]">
          JWT, JSON, cryptography, and encoding utilities — in one clean, fast workspace.
          Every tool runs entirely on your device.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/app"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Launch App <ArrowRight size={15} />
          </Link>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-[14px] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-border-strong)]"
          >
            Browse tools
          </a>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
          {valueProps.map((v) => (
            <div key={v.title} className="flex flex-col items-center gap-2.5 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <v.icon size={18} />
              </span>
              <div className="text-[14px] font-semibold text-[var(--color-ink)]">{v.title}</div>
              <div className="text-[12.5px] leading-snug text-[var(--color-ink-dim)]">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features / tool categories */}
      <section id="features" className="scroll-mt-16 mx-auto max-w-5xl px-4 py-20 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-[30px] font-bold tracking-tight text-[var(--color-ink)] sm:text-[36px]">
            Everything in one place
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[15px] text-[var(--color-ink-dim)]">
            Seven categories, {tools.length} tools, zero context-switching.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id];
            const catTools = tools.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} id={cat.id} className="scroll-mt-20">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="text-[19px] font-semibold text-[var(--color-ink)]">{cat.label}</h3>
                    <p className="mt-0.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--color-ink-dim)]">
                      {cat.blurb}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {catTools.map((t) => (
                    <Link
                      key={t.id}
                      to={t.path}
                      className="focus-ring group flex items-center justify-between gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
                    >
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-[var(--color-ink)]">{t.name}</div>
                        <div className="mt-0.5 truncate text-[12px] text-[var(--color-ink-dim)]">{t.description}</div>
                      </div>
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-2xl px-4 py-20 md:px-6">
          <h2 className="text-center text-[30px] font-bold tracking-tight text-[var(--color-ink)] sm:text-[36px]">
            Frequently asked
          </h2>
          <div className="mt-10">
            {faqs.map((f) => (
              <FaqItem key={f.q} question={f.q} answer={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
              <ShieldCheck size={14} />
            </span>
            <span className="text-[14px] font-semibold text-[var(--color-ink)]">{siteConfig.name}</span>
          </div>
          <p className="text-[12.5px] text-[var(--color-ink-faint)]">
            Built by{" "}
            <a
              href={siteConfig.authorUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-[var(--color-ink-dim)] hover:text-[var(--color-accent)]"
            >
              {siteConfig.authorName} <ArrowUpRight size={11} />
            </a>{" "}
            · Free forever · Runs entirely in your browser
          </p>
        </div>
      </footer>
    </div>
  );
}
