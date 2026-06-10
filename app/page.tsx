import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Shield, EyeOff, Heart, ChevronDown } from 'lucide-react'
import Nav from '@/components/layout/Nav'

const testimonials = [
  {
    quote:
      "I picked up the phone to call her for 6 months before I stopped trying. Coming here was the first place I felt like that was normal.",
    name: 'WillowBranch',
    circle: 'Losing a parent',
  },
  {
    quote:
      "Day 31. Some days feel impossibly long. But I'm still here. And this circle reminds me that's enough.",
    name: 'RisingTide',
    circle: 'Early sobriety',
  },
  {
    quote:
      "Two years out and I'm still unlearning what he made me believe about myself. But I'm unlearning them. This group is why.",
    name: 'QuietDawn',
    circle: 'Leaving a toxic relationship',
  },
]

const steps = [
  {
    number: '1',
    title: "Tell us what you're carrying",
    desc: "One honest answer. Not to judge you — to find your people.",
  },
  {
    number: '2',
    title: 'Find your SaveHaven',
    desc: "25 people max. Built around your exact situation, not a general category.",
  },
  {
    number: '3',
    title: 'Just show up honestly',
    desc: "No performance. No advice. Just people who've been where you are.",
  },
]

const promises = [
  {
    Icon: Shield,
    title: 'No real names required',
    desc: 'You choose who you are here. Nothing has to connect back to you.',
  },
  {
    Icon: EyeOff,
    title: 'No ads. No data selling.',
    desc: 'Your pain is not a product. We will never profit from what you share.',
  },
  {
    Icon: Heart,
    title: 'Honest about our limits',
    desc: "We're not a substitute for therapy or crisis services — and we'll always tell you that.",
  },
]

const serif = { fontFamily: "var(--font-playfair), Georgia, 'Times New Roman', serif" }

export default function HomePage() {
  return (
    <div>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(22,62,30,0.88) 100%)',
          }}
        />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-14 text-center text-white sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-green-300/80">
              WellbeHaven
            </p>

            <h1
              className="mb-7 font-bold leading-[1.08] tracking-tight text-white"
              style={{
                ...serif,
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              }}
            >
              Find the people who
              <br />
              already understand.
            </h1>

            <p className="mx-auto mb-10 max-w-[560px] text-lg leading-relaxed text-white/65 sm:text-xl">
              Small private circles for people going through divorce, grief,
              burnout, loss. No strangers. Just people who get it.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/havens"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-semibold text-[#1A3E1E] shadow-lg transition-all hover:bg-green-50 hover:shadow-xl"
              >
                Find my SaveHaven <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/haven"
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/70 hover:bg-white/10"
              >
                Talk to Haven privately
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/35">
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em]">scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="bg-[#FDFAF5] px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2
              className="mb-3 text-3xl font-bold text-[#162018] sm:text-4xl"
              style={serif}
            >
              Words that stayed with us
            </h2>
            <p className="text-sm text-zinc-400">
              All names are anonymous. All stories are real.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl bg-[#FAFCFA] p-8 shadow-sm ring-1 ring-[#E8F0E9] transition-shadow hover:shadow-md"
              >
                <span
                  className="mb-3 block text-7xl font-bold leading-none text-[#5E9462]"
                  style={serif}
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="flex-1 text-sm leading-relaxed text-[#162018]">
                  {t.quote}
                </p>
                <div className="mt-5 border-t border-[#E8F0E9] pt-4">
                  <p className="text-sm font-semibold text-[#2E5E32]">{t.name}</p>
                  <p className="text-xs text-zinc-400">{t.circle} circle</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="bg-[#E8F0E9] px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-16 text-center text-3xl font-bold text-[#162018] sm:text-4xl"
            style={serif}
          >
            Three steps to feeling
            <br className="hidden sm:block" /> genuinely understood
          </h2>

          <div className="grid gap-12 sm:grid-cols-3">
            {steps.map(({ number, title, desc }) => (
              <div key={number} className="flex flex-col gap-4 sm:min-h-[200px]">
                <span
                  className="text-8xl font-bold leading-none text-[#2E5E32]/15 select-none"
                  style={serif}
                  aria-hidden
                >
                  {number}
                </span>
                <div className="flex flex-col">
                  <h3 className="mb-2 text-base font-semibold text-[#162018]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy promises ──────────────────────────────────────── */}
      <section className="bg-[#1A3E1E] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-14 text-center text-3xl font-bold text-white sm:text-4xl"
            style={serif}
          >
            What you share here,
            <br />
            stays here.
          </h2>

          <div className="grid gap-10 sm:grid-cols-3">
            {promises.map(({ Icon, title, desc }, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                  <Icon className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <p className="mb-1.5 text-base font-medium text-white">{title}</p>
                  <p className="text-sm leading-relaxed text-green-100/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="bg-[#0F2412] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-base font-semibold text-white" style={serif}>
            WellbeHaven
          </p>

          <p className="text-xs text-zinc-500">
            In crisis?{' '}
            <a href="tel:08000113" className="font-semibold text-zinc-300 underline">
              0800-0113
            </a>{' '}
            (NL) ·{' '}
            <a href="tel:988" className="font-semibold text-zinc-300 underline">
              988
            </a>{' '}
            (US)
          </p>

          <p className="text-xs text-zinc-600">
            Not a substitute for therapy or crisis services.
          </p>
        </div>
      </footer>
    </div>
  )
}
