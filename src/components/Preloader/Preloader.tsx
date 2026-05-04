'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const SLIDE_DURATION = 1.0    // seconds for the slide-up transition
const POST_LOTTIE_HOLD = 0.15 // brief beat after the lottie completes before sliding

export const PRELOADER_DONE_EVENT = 'preloader:done'

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const lottieHostRef = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const host = lottieHostRef.current
    const root = rootRef.current
    if (!host || !root) return

    document.body.style.overflow = 'hidden'

    let anim: { destroy: () => void } | null = null
    let cancelled = false

    import('lottie-web').then((mod) => {
      if (cancelled) return
      const lottie = mod.default
      const instance = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '/Logo Preloader Animation.json',
      })
      anim = instance

      instance.addEventListener('complete', () => {
        gsap.to(root, {
          yPercent: -100,
          duration: SLIDE_DURATION,
          delay: POST_LOTTIE_HOLD,
          ease: 'power3.inOut',
          onStart: () => {
            window.dispatchEvent(new Event(PRELOADER_DONE_EVENT))
          },
          onComplete: () => {
            document.body.style.overflow = ''
            setRemoved(true)
          },
        })
      })
    })

    return () => {
      cancelled = true
      anim?.destroy()
      document.body.style.overflow = ''
    }
  }, [])

  if (removed) return null

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: '#000',
        display: 'grid',
        placeItems: 'center',
        willChange: 'transform',
      }}
    >
      <div
        ref={lottieHostRef}
        style={{
          width: 'min(45vw, 45vh)',
          aspectRatio: '1 / 1',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.111,
          pointerEvents: 'none',
          backgroundImage: 'url(/tv-static.gif)',
          backgroundPosition: '0 0',
          backgroundSize: 'auto',
        }}
      />
    </div>
  )
}
