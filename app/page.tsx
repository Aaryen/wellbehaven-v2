import Link from 'next/link'
import { ArrowRight, MessageCircle, Shield, Heart } from 'lucide-react'
import Nav from '@/components/layout/Nav'

const testimonials = [
  {
    quote:
      "I didn't know how to talk about the divorce with anyone who hadn't been through it. Here, everyone just… gets it.",
    circle: 'Going Through Divorce',
  },
  {
    quote:
      'Grief is so isolating. Finding this circle made me feel less alone at 2am when the sadness hits hardest.',
    circle: 'Grief & Loss',
  },
  {
    quote:
      "I was ashamed of how burnt out I felt. Talking to others who felt the same way helped me stop blaming myself.",
    circle: 'Burnout Recovery',
  },
]

const steps = [
  {
    Icon: Shield,
    title: 'Find your circle',
    desc: 'Browse circles by what you\'re going through — grief, divorce, anxiety, burnout, and more.',
  },
  {
    Icon: MessageCircle,
    title: 'Join anonymously',
    desc: 'No real names required. Choose your own name and share as much or as little as you want.',
  },
  {
    Icon: Heart,
    title: 'Feel understood',
    desc: 'Talk to people who\'ve been there. Or chat privately with Haven, your AI companion.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      {/* Hero */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #1A3E1E 0%, #2E5E32 60%, #3D7A42 100%)' }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-300">
            WellbeHaven
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Find the people who
            <br />
            already understand.
          </h1>
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-green-100 sm:text-xl">
            Small private circles for people going through divorce, grief, burnout, loss.
            No strangers. Just people who get it.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
            <Link
              href="/havens"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-[#2E5E32] transition-colors hover:bg-green-50"
            >
              Find my SaveHaven <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/haven"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-white/40 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Talk to Haven privately
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30">
          <div className="mx-auto h-10 w-px rounded bg-white" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#FDFAF5] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-[#162018] sm:text-3xl">
            From people like you
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            All names are anonymous. All stories are real.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#E8F0E9] bg-white p-6 shadow-sm"
              >
                <p className="mb-4 leading-relaxed text-[#162018]">"{t.quote}"</p>
                <div className="text-sm">
                  <p className="font-medium text-[#5E9462]">Anonymous</p>
                  <p className="text-zinc-400">{t.circle} circle</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#E8F0E9] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-[#162018] sm:text-3xl">
            How it works
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map(({ Icon, title, desc }, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E5E32] text-white shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#5E9462]">
                    Step {i + 1}
                  </p>
                  <h3 className="mb-2 font-semibold text-[#162018]">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#162018] px-6 py-14 text-green-100">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <p className="text-lg font-semibold text-white">WellbeHaven</p>
          <p className="mx-auto max-w-md text-sm text-green-300">
            If you are in crisis, please call or text{' '}
            <a href="tel:988" className="font-semibold underline">
              988
            </a>{' '}
            (Suicide &amp; Crisis Lifeline) or text{' '}
            <a href="sms:741741" className="font-semibold underline">
              HOME to 741741
            </a>
            .
          </p>
          <p className="pt-4 text-xs text-zinc-500">
            WellbeHaven is not a medical service. We connect people with shared experiences.
          </p>
        </div>
      </footer>
    </div>
  )
}
