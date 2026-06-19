'use client'

import { useRef, useState } from 'react'
import WorksSlider, { type WorksSlide } from './WorksSlider'
import TargetCursor from '@/components/TargetCursor/TargetCursor'

type Props = {
  slides?: WorksSlide[]
}

// Fallback so the page still renders with an empty/unavailable CMS.
const DEFAULT_SLIDES: WorksSlide[] = [
  {
    image: '/media/placeholder.png',
    title: 'GUCCI WALK YOUR WAY',
    year: '2025',
    description:
      'AN INTEGRATED BRAND CAMPAIGN DESIGNED TO SPARK AWARENESS, TURN AUDIENCES INTO ADVOCATES ACROSS DIGITAL TOUCHPOINTS.',
    tags: ['FASHION', 'VIDEO PRODUCTION & MEDIA'],
  },
]

export default function WorksShowcase({ slides }: Props) {
  const SLIDES = slides?.length ? slides : DEFAULT_SLIDES
  // The slider moves; this index keeps the surrounding text in sync without moving it.
  // On mobile (no auto-scroll, no hover) the centered slide drives the text.
  const [active, setActive] = useState(0)
  // Desktop only: which slide the pointer is over. While hovering, the slider
  // auto-scroll pauses and only this slide's details are shown; otherwise hidden.
  const [hovered, setHovered] = useState<number | null>(null)
  const current = SLIDES[hovered ?? active] ?? SLIDES[0]

  // The custom target cursor only renders while the pointer is over the section, so it
  // never lingers over the rest of the page. `cursorStart` seeds its initial position
  // so it appears under the pointer instead of animating in from the origin.
  const [cursorActive, setCursorActive] = useState(false)
  const cursorStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  return (
    <section
      className={`works-page grain-effect${hovered !== null ? ' is-revealing' : ''}`}
      onMouseEnter={(e) => {
        cursorStartRef.current = { x: e.clientX, y: e.clientY }
        setCursorActive(true)
      }}
      onMouseLeave={() => setCursorActive(false)}
    >
      {cursorActive && (
        <TargetCursor
          spinDuration={5}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.1}
          initialX={cursorStartRef.current.x}
          initialY={cursorStartRef.current.y}
        />
      )}
      <p className="body dark works-showcase__title">{current.title}</p>
      <WorksSlider slides={SLIDES} onActiveChange={setActive} onHoverChange={setHovered} />
      <div className="works-showcase__detail">
        <p className="bodys dark works-showcase__year">{current.year}</p>
        <div className="works-showcase__detail-body">
          <div className="works-showcase__detail-text">
            <h4 className="dark works-showcase__campaign">{current.title}</h4>
            <p className="body dark works-showcase__description">{current.description}</p>
          </div>
          <div className="works-showcase__tags">
            {current.tags?.map((tag) => (
              <p className="body dark works-showcase__tag" key={tag}>
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
