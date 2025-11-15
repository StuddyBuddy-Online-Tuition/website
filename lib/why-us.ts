import 'server-only'

import { cache } from 'react'
import type { WhyUs, WhyUsSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getWhyUsContent = cache(async (): Promise<WhyUs> => {
  const payload = await getPayloadClient()

  const whyUs = await payload.findGlobal<'why-us', WhyUsSelect<false>>({
    slug: 'why-us',
    depth: 1,
  })

  return whyUs
})

