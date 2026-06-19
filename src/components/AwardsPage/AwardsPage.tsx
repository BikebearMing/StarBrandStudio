'use client'

import { useState } from 'react'
import Link from 'next/link'

export type AwardEntry = {
  award: string
  campaign?: string
  awardImage?: string
  groupPhoto?: string
}

export type AwardYear = {
  year: string
  entries: AwardEntry[]
}

type Props = {
  eyebrow?: string
  heading?: string
  recognitions?: string
  years?: AwardYear[]
}

// Mirrors the seeded Awards Page so the route always renders, even with no DB.
const DEFAULT_GROUPS: AwardYear[] = [
  {
    year: '2026',
    entries: [
      {
        award: 'BEST MARKETING CAMPAIGN FOR A NEWS BRAND – SILVER',
        campaign: 'POWERING THE FUTURE IN PARTNERSHIP WITH TENAGA NASIONAL BERHAD',
      },
    ],
  },
  {
    year: '2025',
    entries: [
      {
        award: 'DIGITAL PUBLISHER OF THE YEAR – SILVER',
        campaign: 'THE STAR ESG: BRIDGING ESG KNOWLEDGE INTO ACTION',
      },
      {
        award: 'GREEN JOURNALISM AWARD',
        campaign: 'THE STAR ESG PUBLICATION',
      },
    ],
  },
  {
    year: '2024',
    entries: [
      {
        award: 'BEST USE OF AI IN REVENUE STRATEGY – SILVER',
        campaign: '#JOMSAPOT BELILOKAL GEN AI-LED INTEGRATED MARKETING CAMPAIGN',
      },
      {
        award: 'BEST B2B MARKETING CAMPAIGN – SILVER',
        campaign: '#JOMSAPOT BELILOKAL GEN AI-LED INTEGRATED MARKETING CAMPAIGN',
      },
      {
        award: 'BEST USE OF DIGITAL MARKETING INNOVATION – SILVER',
        campaign: '#JOMSAPOT BELILOKAL GEN AI-LED INTEGRATED MARKETING CAMPAIGN',
      },
      {
        award: 'BEST DIGITAL CAMPAIGN 2024 – BRONZE',
      },
      {
        award: 'BEST DIGITAL CAMPAIGN 2024 – GOLD',
      },
    ],
  },
  {
    year: '2023',
    entries: [
      {
        award: 'BEST NATIVE ADVERTISING/SPONSORED CONTENT CAMPAIGN GOLD',
        campaign:
          'SIME DARBY PROPERTY – ELMINA RAINFOREST KNOWLEDGE CENTRE (ERKC) SUSTAINABILITY CAMPAIGN',
      },
    ],
  },
]

const DEFAULT_EYEBROW = 'AWARDS'
const DEFAULT_RECOGNITIONS = '& RECOGNITIONS'

export default function AwardsPage({ eyebrow, recognitions, years }: Props) {
  const GROUPS = years?.length ? years : DEFAULT_GROUPS
  // Active hovered row, scoped per group so each year shows its own image.
  const [active, setActive] = useState<{ g: number; r: number } | null>(null)

  const title = eyebrow ?? DEFAULT_EYEBROW

  return (
    <section className="awards-page">
      <div className="awards-page__head">
        <nav className="body breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> / <span>{title}</span>
        </nav>
        {/* Banner mirrors the home "Awards & Recognition" strip, minus the
            button and the "award-winning ideas…" caption. */}
        <div className="awards-page__banner">
          <h1 className="h1 awards-page__title">
            <span className="text-highlight">{title}</span>
          </h1>
          <p className="h1 amplitude amp-mask awards-page__rec">
            {recognitions ?? DEFAULT_RECOGNITIONS}
          </p>
        </div>
        <p className="body awards-page__caption">
          Award-winning ideas, grounded in the craft of storytelling.
        </p>
      </div>

      <div className="awards-page__list">
        {GROUPS.map((group, g) => {
          const activeEntry = active?.g === g ? group.entries[active.r] : undefined
          return (
            <div className="awards-page__group" key={`${group.year}-${g}`}>
              <p className="body">{group.year}</p>

              <div className="awards-page__media" aria-hidden="true">
                {activeEntry?.groupPhoto && (
                  <img className="awards-page__media-img" src={activeEntry.groupPhoto} alt="" />
                )}
              </div>

              <ul className="awards-page__rows">
                {group.entries.map((entry, r) => (
                  <li
                    key={r}
                    className={`awards-page__row${
                      active?.g === g && active?.r === r ? ' is-active' : ''
                    }`}
                    onMouseEnter={() => setActive({ g, r })}
                    onMouseLeave={() => setActive(null)}
                  >
                    <p className="body awards-page__award">{entry.award}</p>
                    <p className="body awards-page__campaign">{entry.campaign}</p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
