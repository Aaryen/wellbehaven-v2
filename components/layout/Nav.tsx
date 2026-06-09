'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isHome) {
      setScrolled(false)
      return
    }
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const transparent = isHome && !scrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        transparent
          ? 'border-transparent bg-transparent'
          : 'border-zinc-100/80 bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className={`text-lg font-semibold transition-colors duration-300 ${
            transparent ? 'text-white' : 'text-[#162018]'
          }`}
        >
          Wellbe{' '}
          <em
            className={`not-italic transition-colors duration-300 ${
              transparent ? 'text-green-300' : 'text-[#2E5E32]'
            }`}
            style={{ fontStyle: 'italic' }}
          >
            Haven
          </em>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/havens"
            className={`flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium transition-colors duration-300 ${
              transparent
                ? 'text-white/80 hover:bg-white/10 hover:text-white'
                : 'text-zinc-600 hover:bg-[#E8F0E9] hover:text-[#2E5E32]'
            }`}
          >
            SaveHavens
          </Link>
          <Link
            href="/haven"
            className={`flex min-h-[44px] items-center rounded-2xl px-4 text-sm font-medium transition-all duration-300 ${
              transparent
                ? 'border border-white/40 bg-white/15 text-white hover:bg-white/25 hover:border-white/60'
                : 'bg-[#2E5E32] text-white hover:bg-[#245028]'
            }`}
          >
            Haven
          </Link>
        </div>
      </div>
    </nav>
  )
}
