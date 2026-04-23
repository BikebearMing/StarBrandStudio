'use client'

import { useEffect, useRef } from 'react'

const LOGOS = [
  '127-days-urban-eats-icon.png',
  'bliss-kitchen-icon.png',
  'mays-dumplings-icon.png',
  'morphett-vale-icon.png',
  'mr-whippy-icon.png',
  'sanshi-patisserie-icon.png',
  'sato-icon.png',
  'scottz-cafe-icon.png',
  'the-espy-bakehouse-icon.png',
  'warung-suka-icon.png',
]

const SPEED = 0.5

export default function LogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    let position = 0
    let rafId = 0

    const originalItems = Array.from(track.children) as HTMLElement[]

    const fillTrack = () => {
      const containerWidth = container.offsetWidth

      let totalWidth = 0
      originalItems.forEach((item) => {
        totalWidth += item.getBoundingClientRect().width
      })

      const gap = parseFloat(getComputedStyle(track).gap) || 0
      totalWidth += gap * (originalItems.length - 1)

      if (totalWidth === 0) return

      const repeatCount = Math.ceil((containerWidth * 2) / totalWidth)

      for (let i = 0; i < repeatCount; i++) {
        originalItems.forEach((item) => {
          track.appendChild(item.cloneNode(true))
        })
      }
    }

    const animate = () => {
      position -= SPEED
      track.style.transform = `translateX(${position}px)`

      const firstItem = track.children[0] as HTMLElement | undefined
      if (firstItem) {
        const itemWidth = firstItem.getBoundingClientRect().width
        const gap = parseFloat(getComputedStyle(track).gap) || 0
        const totalWidth = itemWidth + gap

        if (Math.abs(position) >= totalWidth) {
          track.appendChild(firstItem)
          position += totalWidth
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    fillTrack()
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      while (track.children.length > originalItems.length) {
        track.removeChild(track.lastChild as Node)
      }
      track.style.transform = ''
    }
  }, [])

  return (
    <section className="logo-carousel">
      <div className="logo-carousel-wrapper">
        <div className="carousel-header">
          <h2 className="logo-carousel__h4">
            Reaching Over 18.1 million Malaysians across diverse segments
          </h2>
        </div>

        <div className="carousel-container" ref={containerRef}>
          <div className="carousel-track" ref={trackRef}>
            {LOGOS.map((file) => (
              <div className="carousel-item" key={file}>
                <img src={`/logos/${file}`} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
