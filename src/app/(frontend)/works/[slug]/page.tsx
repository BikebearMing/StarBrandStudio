import { Fragment } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@payload-types'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ImpactCTA from '@/components/ImpactCTA/ImpactCTA'
import ContactForm, { type ContactField } from '@/components/ContactForm/ContactForm'

// Content comes from Payload at request time, so it's always fresh.
export const dynamic = 'force-dynamic'

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

async function getWorkData(slug: string) {
  try {
    const payload = await getPayload({ config })
    const [works, forms] = await Promise.all([
      payload.find({
        collection: 'works',
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
      }),
      payload.find({
        collection: 'forms',
        where: { title: { equals: 'Contact' } },
        depth: 0,
        limit: 1,
      }),
    ])
    return { work: works.docs[0], contactForm: forms.docs[0] }
  } catch {
    // If Payload/DB is unavailable there's nothing to show for this work.
    return { work: undefined, contactForm: undefined }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { work } = await getWorkData(slug)
  const title = work?.title ?? 'Works'
  return {
    title: `${title} — Star Brand Studio`,
    description: work?.description ?? 'Selected works from Star Brand Studio.',
  }
}

export default async function WorkDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { work: slide, contactForm } = await getWorkData(slug)

  if (!slide) notFound()

  const image = mediaUrl(slide.image)
  const tags = slide.tags?.map((t) => t.label).filter((l): l is string => Boolean(l)) ?? []

  // Form Builder stores fields as a flat block array; map to the shape ContactForm needs.
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

  return (
    <main>
      <Header />
      <section className="work-detail grain-effect">
        <nav className="body breadcrumb work-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link> / <Link href="/works">WORKS</Link> /{' '}
          <span>{slide.title ?? 'PROJECT'}</span>
        </nav>

        <div className="work-detail__head">
          {slide.title && <h1 className="h1-v2 dark work-detail__title">{slide.title}</h1>}
          <div className="work-detail__meta">
            {slide.year && <p className="body dark work-detail__year">{slide.year}</p>}
            {tags.length > 0 && (
              <div className="work-detail__tags">
                {tags.map((tag) => (
                  <p className="body dark work-detail__tag" key={tag}>
                    {tag}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {image && (
          <div className="work-detail__media">
            <img className="work-detail__img" src={image} alt={slide.title ?? ''} />
          </div>
        )}

        {/* Inner-page content blocks render in the editor-defined (draggable) order. */}
        {slide.content?.map((block, i) => {
          switch (block.blockType) {
            case 'textSection': {
              if (!block.body) return null
              const isColumns = /big idea/i.test(block.heading ?? '')
              return (
                <div className="work-detail__section" key={block.id ?? i}>
                  {block.heading && (
                    <p className="body work-detail__section-heading">{block.heading}</p>
                  )}
                  <p
                    className={`body work-detail__section-body${
                      isColumns ? ' work-detail__section-body--columns' : ''
                    }`}
                  >
                    {/* Render newlines from the textarea as real <br> — SplitText
                        (MaskUpHeadings) keeps them as line breaks; plain "\n" gets
                        torn out when the paragraph is re-split into animated lines. */}
                    {block.body.split('\n').map((line, j, arr) => (
                      <Fragment key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                      </Fragment>
                    ))}
                  </p>
                </div>
              )
            }
            case 'twoImages': {
              const left = mediaUrl(block.left)
              const right = mediaUrl(block.right)
              if (!left && !right) return null
              return (
                <div className="work-detail__grid" key={block.id ?? i}>
                  {left && <img className="work-detail__grid-img" src={left} alt={slide.title ?? ''} />}
                  {right && <img className="work-detail__grid-img" src={right} alt={slide.title ?? ''} />}
                </div>
              )
            }
            case 'oneImage': {
              const src = mediaUrl(block.image)
              if (!src) return null
              return (
                <div className="work-detail__media work-detail__footer-media" key={block.id ?? i}>
                  <img className="work-detail__img" src={src} alt={slide.title ?? ''} />
                </div>
              )
            }
            default:
              return null
          }
        })}
      </section>

      <ImpactCTA />
      <section className="contact-section grain-effect" id="contact">
        <div className="contact-section__inner">
          <ContactForm
            formId={contactForm?.id}
            fields={contactFields}
            submitLabel={contactForm?.submitButtonLabel ?? undefined}
            confirmationMessage={lexicalToText(contactForm?.confirmationMessage)}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
