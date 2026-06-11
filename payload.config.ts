import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'
import { Footer } from './src/globals/Footer'
import { AwardsPage } from './src/globals/AwardsPage'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages],
  globals: [Footer, AwardsPage],
  editor: lexicalEditor(),
  // Required by Payload for image resizing (Media imageSizes) and admin thumbnails.
  sharp,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'star-brand-studio-local-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    // Adds `forms` + `form-submissions` collections to the admin.
    // Build a form in the admin, then render it / POST submissions from the site.
    formBuilderPlugin({
      fields: {
        payment: false,
      },
    }),
    // Only activates when BLOB_READ_WRITE_TOKEN is set (i.e. on Vercel).
    // Locally the token is absent, so Media falls back to disk (./media).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
