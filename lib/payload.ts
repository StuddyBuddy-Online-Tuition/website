import 'server-only'

import { cache } from 'react'
import { getPayload, type Payload } from 'payload'
import configPromise from '../payload.config'

export const getPayloadClient = cache(async (): Promise<Payload> => {
  const payload = await getPayload({
    config: configPromise,
  })

  return payload
})

