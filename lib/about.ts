import 'server-only'

import { cache } from 'react'
import type { About, AboutSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getAboutContent = cache(async (): Promise<About> => {
  const payload = await getPayloadClient()

  const about = await payload.findGlobal<'about', AboutSelect<false>>({
    slug: 'about',
    depth: 1,
  })

  return about
})

