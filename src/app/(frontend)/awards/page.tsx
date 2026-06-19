import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import AwardsPage, { type AwardYear } from '@/components/AwardsPage/AwardsPage'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Awards — Star Brand Studio',
  description: 'Award-winning ideas, grounded in the craft of storytelling.',
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

async function getAwards() {
  try {
    const payload = await getPayload({ config })
    const [awards, awardsPage, footer] = await Promise.all([
      // Awards are their own collection (a custom post type) — sorted by the
      // drag-to-reorder `_order`, then grouped by year below.
      payload.find({ collection: 'awards', sort: '_order', depth: 1, limit: 100 }),
      payload.findGlobal({ slug: 'awardsPage', depth: 1 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    return { awards, awardsPage, footer }
  } catch {
    // If Payload/DB is unavailable, components fall back to their defaults.
    return { awards: undefined, awardsPage: undefined, footer: undefined }
  }
}

export default async function AwardsRoute() {
  const { awards, awardsPage, footer } = await getAwards()

  // Group the flat award documents into year groups, preserving `_order` (the
  // first year seen leads, and so on) so the page reads newest-first as seeded.
  let years: AwardYear[] | undefined
  if (awards?.docs.length) {
    const byYear = new Map<string, AwardYear>()
    const groups: AwardYear[] = []
    for (const doc of awards.docs) {
      let group = byYear.get(doc.year)
      if (!group) {
        group = { year: doc.year, entries: [] }
        byYear.set(doc.year, group)
        groups.push(group)
      }
      group.entries.push({
        award: doc.award,
        campaign: doc.campaign ?? undefined,
        awardImage: mediaUrl(doc.awardImage),
        groupPhoto: mediaUrl(doc.groupPhoto),
      })
    }
    years = groups
  }

  const footerProps = footer
    ? {
        address: footer.address ?? undefined,
        phones: footer.phones?.map((p) => p.number),
        directory: footer.directory?.map((d) => ({ label: d.label, href: d.href })),
        updatesLabel: footer.updatesLabel ?? undefined,
        socials: footer.socials?.map((s) => ({
          label: s.label,
          href: s.href,
          icon: mediaUrl(s.icon),
        })),
        brandLogo: mediaUrl(footer.brandLogo),
        copyright: footer.copyright ?? undefined,
        email: footer.email ?? undefined,
      }
    : {}

  return (
    <main className="grain-effect">
      <Header />
      <AwardsPage
        eyebrow={awardsPage?.eyebrow ?? undefined}
        heading={awardsPage?.heading ?? undefined}
        years={years}
      />
      <Footer {...footerProps} />
    </main>
  )
}
