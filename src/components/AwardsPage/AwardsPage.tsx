'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'

export type AwardEntry = {
  organization: string
  award: string
  campaign?: string
  image?: string
}

export type AwardYear = {
  year: string
  entries: AwardEntry[]
}

type Props = {
  eyebrow?: string
  heading?: string
  years?: AwardYear[]
}

// Mirrors the seeded Awards Page so the route always renders, even with no DB.
const DEFAULT_GROUPS: AwardYear[] = [
  {
    year: '2025',
    entries: [
      {
        organization: 'MDA D-AWARDS 2025',
        award: 'DIGITAL PUBLISHER OF THE YEAR – SILVER',
        campaign: 'THE STAR ESG: BRIDGING ESG KNOWLEDGE INTO ACTION',
      },
      {
        organization: 'WASTE MANAGEMENT ASSOCIATION OF MALAYSIA (WMAM)',
        award: 'GREEN JOURNALISM AWARD',
        campaign: 'THE STAR ESG PUBLICATION',
      },
    ],
  },
  {
    year: '2024',
    entries: [
      {
        organization: 'WAN-IFRA DIGITAL MEDIA AWARDS ASIA 2024',
        award: 'BEST USE OF AI IN REVENUE STRATEGY – SILVER',
        campaign: '#JOMSAPOT BELILOKAL GEN AI-LED INTEGRATED MARKETING CAMPAIGN',
      },
      {
        organization: 'MDA D-AWARDS 2024',
        award: 'BEST B2B MARKETING CAMPAIGN - SILVER',
        campaign: '#JOMSAPOT BELILOKAL GEN AI- LED INTERGRATED MARKETING CAMPAIGN',
      },
      {
        organization: 'MDA D-AWARDS 2024',
        award: 'BEST USE OF DIGITAL MARKETING INNOVATION - SILVER',
        campaign: '#JOMSAPOT BELILOKAL GEN AI- LED INTEGRATED MARKETING CAMPAIGN',
      },
      {
        organization: 'PMAA DRAGONS OF ASIA 2024',
        award: 'BEST DIGITAL CAMPAIGN 2024 – BRONZE',
        campaign: '#JOMSAPOT BELILOKAL GEN AI-LED INTERGRATED MARKETING CAMPAIGN',
      },
      {
        organization: 'PMAA DRAGONS OF MALAYSIA 2024',
        award: 'BEST DIGITAL CAMPAIGN 2024 - GOLD',
        campaign: '#JOMSAPOT BELILOKAL GEN AI- LED INTERGRATED MARKETING CAMPAIGN',
      },
    ],
  },
  {
    year: '2023',
    entries: [
      {
        organization: 'WAN-IFRA ASIAN DIGITAL MEDIA AWARDS (ADMA) 2023',
        award: 'BEST NATIVE ADVERTISING/SPONSORED CONTENT CAMPAIGN GOLD',
        campaign:
          'SIME DARBY PROPERTY – ELMINA RAINFOREST KNOWLEDGE CETRE (ERKC) SUSTAINABILITY CAMPAIGN',
      },
    ],
  },
]

const DEFAULT_EYEBROW = 'AWARDS'
const DEFAULT_HEADING = 'AWARD-WINNING IDEAS\nGROUNDED IN GOOD STORYTELLING'

export default function AwardsPage({ eyebrow, heading, years }: Props) {
  const GROUPS = years?.length ? years : DEFAULT_GROUPS
  // Active hovered row, scoped per group so each year shows its own image.
  const [active, setActive] = useState<{ g: number; r: number } | null>(null)

  const headingLines = (heading ?? DEFAULT_HEADING).split('\n')

  return (
    <section className="awards-page grain-effect">
      <div className="awards-page__head">
        <nav className="body breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> / <span>{eyebrow ?? DEFAULT_EYEBROW}</span>
        </nav>
        <h1 className="body awards-page__title">
          {headingLines.map((line, i) => (
            <Fragment key={i}>
              {line}
              {i < headingLines.length - 1 && <br />}
            </Fragment>
          ))}
        </h1>
      </div>

      <div className="awards-page__list">
        {GROUPS.map((group, g) => {
          const activeEntry = active?.g === g ? group.entries[active.r] : undefined
          const activeImage = activeEntry?.image
          return (
            <div className="awards-page__group" key={`${group.year}-${g}`}>
              <p className="body">{group.year}</p>

              <div className="awards-page__media" aria-hidden="true">
                {activeImage && (
                  <img className="awards-page__media-img" src={activeImage} alt="" />
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
                    <p className="body awards-page__org">{entry.organization}</p>
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
