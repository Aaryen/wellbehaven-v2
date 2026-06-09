import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-[#162018]">
          Wellbe{' '}
          <em className="italic not-italic text-[#2E5E32]" style={{ fontStyle: 'italic' }}>
            Haven
          </em>
        </Link>
        <div className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/havens"
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-[#E8F0E9] hover:text-[#2E5E32]"
          >
            SaveHavens
          </Link>
          <Link
            href="/haven"
            className="rounded-2xl bg-[#2E5E32] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#245028]"
          >
            Haven
          </Link>
        </div>
      </div>
    </nav>
  )
}
