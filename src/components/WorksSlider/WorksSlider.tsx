'use client'

import { useEffect, useRef } from 'react'
import Splide from '@splidejs/splide'
import '@splidejs/splide/css/core'

export type WorksSlide = {
  image: string
  alt?: string
  title?: string
  description?: string
  tags?: string[]
  year?: string
  /** URL of this work's inner page. */
  href?: string
}

type Props = {
  slides?: WorksSlide[]
  /** Called with the active slide's (real) index whenever the slider moves. */
  onActiveChange?: (index: number) => void
}

// Fallback so the page still renders a slider with an empty/unavailable CMS.
const DEFAULT_SLIDES: WorksSlide[] = [
  { image: '/media/placeholder.png' },
  { image: '/media/placeholder.png' },
  { image: '/media/placeholder.png' },
]

export default function WorksSlider({ slides, onActiveChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const SLIDES = slides?.length ? slides : DEFAULT_SLIDES

  // Keep the latest callback in a ref so it can change without re-mounting Splide.
  const onActiveChangeRef = useRef(onActiveChange)
  onActiveChangeRef.current = onActiveChange

  useEffect(() => {
    if (!ref.current) return

    const splide = new Splide(ref.current, {
      type: 'loop', // infinite loop
      direction: 'ttb',
      width: '100%',
      heightRatio: .5,
      gap: '2.2vw',
      perPage: 1,
      focus: 'center',
      arrows: false,
      pagination: false,
      drag: true,
    })

    // `moved` reports the active index already normalised to a real slide
    // (loop clones excluded), so the text panels can mirror it directly.
    splide.on('moved', (index) => onActiveChangeRef.current?.(index))
    splide.on('mounted', () => {
      onActiveChangeRef.current?.(splide.index)

      // Clicking a slide scrolls it into focus, using the slide's position within
      // the <ul> rather than Splide's own index. The list is laid out as
      // [head clones][real slides][tail clones] with equal clone counts on each
      // side, so the real index is `domIndex - leadingClones`. `go()` wraps that
      // back onto a real slide (it applies `(n + count) % count` in loop mode).
      const list = splide.Components.Elements.list
      const items = Array.from(list.children)
      const leadingClones = (items.length - SLIDES.length) / 2
      items.forEach((item, domIndex) => {
        item.addEventListener('click', () => splide.go(domIndex - leadingClones))
      })
    })

    splide.mount()
    return () => {
      splide.destroy()
    }
  }, [SLIDES.length])

  return (
    <div className="splide works-slider" ref={ref}>
      <div className="splide__track">
        <ul className="splide__list">
          {SLIDES.map((slide, i) => (
            <li className="splide__slide works-slider__slide cursor-target" key={i}>
              <img className="works-slider__img" src={slide.image} alt={slide.alt ?? ''} />
              <a
                className="custom-button works-slider__link"
                href={slide.href ?? '#'}
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                  <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                  <circle className="ring ring--inner" cx="12" cy="12" r="3" />
                </svg>
                <span>VIEW PROJECT</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
