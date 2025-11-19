import 'server-only'

import { cache } from 'react'
import type { Timetable, TimetableSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getTimetableContent = cache(async (): Promise<Timetable> => {
  const payload = await getPayloadClient()

  const timetable = await payload.findGlobal<'timetable', TimetableSelect<false>>({
    slug: 'timetable',
    depth: 1,
  })

  return timetable
})

