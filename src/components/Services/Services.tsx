'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const SERVICES = [
  {
    title: 'INTEGRATED MARKETING & CREATIVE STRATEGY',
    copy: 'We develop integrated marketing strategies grounded in insight, aligning brand objectives with compelling creative ideas. By connecting strategy, storytelling, and media across platforms, we create campaigns that reach the right audiences and deliver meaningful impact.',
  },
  {
    title: 'EDITORIAL STORYTELLING',
    copy: 'We craft narratives with the discipline of journalism and the impact of great creative. Every story is researched, structured and written to earn attention from readers who have none to spare.',
  },
  {
    title: 'VIDEO & MULTIMEDIA PRODUCTION',
    copy: 'From short-form social cuts to long-form documentary, we produce video content that respects the audience\u2019s time while landing the brand message with clarity and craft.',
  },
  {
    title: 'YOUTH & SOCIAL IMPACT PROGRAMME',
    copy: 'We design programmes that engage young audiences around causes that matter. Authentic partnerships built on genuine participation, not performative marketing.',
  },
  {
    title: 'RESEARCH & INSIGHTS',
    copy: 'Quantitative rigour meets qualitative depth. We uncover the audience truths that shape sharper strategy and more resonant creative work.',
  },
  {
    title: 'SOCIAL MEDIA & INFLUENCER ENGAGEMENT',
    copy: 'We manage always-on presence and hand-picked creator partnerships as a single integrated system \u2014 brand voice, community, and earned attention in lockstep.',
  },
  {
    title: 'DIGITAL EXPERIENCES',
    copy: 'Websites, apps, interactive campaigns. We design and build digital products that carry the same narrative discipline as editorial work.',
  },
  {
    title: 'MEDIA STRATEGY & BUYING',
    copy: 'Data-led planning across paid, owned and earned \u2014 designed to put the right message in front of the right people at the moment it matters.',
  },
]

const REVEAL_DURATION = 0.6
const REVEAL_DELAY = 0.55
const REVEAL_STAGGER = 0.06

export default function Services() {
  const listRef = useRef<HTMLUListElement>(null)
  const innersRef = useRef<HTMLElement[][]>([])
  const [active, setActive] = useState<number | null>(null)
  const prevActiveRef = useRef<number | null>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const copies = Array.from(list.querySelectorAll<HTMLElement>('.service__copy-inner'))
    const splits = copies.map((el) => new SplitText(el, { type: 'lines', linesClass: 'line' }))

    innersRef.current = splits.map((split) =>
      split.lines.map((line) => {
        const inner = document.createElement('span')
        inner.className = 'line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
        return inner
      })
    )

    innersRef.current.forEach((inners) => gsap.set(inners, { yPercent: 110 }))

    return () => splits.forEach((s) => s.revert())
  }, [])

  useEffect(() => {
    const prev = prevActiveRef.current
    if (prev !== null && prev !== active) {
      const prevInners = innersRef.current[prev]
      if (prevInners) {
        gsap.to(prevInners, {
          yPercent: 110,
          duration: 0.25,
          ease: 'power2.in',
          overwrite: 'auto',
        })
      }
    }
    if (active !== null) {
      const inners = innersRef.current[active]
      if (inners) {
        gsap.fromTo(
          inners,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: REVEAL_DURATION,
            stagger: REVEAL_STAGGER,
            ease: 'power3.out',
            delay: REVEAL_DELAY,
            overwrite: 'auto',
          }
        )
      }
    }
    prevActiveRef.current = active
  }, [active])

  const toggle = (i: number) => setActive((prev) => (prev === i ? null : i))

  return (
    <>
      <div className="services-heading">
        <h2 className="h1 dark services-heading__title">
          <span>FULL-FLEDGE </span>
          <span className="text-highlight">SERVICES</span>
        </h2>
        <button type="button" className="custom-button">
          <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="ring ring--outer" cx="12" cy="12" r="11" />
            <circle className="ring ring--middle" cx="12" cy="12" r="7" />
            <circle className="ring ring--inner" cx="12" cy="12" r="3" />
          </svg>
          <span>OUR SERVICES</span>
        </button>
      </div>

      <ul className="services-list" ref={listRef}>
        {SERVICES.map((s, i) => {
          const isOpen = active === i
          const indexLabel = String(i + 1).padStart(2, '0')
          return (
            <li key={s.title} className={`service${isOpen ? ' is-open' : ''}`}>
              <button className="service__row" type="button" onClick={() => toggle(i)} aria-expanded={isOpen}>
                <span className="service__index">{indexLabel}</span>
                <h3 className="service__title">{s.title}</h3>
                <div className="service__copy-slot">
                  <div className="service__copy-content">
                    <p className="subhead service__copy">
                      <span className="service__copy-inner">{s.copy}</span>
                    </p>
                  </div>
                </div>
                <span className="service__toggle" aria-hidden="true">
                  <svg className="service__toggle-icon service__toggle-icon--plus" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                  <svg className="service__toggle-icon service__toggle-icon--arrow" viewBox="0 0 24 24">
                    <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    <path d="M9 7H17V15" stroke="currentColor" strokeWidth="2" strokeLinecap="square" fill="none" />
                  </svg>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
