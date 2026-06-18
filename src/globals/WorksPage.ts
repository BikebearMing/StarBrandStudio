import type { GlobalConfig } from 'payload'

/**
 * Works page content (route: /works). A singleton global holding the slides for
 * the vertical, scroll-reactive slider. Each slide is currently just an image.
 *
 * The <WorksSlider> component keeps hardcoded fallbacks, so the page still
 * renders even with an empty/unavailable CMS.
 */
export const WorksPage: GlobalConfig = {
  slug: 'worksPage',
  label: 'Works Page',
  access: { read: () => true },
  fields: [
    {
      name: 'slides',
      type: 'array',
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: { description: 'Slides for the vertical works slider, in order.' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Slide image (517 × 260).' },
        },
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Campaign title (shown above and beside the slider).' },
        },
        {
          name: 'year',
          type: 'text',
          admin: { description: 'Campaign year, e.g. 2025.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Short campaign description.' },
        },
        {
          name: 'tags',
          type: 'array',
          labels: { singular: 'Tag', plural: 'Tags' },
          admin: { description: 'Category tags, e.g. FASHION.' },
          fields: [{ name: 'label', type: 'text', required: true }],
        },
      ],
    },
  ],
}
