'use client'

import { useEffect, useRef, useState } from 'react'

type NavLink = { label: string; href: string }

const NAV_LINKS: NavLink[] = [
  { label: 'HOME', href: '/' },
  { label: 'WORKS', href: '/works' },
  { label: 'AWARDS', href: '/awards' },
]

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.red-section')
    )
    if (sections.length === 0) return

    let rafId = 0

    const update = () => {
      rafId = 0
      const headerRect = header.getBoundingClientRect()
      const midline = headerRect.top + headerRect.height / 2

      const onRed = sections.some((section) => {
        const r = section.getBoundingClientRect()
        return r.top <= midline && r.bottom >= midline
      })

      header.classList.toggle('is-on-red', onRed)
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  // Close on Escape + lock body scroll while the menu is open.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className={`site-header grain-effect${menuOpen ? ' is-menu-open' : ''}`}
    >
      <div className="wrapper">
        <a href="/" className="site-header__logo" aria-label="Star Brand Studio">
          <img src="/Logo.svg" alt="Star Brand Studio" />
        </a>
        <button
          type="button"
          className="custom-button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="ring ring--outer" cx="12" cy="12" r="11" />
            <circle className="ring ring--middle" cx="12" cy="12" r="7" />
            <circle className="ring ring--inner" cx="12" cy="12" r="3" />
          </svg>
          <span>{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      <nav
        id="site-menu"
        className="site-menu"
        aria-hidden={!menuOpen}
        aria-label="Main"
      >
        <ul className="site-menu__list">
          {NAV_LINKS.map((link) => (
            <li className="site-menu__item" key={link.href}>
              <a
                href={link.href}
                className="site-menu__link h2"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
