'use client'

import { useEffect, useRef } from 'react'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)

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

  return (
    <header ref={headerRef} className="site-header grain-effect">
      <div className="wrapper">
        <a href="/" className="site-header__logo" aria-label="Star Brand Studio">
          <img src="/Logo.svg" alt="Star Brand Studio" />
        </a>
        <button type="button" className="custom-button">
          <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="ring ring--outer" cx="12" cy="12" r="11" />
            <circle className="ring ring--middle" cx="12" cy="12" r="7" />
            <circle className="ring ring--inner" cx="12" cy="12" r="3" />
          </svg>
          <span>menu</span>
        </button>
      </div>

    </header>
  )
}
