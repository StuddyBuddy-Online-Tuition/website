import 'server-only'

import { cache } from 'react'
import type { Subjects, SubjectsSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getSubjectsContent = cache(async (): Promise<Subjects> => {
  const payload = await getPayloadClient()

  const subjects = await payload.findGlobal<'subjects', SubjectsSelect<false>>({
    slug: 'subjects',
    depth: 1,
  })

  return subjects
})

