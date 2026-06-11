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
  description: 'Award-winning ideas grounded in good storytelling.',
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

async function getAwards() {
  try {
    const payload = await getPayload({ config })
    const [awardsPage, footer] = await Promise.all([
      payload.findGlobal({ slug: 'awardsPage', depth: 1 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    return { awardsPage, footer }
  } catch {
    // If Payload/DB is unavailable, components fall back to their defaults.
    return { awardsPage: undefined, footer: undefined }
  }
}

export default async function AwardsRoute() {
  const { awardsPage, footer } = await getAwards()

  const years: AwardYear[] | undefined = awardsPage?.years?.map((y) => ({
    year: y.year,
    entries:
      y.entries?.map((e) => ({
        organization: e.organization,
        award: e.award,
        campaign: e.campaign ?? undefined,
        image: mediaUrl(e.image),
      })) ?? [],
  }))

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
    <main>
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
