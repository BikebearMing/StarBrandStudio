'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { PRELOADER_DONE_EVENT } from '@/components/Preloader/Preloader'

gsap.registerPlugin(SplitText)

const SELECTOR = [
  '.amp-mask',
  '.body:not(.pillar__copy):not(.service__copy):not(.service__index):not(.cylinder-hover-label__brand):not(.cylinder-hover-label__copy)',
].join(', ')
const DURATION = 0.9
const STAGGER = 0.08
const EASE = 'power3.out'

export default function MaskUpHeadings() {
  useEffect(() => {
    const splits: SplitText[] = []
    let observer: IntersectionObserver | null = null
    let cancelled = false

    const init = () => {
      if (cancelled) return
      const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
      const elLines = new WeakMap<Element, Element[]>()

      elements.forEach((el) => {
        const split = new SplitText(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'amp-mask-line',
        })
        splits.push(split)
        gsap.set(split.lines, { yPercent: 110 })
        elLines.set(el, split.lines as Element[])
      })

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const lines = elLines.get(entry.target)
            if (lines) {
              gsap.to(lines, {
                yPercent: 0,
                duration: DURATION,
                stagger: STAGGER,
                ease: EASE,
              })
            }
            observer?.unobserve(entry.target)
          })
        },
        { threshold: 0.15 }
      )

      elements.forEach((el) => observer!.observe(el))
    }

    window.addEventListener(PRELOADER_DONE_EVENT, init, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener(PRELOADER_DONE_EVENT, init)
      observer?.disconnect()
      splits.forEach((s) => s.revert())
    }
  }, [])

  return null
}
