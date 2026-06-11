import type { GlobalConfig } from 'payload'

/**
 * Awards page content (route: /awards). A singleton global of year groups, each
 * holding a list of award entries. Every entry can carry an image that fades in
 * (in a fixed spot on the left) when its row is hovered.
 *
 * The <AwardsPage> component keeps hardcoded DEFAULT_GROUPS as a fallback, so the
 * page still renders fully even with an empty/unavailable CMS.
 */
export const AwardsPage: GlobalConfig = {
  slug: 'awardsPage',
  label: 'Awards Page',
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'AWARDS' },
    {
      name: 'heading',
      type: 'textarea',
      defaultValue: 'AWARD-WINNING IDEAS\nGROUNDED IN GOOD STORYTELLING',
      admin: { description: 'Page heading. Use line breaks for stacked lines.' },
    },
    {
      name: 'years',
      type: 'array',
      labels: { singular: 'Year Group', plural: 'Year Groups' },
      admin: { description: 'One group per year, newest first.' },
      fields: [
        { name: 'year', type: 'text', required: true, admin: { description: 'e.g. "2025"' } },
        {
          name: 'entries',
          type: 'array',
          labels: { singular: 'Award', plural: 'Awards' },
          fields: [
            {
              name: 'organization',
              type: 'text',
              required: true,
              admin: { description: 'Award body, e.g. "MDA D-AWARDS 2025".' },
            },
            {
              name: 'award',
              type: 'text',
              required: true,
              admin: { description: 'Award won, e.g. "DIGITAL PUBLISHER OF THE YEAR – SILVER".' },
            },
            {
              name: 'campaign',
              type: 'text',
              admin: { description: 'Campaign / project the award was for.' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Shown on the left when this row is hovered.' },
            },
          ],
        },
      ],
    },
  ],
}
