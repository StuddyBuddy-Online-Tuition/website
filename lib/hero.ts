import 'server-only'

import { cache } from 'react'
import type { Hero, HeroSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getHeroContent = cache(async (): Promise<Hero> => {
  const payload = await getPayloadClient()

  const hero = await payload.findGlobal<'hero', HeroSelect<false>>({
    slug: 'hero',
    depth: 1,
  })

  return hero
})

