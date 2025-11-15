// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, SharpDependency } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Hero } from './globals/Hero'
import { About } from './globals/About'
import { WhyUs } from './globals/WhyUs'
import { Teachers } from './globals/Teachers'
import { Subjects } from './globals/Subjects'
import { Contact } from './globals/Contact'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  globals: [Hero, About, WhyUs, Teachers, Subjects, Contact],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp: sharp as SharpDependency,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.VERCEL_BLOB_STORAGE_TOKEN || '',
    }),
  ],
})
