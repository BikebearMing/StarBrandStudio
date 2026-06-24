'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { scrollState } from '@/lib/scroll'
import { markAppNavigated } from '@/components/Preloader/Preloader'

// ─── CONTROLS ────────────────────────────────────────────────────────────────
const COVER_DURATION = 0.6   // red panel slides up from the bottom to cover
const REVEAL_DURATION = 0.6  // red panel slides up off the top to reveal
const EASE = 'power3.inOut'
const FAILSAFE_MS = 8000     // clear the panel if the new route never commits
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Red "wipe" page transition.
 *
 * Runs ONLY when navigating TO a non-home page (home→other and other→other).
 * Navigating back to home ("/") is deliberately left as a plain client-side
 * navigation — no wipe.
 *
 * On a qualifying internal link click: a solid red panel (brand `--red`) slides
 * up from the bottom to cover the screen, the new route is pushed behind it,
 * then the panel keeps sliding up and off the top to reveal the new page.
 *
 * ── Scroll-safety (hard requirements) ──
 *   • The panel is a `position: fixed; inset: 0` element appended to <body>, so
 *     it NEVER contributes to document height — it can't cause scroll/clamp
 *     issues. The page tree is never wrapped or transformed.
 *   • Lenis is NEVER stopped (that previously left smooth-scroll permanently
 *     disabled). We only reset the scroll position with `lenis.scrollTo(0)`.
 * See [[page-transition-scroll-lock]].
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const covering = useRef(false) // panel is up, waiting for the new route
  const busy = useRef(false)     // a transition is in flight
  const firstPath = useRef(true)
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigateRef = useRef<(href: string) => void>(() => {})
  const revealRef = useRef<() => void>(() => {})

  const cleanup = () => {
    if (failsafe.current) {
      clearTimeout(failsafe.current)
      failsafe.current = null
    }
    panelRef.current?.remove()
    panelRef.current = null
    covering.current = false
    busy.current = false
  }

  // Slide the panel up and off the top, then tear everything down.
  revealRef.current = () => {
    covering.current = false
    if (failsafe.current) {
      clearTimeout(failsafe.current)
      failsafe.current = null
    }
    const panel = panelRef.current
    if (!panel) return cleanup()
    // Let the new page paint a frame before uncovering it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        gsap.to(panel, {
          y: '-100%',
          duration: REVEAL_DURATION,
          ease: EASE,
          onComplete: cleanup,
        })
      }),
    )
  }

  navigateRef.current = (href: string) => {
    if (busy.current) return
    busy.current = true

    // Solid red panel parked just below the fold. `position: fixed` keeps it out
    // of document flow, so it never affects page height / scrolling.
    const panel = document.createElement('div')
    panel.setAttribute('aria-hidden', 'true')
    Object.assign(panel.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: 'var(--red)',
      transform: 'translateY(100%)',
      willChange: 'transform',
      pointerEvents: 'auto',
    } as CSSStyleDeclaration)
    document.body.appendChild(panel)
    panelRef.current = panel

    gsap.to(panel, {
      y: '0%',
      duration: COVER_DURATION,
      ease: EASE,
      onComplete: () => {
        // Reset to the top WITHOUT stopping Lenis — sync its internal position
        // too, otherwise Lenis would snap the window back on its next frame.
        scrollState.lenis?.scrollTo(0, { immediate: true, force: true })
        window.scrollTo(0, 0)
        covering.current = true
        router.push(href)
        failsafe.current = setTimeout(() => {
          if (covering.current) revealRef.current()
        }, FAILSAFE_MS)
      },
    })
  }

  // Intercept internal link clicks globally — capture phase runs before
  // next/link's own handler, which bails out when defaultPrevented is set.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest?.('a')
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return
      if (url.pathname === window.location.pathname) return // already here
      // This is a real internal navigation — let the preloader know it's not a
      // fresh visit (so home won't replay its intro), regardless of the wipe.
      markAppNavigated()
      // Going back to home: no wipe — let next/link navigate normally.
      if (url.pathname === '/') return
      e.preventDefault()
      navigateRef.current(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', onClick, true)
    // Back/forward swaps the page without the wipe — still flag the navigation.
    window.addEventListener('popstate', markAppNavigated)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', markAppNavigated)
    }
  }, [])

  // The new route committed (pathname changed) — uncover it.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false
      return
    }
    if (covering.current) revealRef.current()
  }, [pathname])

  return <>{children}</>
}
