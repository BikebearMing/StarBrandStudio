'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Our Story — section 2: "What makes us different".
 * Title (.h2) reveals with a typewriter wipe (clipPath + steps easing, mirroring
 * the Hero) when the section scrolls into view. Below it, four red cards each
 * with a .h3 title and a .body paragraph.
 *
 * Content is hardcoded (DEFAULT_* pattern). Copy was transcribed from the design
 * screenshot — confirm exact wording.
 */

type Card = { title: string; body: string }

// NOTE: transcribed from the screenshot — please confirm exact copy.
const DEFAULT_CARDS: Card[] = [
  {
    title: 'BACKED BY JOURNALISTS AND MEDIA',
    body: 'OUR TEAM INCLUDES EXPERIENCED JOURNALISTS, AND WE WORK ACROSS THE WIDER MEDIA LANDSCAPE — STAR MEDIA GROUP’S OWN ECOSYSTEM AND PARTNERS BEYOND IT. THAT GIVES OUR WORK EDITORIAL CREDIBILITY AND GENUINE REACH: THE ABILITY TO SHAPE A STORY AND PUT IT IN FRONT OF THE RIGHT AUDIENCE, NOT JUST PRODUCE CONTENT AND HOPE IT LANDS.',
  },
  {
    title: 'DATA-CENTRIC BY DEFAULT',
    body: 'EVERY ENGAGEMENT STARTS WITH EVIDENCE, NOT ASSUMPTIONS. WE DRAW ON DATA ANALYTICS — AUDIENCE INSIGHTS, MEDIA DATA, AND RESEARCH — TO READ WHAT’S RESONATING AND HOW PERCEPTIONS ARE SHIFTING, SO DECISIONS ARE GROUNDED IN REAL INTELLIGENCE, NOT GUESSWORK.',
  },
  {
    title: 'SUBJECT-MATTER EXPERTISE',
    body: 'WE GO DEEP ON THE ISSUES DEFINING BUSINESS AND SOCIETY — FROM SUSTAINABILITY AND ESG TO NATION-BUILDING, YOUTH ENGAGEMENT, EDUCATION, INNOVATION, AND ECONOMIC DEVELOPMENT. THIS LETS ORGANISATIONS TAKE A CREDIBLE POSITION IN IMPORTANT DEBATES, RATHER THAN COMMENT FROM THE SIDELINES.',
  },
  {
    title: 'ONE TEAM, END TO END',
    body: 'THE SAME TEAM TAKES A PROJECT FROM INSIGHT TO EXECUTION — RESEARCH, STRATEGY, CONTENT AND VIDEO PRODUCTION, MEDIA AMPLIFICATION, YOUTH & SOCIAL IMPACT PROGRAMMES, AND EXPERIENTIAL ACTIVATION, ALL UNDER ONE STRATEGY. STORYTELLING AND DELIVERY STAY CONNECTED FROM START TO FINISH, WITH ONE ACCOUNTABLE TEAM BEHIND EVERY STAGE.',
  },
]

type OurDifferenceProps = {
  cards?: Card[]
  titlePre?: string
  titleHighlight?: string
}

export default function OurDifference({
  cards,
  titlePre = 'WHAT MAKES US',
  titleHighlight = 'DIFFERENT',
}: OurDifferenceProps = {}) {
  const CARDS = cards?.length ? cards : DEFAULT_CARDS
  const titleRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    // Hidden until the section scrolls into view, then a left-to-right typewriter
    // wipe (steps easing reads as typing).
    gsap.set(title, { clipPath: 'inset(0 100% 0 0)' })
    let tween: gsap.core.Tween | null = null
    let done = false

    const reveal = () => {
      if (done) return
      done = true
      // One step per character → reads as character-by-character typing, like
      // the homepage hero typewriter (clip-path reveal eased with steps()).
      const chars = (title.textContent ?? '').trim().length || 20
      tween = gsap.to(title, {
        clipPath: 'inset(0 0% 0 0)',
        duration: Math.max(0.8, chars * 0.05),
        ease: `steps(${chars})`,
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal()
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(title)

    // Fallback: if it's already on screen at mount, reveal right away (the
    // observer won't always fire for elements already in view under smooth scroll).
    const rect = title.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) reveal()

    return () => {
      observer.disconnect()
      tween?.kill()
    }
  }, [])

  return (
    <section className="our-difference">
      <h2 className="h2 our-difference__title">
        <span className="our-difference__title-inner" ref={titleRef}>
          {titlePre}{' '}
          <span className="our-difference__highlight">{titleHighlight}</span>
        </span>
      </h2>

      <div className="our-difference__cards">
        {CARDS.map((card) => (
          <article className="our-difference__card" key={card.title}>
            <h3 className="h3 our-difference__card-title">{card.title}</h3>
            <p className="body our-difference__card-body">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
