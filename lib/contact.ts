import 'server-only'

import { cache } from 'react'
import type { Contact, ContactSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getContactContent = cache(async (): Promise<Contact> => {
  const payload = await getPayloadClient()

  const contact = await payload.findGlobal<'contact', ContactSelect<false>>({
    slug: 'contact',
    depth: 1,
  })

  return contact
})


