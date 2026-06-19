'use client'

import { useEffect } from 'react'
import { onPreloaderDone } from '@/components/Preloader/Preloader'
import { scrollState } from '@/lib/scroll'

// sessionStorage flag set just before we navigate home so the contact form can
// be revealed once the page (and its preloader) has finished loading.
const PENDING_SCROLL_KEY = 'scrollToContact'

/**
 * Smooth-scroll to the on-page contact form. Returns false if this page has no
 * contact form (so the caller can fall back to navigating home).
 */
function scrollToContact(): boolean {
  const el = document.getElementById('contact')
  if (!el) return false

  const lenis = scrollState.lenis
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 2 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  return true
}

export default function Header() {
  // If we arrived here after a "Let's Talk" click on a page without a contact
  // form, scroll to the form once the preloader has finished. We wait for the
  // slide-up to complete (body scroll is locked until then) before scrolling.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(PENDING_SCROLL_KEY) !== '1') return
    sessionStorage.removeItem(PENDING_SCROLL_KEY)

    return onPreloaderDone((instant) => {
      window.setTimeout(() => scrollToContact(), instant ? 0 : 1300)
    })
  }, [])

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // On a page that already has the contact form, just scroll to it.
    if (scrollToContact()) return
    // Otherwise head home and scroll to its contact form after it loads.
    try {
      sessionStorage.setItem(PENDING_SCROLL_KEY, '1')
    } catch {
      // ignore storage failures — navigation still happens
    }
    window.location.href = '/'
  }

  return (
    <header className="site-header">
      <div className="wrapper">
        <a href="/" className="site-header__logo" aria-label="Star Brand Studio">
          <img src="/Logo.svg" alt="Star Brand Studio" />
        </a>
        <nav className="site-header__nav">
          <a href="/#contact" className="custom-button" onClick={handleContactClick}>
            <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="ring ring--outer" cx="12" cy="12" r="11" />
              <circle className="ring ring--middle" cx="12" cy="12" r="7" />
              <circle className="ring ring--inner" cx="12" cy="12" r="3" />
            </svg>
            <span>LET&rsquo;S TALK</span>
          </a>
          <a href="/works" className="site-header__nav-link body">Works</a>
          <a href="/awards" className="site-header__nav-link body">Awards</a>
        </nav>
      </div>
    </header>
  )
}
