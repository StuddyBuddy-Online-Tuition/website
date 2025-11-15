import 'server-only'

import { cache } from 'react'
import type { Footer, FooterSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getFooterContent = cache(async (): Promise<Footer> => {
  const payload = await getPayloadClient()

  const footer = await payload.findGlobal<'footer', FooterSelect<false>>({
    slug: 'footer',
    depth: 1,
  })

  return footer
})


