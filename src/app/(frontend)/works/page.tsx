import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import WorksShowcase from '@/components/WorksSlider/WorksShowcase'
import { type WorksSlide } from '@/components/WorksSlider/WorksSlider'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Works — Star Brand Studio',
  description: 'Selected works from Star Brand Studio.',
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

async function getWorks() {
  try {
    const payload = await getPayload({ config })
    const worksPage = await payload.findGlobal({ slug: 'worksPage', depth: 1 })
    return { worksPage }
  } catch {
    // If Payload/DB is unavailable, the slider falls back to its defaults.
    return { worksPage: undefined }
  }
}

export default async function WorksRoute() {
  const { worksPage } = await getWorks()

  const slides: WorksSlide[] | undefined = worksPage?.slides
    ?.map((s): WorksSlide | undefined => {
      const image = mediaUrl(s.image)
      if (!image) return undefined
      return {
        image,
        title: s.title ?? undefined,
        year: s.year ?? undefined,
        description: s.description ?? undefined,
        tags: s.tags?.map((t) => t.label).filter((l): l is string => Boolean(l)),
      }
    })
    .filter((s): s is WorksSlide => Boolean(s))

  return (
    <main>
      <Header />
      <nav className="body breadcrumb works-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">HOME</Link> / <span>WORKS</span>
      </nav>
      <div className="works-title">
        <h2 className="h1 amplitude dark">
          The <br />
          <span className="text-highlight">Works</span>
        </h2>
        <p className="body dark">we&rsquo;re proud of</p>
      </div>
      <WorksShowcase slides={slides} />
      <Footer />
    </main>
  )
}
