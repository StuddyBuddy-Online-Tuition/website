import 'server-only'

import { cache } from 'react'
import type { Teacher, TeachersSelect } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getTeachersContent = cache(async (): Promise<Teacher> => {
  const payload = await getPayloadClient()

  const teachers = await payload.findGlobal<'teachers', TeachersSelect<false>>({
    slug: 'teachers',
    depth: 1,
  })

  return teachers
})

