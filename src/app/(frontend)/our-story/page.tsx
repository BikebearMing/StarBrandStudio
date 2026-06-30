import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Page } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import StoryHero from '@/components/StoryHero/StoryHero'
import OurStory from '@/components/OurStory/OurStory'
import OurDifference from '@/components/OurDifference/OurDifference'
import ImpactCTA from '@/components/ImpactCTA/ImpactCTA'
import ContactForm, { type ContactField } from '@/components/ContactForm/ContactForm'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Our Story — Star Brand Studio',
  description:
    'The full-service marketing arm of Star Media Group — combining the credibility of journalism, the rigour of data, and the reach of an integrated media group.',
}

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return m && typeof m === 'object' ? m.url ?? undefined : undefined
}

// Pull the first paragraph of plain text out of a Lexical rich-text value.
function lexicalToText(node: unknown): string | undefined {
  if (!node || typeof node !== 'object') return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = (node as any).root
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walk = (n: any): string =>
    typeof n?.text === 'string'
      ? n.text
      : Array.isArray(n?.children)
        ? n.children.map(walk).join('')
        : ''
  const text = root ? walk(root).trim() : ''
  return text || undefined
}

// The CTA + contact form are cloned from the homepage, so they read the same
// Payload sources (home page's impactCTA block, the Contact form, the footer).
async function getData() {
  try {
    const payload = await getPayload({ config })
    const [story, pages, footer, forms] = await Promise.all([
      payload.findGlobal({ slug: 'ourStoryPage', depth: 1 }),
      payload.find({
        collection: 'pages',
        where: { slug: { equals: 'home' } },
        depth: 2,
        limit: 1,
      }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
      payload.find({
        collection: 'forms',
        where: { title: { equals: 'Contact' } },
        depth: 0,
        limit: 1,
      }),
    ])
    return { story, layout: pages.docs[0]?.layout, footer, contactForm: forms.docs[0] }
  } catch {
    // If Payload/DB is unavailable, components fall back to their defaults.
    return { story: undefined, layout: undefined, footer: undefined, contactForm: undefined }
  }
}

export default async function OurStoryRoute() {
  const { story, layout, footer, contactForm } = await getData()

  // Our Story global → component props (each component falls back to its own
  // hardcoded defaults when a value is missing, so the page never breaks).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = story as any
  const heroImage = mediaUrl(s?.hero?.image)
  const marqueeImages: string[] | undefined = s?.intro?.marquee?.flatMap(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (m: any) => {
      const url = mediaUrl(m.image)
      return url ? [url] : []
    },
  )
  const introCopy: [string, string] | undefined =
    s?.intro?.copy1 && s?.intro?.copy2 ? [s.intro.copy1, s.intro.copy2] : undefined
  const cards: { title: string; body: string }[] | undefined = s?.difference?.cards
    ?.filter((c: { title?: string; body?: string }) => c?.title && c?.body)
    .map((c: { title: string; body: string }) => ({ title: c.title, body: c.body }))

  // Form Builder stores fields as a flat block array; map to ContactForm's shape.
  const contactFields = contactForm?.fields?.flatMap((f) => {
    if (!('name' in f) || !f.name) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const af = f as any
    const field: ContactField = {
      name: af.name,
      label: af.label ?? undefined,
      blockType: af.blockType,
      required: Boolean(af.required),
      width: typeof af.width === 'number' ? af.width : undefined,
      options: Array.isArray(af.options)
        ? af.options.map((o: { label: string; value: string }) => ({ label: o.label, value: o.value }))
        : undefined,
    }
    return [field]
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const impactCTA = layout?.find((b) => b.blockType === 'impactCTA') as any
  const impactImages: string[] | undefined = impactCTA?.trailImages?.flatMap(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (t: any) => {
      const url = mediaUrl(t.image)
      return url ? [url] : []
    },
  )

  // Footer mirrors the rest of the site; ensure "Our Story" is in the directory.
  const directory = footer?.directory?.map((d) => ({ label: d.label, href: d.href })) ?? []
  if (!directory.some((d) => d.href === '/our-story')) {
    directory.push({ label: 'OUR STORY', href: '/our-story' })
  }
  const footerProps = footer
    ? {
        address: footer.address ?? undefined,
        phones: footer.phones?.map((p) => p.number),
        directory,
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
    : { directory }

  return (
    <main className="grain-effect">
      <Header />
      <StoryHero
        image={heroImage}
        line1={s?.hero?.line1 ?? undefined}
        line2={s?.hero?.line2 ?? undefined}
        highlight={s?.hero?.highlight ?? undefined}
      />
      <OurStory
        title={s?.intro?.title ?? undefined}
        copy={introCopy}
        images={marqueeImages}
      />
      <OurDifference
        titlePre={s?.difference?.titlePre ?? undefined}
        titleHighlight={s?.difference?.titleHighlight ?? undefined}
        cards={cards}
      />
      <ImpactCTA
        headingTop={impactCTA?.headingTop ?? undefined}
        copy={impactCTA?.copy ?? undefined}
        impactWord={impactCTA?.impactWord ?? undefined}
        images={impactImages}
      />
      <section className="contact-section" id="contact">
        <div className="contact-section__inner">
          <ContactForm
            formId={contactForm?.id}
            fields={contactFields}
            submitLabel={contactForm?.submitButtonLabel ?? undefined}
            confirmationMessage={lexicalToText(contactForm?.confirmationMessage)}
          />
        </div>
      </section>
      <Footer {...footerProps} />
    </main>
  )
}
