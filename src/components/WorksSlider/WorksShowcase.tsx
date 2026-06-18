'use client'

import { useState } from 'react'
import WorksSlider, { type WorksSlide } from './WorksSlider'

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
  const [active, setActive] = useState(0)
  const current = SLIDES[active] ?? SLIDES[0]

  return (
    <section className="works-page grain-effect">
      <p className="body dark works-showcase__title">{current.title}</p>
      <WorksSlider slides={SLIDES} onActiveChange={setActive} />
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
