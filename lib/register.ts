import 'server-only'

import { cache } from 'react'
import type { Register, RegisterSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getRegisterContent = cache(async (): Promise<Register> => {
  const payload = await getPayloadClient()

  const register = await payload.findGlobal<'register', RegisterSelect<false>>({
    slug: 'register',
    depth: 1,
  })

  return register
})

