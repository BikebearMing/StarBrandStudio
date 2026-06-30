'use client'

import { useEffect, useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  // While the mobile drawer is open, pause Lenis so the page behind doesn't
  // scroll, and allow Escape to close it.
  useEffect(() => {
    if (!menuOpen) return
    scrollState.lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      scrollState.lenis?.start()
    }
  }, [menuOpen])

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
    setMenuOpen(false)
    // Closing the drawer re-starts Lenis via effect cleanup, but that runs after
    // this handler — start it now so the scroll below isn't swallowed.
    scrollState.lenis?.start()
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
    <header className={`site-header${menuOpen ? ' is-menu-open' : ''}`}>
      <div className="wrapper">
        <a href="/" className="site-header__logo" aria-label="Star Brand Studio">
          <img src="/Logo.svg" alt="Star Brand Studio" />
        </a>
        {/* Desktop nav — hidden on mobile, where the burger + drawer take over. */}
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
          <a href="/our-story" className="site-header__nav-link body">Our Story</a>
        </nav>

        {/* Mobile-only hamburger; toggles .is-menu-open on the header. */}
        <button
          type="button"
          className="site-header__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="site-header__burger-line" />
          <span className="site-header__burger-line" />
          <span className="site-header__burger-line" />
        </button>
      </div>

      {/* Right-side drawer. Clicking the scrim (outside the panel) closes it. */}
      <div
        className="site-menu"
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false)
        }}
      >
        <nav className="site-menu__panel" aria-label="Mobile menu">
          <ul className="site-menu__list">
            <li className="site-menu__item">
              <a href="/works" className="site-menu__link h2" onClick={() => setMenuOpen(false)}>Works</a>
            </li>
            <li className="site-menu__item">
              <a href="/awards" className="site-menu__link h2" onClick={() => setMenuOpen(false)}>Awards</a>
            </li>
            <li className="site-menu__item">
              <a href="/our-story" className="site-menu__link h2" onClick={() => setMenuOpen(false)}>Our Story</a>
            </li>
            <li className="site-menu__item">
              <a href="/#contact" className="site-menu__link h2" onClick={handleContactClick}>Let&rsquo;s Talk</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
