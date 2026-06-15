'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { scrollState } from '@/lib/scroll'
import { markAppNavigated } from '@/components/Preloader/Preloader'

// ─── CONTROLS ────────────────────────────────────────────────────────────────
const PUSH_DURATION = 1.1   // seconds for the push (old page up & out, new page in)
const PUSH_EASE = 'expo.inOut'
const DIM_OPACITY = 0.35    // how much the old page dims while the new one loads
const FAILSAFE_MS = 10000   // recover if the new route never arrives
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "Stack push" page transition. On an internal link click:
 *
 * 1. The current view is frozen — a visual snapshot (DOM clone, canvases
 *    captured as images) is placed in a fixed overlay, and dims slightly
 *    while the next route loads.
 * 2. Underneath, scroll resets and the (about-to-change) content is parked
 *    one viewport below the fold.
 * 3. When the new route has rendered, both layers slide up together: the old
 *    page is pushed up and out as the new page rides in from the bottom.
 *
 * Mounted in the (frontend) layout WRAPPING the page content. Intercepts all
 * internal link clicks in the capture phase (next/link bails out when it sees
 * defaultPrevented).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const wrapRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const scrimRef = useRef<HTMLDivElement | null>(null)
  const covering = useRef(false) // snapshot up, waiting for the new route
  const busy = useRef(false)     // a transition is in flight
  const firstPath = useRef(true)
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigateRef = useRef<(href: string) => void>(() => {})

  const finish = () => {
    overlayRef.current?.remove()
    overlayRef.current = null
    scrimRef.current = null
    if (wrapRef.current) gsap.set(wrapRef.current, { clearProps: 'transform,willChange' })
    scrollState.lenis?.start()
    covering.current = false
    busy.current = false
  }

  navigateRef.current = (href: string) => {
    if (busy.current) return
    const wrap = wrapRef.current
    if (!wrap) return
    busy.current = true
    markAppNavigated()
    scrollState.lenis?.stop() // no scrolling underneath the frozen snapshot

    // ── 1. freeze the current view in a fixed overlay ──
    const scrollY = window.scrollY
    const overlay = document.createElement('div')
    overlay.setAttribute('aria-hidden', 'true')
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '99999',
      overflow: 'hidden',
      background: '#000',
      pointerEvents: 'auto',
      willChange: 'transform',
    } as CSSStyleDeclaration)

    // The clone sits in a strip offset by the current scroll so the overlay
    // shows exactly what was on screen.
    const inner = document.createElement('div')
    Object.assign(inner.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      transform: `translateY(${-scrollY}px)`,
    } as CSSStyleDeclaration)

    const clone = wrap.cloneNode(true) as HTMLElement
    // Canvas pixels don't survive cloneNode — swap clones for image captures.
    const liveCanvases = Array.from(wrap.querySelectorAll('canvas'))
    Array.from(clone.querySelectorAll('canvas')).forEach((c, i) => {
      const live = liveCanvases[i]
      if (!live) return c.remove()
      try {
        const img = document.createElement('img')
        img.src = live.toDataURL()
        img.style.cssText = c.style.cssText
        img.style.width = '100%'
        img.style.height = '100%'
        img.style.display = 'block'
        c.replaceWith(img)
      } catch {
        c.remove() // tainted canvas — leave the slot empty rather than crash
      }
    })
    // Fixed elements lose viewport attachment inside a transformed ancestor —
    // re-anchor the header to where it was on screen.
    clone.querySelectorAll<HTMLElement>('.site-header').forEach((h) => {
      h.style.position = 'absolute'
      h.style.top = `${scrollY}px`
    })

    inner.appendChild(clone)
    overlay.appendChild(inner)

    // Dim falls over the old page while the next route loads.
    const scrim = document.createElement('div')
    Object.assign(scrim.style, {
      position: 'absolute',
      inset: '0',
      background: '#000',
      opacity: '0',
      pointerEvents: 'none',
    } as CSSStyleDeclaration)
    overlay.appendChild(scrim)
    document.body.appendChild(overlay)
    overlayRef.current = overlay
    scrimRef.current = scrim

    // ── 2. underneath the snapshot: reset scroll, park content below fold ──
    scrollState.lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    gsap.set(wrap, { y: '100vh', willChange: 'transform' })
    gsap.to(scrim, { opacity: DIM_OPACITY, duration: 0.5, ease: 'power2.out' })
    covering.current = true
    router.push(href)

    failsafe.current = setTimeout(() => {
      if (covering.current) finish()
    }, FAILSAFE_MS)
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
      e.preventDefault()
      if (url.pathname === window.location.pathname) return // already here
      navigateRef.current(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', onClick, true)
    // Back/forward swaps the page without the push — still make sure the
    // homepage preloader knows this isn't a fresh visit.
    window.addEventListener('popstate', markAppNavigated)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', markAppNavigated)
    }
  }, [])

  // ── 3. the new route rendered below the fold — push both layers up ──
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false
      return
    }
    if (!covering.current) return
    covering.current = false
    if (failsafe.current) clearTimeout(failsafe.current)

    // Give the new page a frame to paint before moving.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const tl = gsap.timeline({ onComplete: finish })
        if (overlayRef.current) {
          tl.to(overlayRef.current, { y: '-100vh', duration: PUSH_DURATION, ease: PUSH_EASE }, 0)
        }
        if (wrapRef.current) {
          tl.to(wrapRef.current, { y: '0vh', duration: PUSH_DURATION, ease: PUSH_EASE }, 0)
        }
      }),
    )
  }, [pathname])

  return <div ref={wrapRef}>{children}</div>
}
