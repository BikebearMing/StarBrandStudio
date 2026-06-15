'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { scrollState } from '@/lib/scroll'

export default function SmoothScroll() {
  const pathname = usePathname()

  // After a route change (especially back/forward, where Next restores the
  // old scroll position) Lenis's internal position goes stale — the next
  // wheel input would teleport to wherever Lenis last thought it was.
  // Re-sync it to the browser's actual position.
  useEffect(() => {
    const sync = () =>
      scrollState.lenis?.scrollTo(window.scrollY, { immediate: true, force: true })
    const raf = requestAnimationFrame(() => requestAnimationFrame(sync))
    const timer = setTimeout(sync, 250)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    scrollState.lenis = lenis

    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      scrollState.velocity = velocity
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      scrollState.velocity = 0
      scrollState.lenis = null
    }
  }, [])

  return null
}
