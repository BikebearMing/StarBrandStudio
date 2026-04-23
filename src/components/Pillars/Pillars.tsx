'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const PILLARS = [
  {
    label: 'CREDIBILITY',
    copy: 'We bring editorial authority to your brand, built on decades of trusted journalism. Our newsroom experience shapes how we research, question, and craft stories with clarity and integrity.',
  },
  {
    label: 'TRUSTED IMPACT',
    copy: 'We measure success by resonance. Every campaign is designed to move audiences, shift perception and deliver outcomes clients can point to with confidence.',
  },
  {
    label: 'AUDIENCE-CENTRIC',
    copy: 'We start with people, not platforms. Deep audience insight informs every creative decision, ensuring the work lands where it matters most.',
  },
  {
    label: 'CREATIVITY',
    copy: 'We craft ideas that feel inevitable in hindsight — distinct, culturally aware and strategically sharp, built to earn attention rather than demand it.',
  },
]

const DURATION = 0.7
const STAGGER = 0.06
const EASE = 'power3.out'

export default function Pillars() {
  const listRef = useRef<HTMLUListElement>(null)
  const innersRef = useRef<HTMLElement[][]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const copies = Array.from(list.querySelectorAll<HTMLElement>('.pillar__copy-inner'))
    const splits = copies.map((el) => new SplitText(el, { type: 'lines', linesClass: 'line' }))

    const groups: HTMLElement[][] = splits.map((split) =>
      split.lines.map((line) => {
        const inner = document.createElement('span')
        inner.className = 'line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
        return inner
      })
    )
    innersRef.current = groups

    groups.forEach((inners, i) => {
      gsap.set(inners, { yPercent: i === 0 ? 0 : 110 })
    })

    return () => {
      splits.forEach((s) => s.revert())
    }
  }, [])

  useEffect(() => {
    innersRef.current.forEach((inners, i) => {
      gsap.to(inners, {
        yPercent: i === active ? 0 : 110,
        duration: DURATION,
        stagger: STAGGER,
        ease: EASE,
        overwrite: 'auto',
      })
    })
  }, [active])

  return (
    <ul className="pillars" ref={listRef} onMouseLeave={() => setActive(0)}>
      {PILLARS.map((p, i) => (
        <li
          key={p.label}
          className={`pillar${i === active ? ' is-active' : ''}`}
          onMouseEnter={() => setActive(i)}
        >
          <span className="h1 pillar__label">{p.label}</span>
          <span className="pillar__line" aria-hidden="true"></span>
          <p className="subhead pillar__copy">
            <span className="pillar__copy-inner">{p.copy}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}
