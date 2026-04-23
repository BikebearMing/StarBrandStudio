'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { scrollState } from '@/lib/scroll'

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    })

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
    }
  }, [])

  return null
}
