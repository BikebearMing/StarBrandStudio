import type { CollectionConfig } from 'payload'

/**
 * Awards — each award win is its own document (think WordPress custom post type),
 * editable on its own and reorderable by drag in the admin list view
 * (`orderable: true` stores order in a `_order` field; sort by it everywhere).
 *
 * The /awards route fetches these (sorted by `_order`) and groups them by `year`
 * into the hover list. <AwardsPage> keeps hardcoded DEFAULT_GROUPS as a fallback,
 * so the page still renders fully even with an empty/unavailable CMS. The page
 * heading/eyebrow stay on the small `awardsPage` global (page chrome, kept
 * separate from the awards list itself).
 */
export const Awards: CollectionConfig = {
  slug: 'awards',
  orderable: true,
  admin: {
    useAsTitle: 'award',
    defaultColumns: ['award', 'year', 'campaign', 'updatedAt'],
    description: 'Awards shown on /awards. Drag rows to reorder; the page groups them by year.',
  },
  defaultSort: '_order',
  access: { read: () => true },
  fields: [
    {
      name: 'award',
      type: 'text',
      required: true,
      admin: { description: 'Award won, e.g. “DIGITAL PUBLISHER OF THE YEAR – SILVER”.' },
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. “2025”. Awards are grouped under this year on the page.',
        position: 'sidebar',
      },
    },
    {
      name: 'campaign',
      type: 'text',
      admin: { description: 'Campaign / project the award was for.' },
    },
    {
      name: 'awardImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Trophy / award photo. Shown on the left when this row is hovered.' },
    },
    {
      name: 'groupPhoto',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Group / team photo. Shown below the trophy when this row is hovered.' },
    },
  ],
}
