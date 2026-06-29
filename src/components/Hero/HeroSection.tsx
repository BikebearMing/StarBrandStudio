'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { onPreloaderDone } from '@/components/Preloader/Preloader'
import type { CarouselSlide } from './CylinderCarousel'

const CylinderCarousel = dynamic(
  () => import('./CylinderCarousel'),
  { ssr: false }
)

// Text intro timings — start as carousel intro settles (carousel is 3.5s)
const TEXT_DELAY      = 2.4   // when the h1 animation kicks in
const LINE_DURATION   = 0.9
const LINE_STAGGER    = 0.12
const H2_GAP          = 0.3   // extra delay between h1 lines finishing and h2 line starting
const H2_DELAY        = TEXT_DELAY + LINE_DURATION + LINE_STAGGER + H2_GAP
const TYPE_DURATION   = 0.8
const TYPE_DELAY      = H2_DELAY + LINE_DURATION - 0.2 // typewriter after h2 line finishes

// Word loop for the typewriter — cycles after the initial LEAD reveal
const DEFAULT_WORDS   = ['LEAD', 'INSPIRE', 'SELL', 'GROW']
const WORD_HOLD       = 1.5   // seconds each word stays visible before erasing
const WORD_ERASE_DUR  = 0.35
const WORD_REVEAL_DUR = 0.5

export type HeroProps = {
  headingLine1?: string
  headingLine2?: string
  subheading?: string
  words?: string[]
  slides?: CarouselSlide[]
}

export default function HeroSection({
  headingLine1 = 'A FULL SUITE OF',
  headingLine2 = 'SERVICES',
  subheading = 'BUILT FOR BRANDS THAT WANT TO',
  words,
  slides,
}: HeroProps = {}) {
  const WORDS = words?.length ? words : DEFAULT_WORDS
  const sectionRef = useRef<HTMLElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const h1LineInners = Array.from(section.querySelectorAll<HTMLElement>('h1 .line-inner'))
    const h2LineInners = Array.from(section.querySelectorAll<HTMLElement>('h2 .line-inner'))
    const typewriter = section.querySelector<HTMLElement>('.typewriter')

    // Hide everything immediately so it doesn't flash before the preloader hands off
    gsap.set([...h1LineInners, ...h2LineInners], { yPercent: 110 })
    if (typewriter) gsap.set(typewriter, { clipPath: 'inset(0 100% 0 0)' })

    const tweens: gsap.core.Tween[] = []
    const timelines: gsap.core.Timeline[] = []

    const start = (instant: boolean) => {
      // First load: long delays choreographed around the preloader handoff and
      // the 3.5s carousel intro. Client-side navigation: quick stagger instead.
      const textDelay = instant ? 0.15 : TEXT_DELAY
      const h2Delay = instant ? 0.4 : H2_DELAY
      const typeDelay = instant ? 0.7 : TYPE_DELAY

      const h1Tween = gsap.to(h1LineInners, {
        yPercent: 0,
        delay: textDelay,
        duration: LINE_DURATION,
        stagger: LINE_STAGGER,
        ease: 'power3.out',
      })
      tweens.push(h1Tween)

      const h2Tween = gsap.to(h2LineInners, {
        yPercent: 0,
        delay: h2Delay,
        duration: LINE_DURATION,
        ease: 'power3.out',
      })
      tweens.push(h2Tween)

      if (typewriter) {
        const typeTween = gsap.to(typewriter, {
          clipPath: 'inset(0 0% 0 0)',
          delay: typeDelay,
          duration: TYPE_DURATION,
          ease: 'steps(5)',
        })
        tweens.push(typeTween)

        // Word cycle: LEAD → INSPIRE → SELL → GROW → LEAD …
        let idx = 0
        const loopTl = gsap.timeline({
          delay: typeDelay + TYPE_DURATION + WORD_HOLD,
          repeat: -1,
        })
        WORDS.forEach(() => {
          loopTl
            .to(typewriter, {
              clipPath: 'inset(0 100% 0 0)',
              duration: WORD_ERASE_DUR,
              ease: 'steps(4)',
            })
            .call(() => {
              idx = (idx + 1) % WORDS.length
              typewriter.textContent = WORDS[idx]
            })
            .to(typewriter, {
              clipPath: 'inset(0 0% 0 0)',
              duration: WORD_REVEAL_DUR,
              ease: 'steps(5)',
            })
            .to({}, { duration: WORD_HOLD })
        })
        timelines.push(loopTl)
      }
    }

    const unsubscribe = onPreloaderDone(start)

    return () => {
      unsubscribe()
      tweens.forEach((t) => t.kill())
      timelines.forEach((t) => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`hero-parent${isHovering ? ' is-dim' : ''}`}

      style={{
        width: '100%',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      <h1 className="h1 amplitude dark">
        <span className="line"><span className="line-inner">{headingLine1}</span></span>
        <br />
        <span className="line"><span className="line-inner">{headingLine2}</span></span>
      </h1>
      <CylinderCarousel onHoverChange={setIsHovering} slides={slides} />
      <h2 className="h1 amplitude dark">
        {/* The typewriter lives inside the masked line so the word flows with
            the subheading (e.g. "…WANT TO LEAD" wraps together on mobile)
            instead of dropping to its own line beside the inline-block. */}
        <span className="line">
          <span className="line-inner">
            {subheading}&nbsp;
            <span className="black typewriter text-highlight">{WORDS[0]}</span>
          </span>
        </span>
      </h2>
    </section>
  )
}
