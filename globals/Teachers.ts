import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const Teachers: GlobalConfig = {
  slug: 'teachers',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidatePath('/')
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
      defaultValue: 'Meet Our Expert Tutors',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue: 'Our team combines subject mastery with engaging teaching styles that inspire confidence.',
    },
    {
      name: 'teachers',
      label: 'Teachers',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          maxLength: 80,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 80,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 1000,
        },
        {
          name: 'subjects',
          label: 'Subjects',
          type: 'array',
          minRows: 1,
          maxRows: 3,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              maxLength: 30,
            },
          ],
        },
        {
          name: 'photo',
          type: 'group',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              required: true,
              maxLength: 100,
              defaultValue: 'Tutor portrait',
            },
          ],
        },
      ],
      defaultValue: [
        {
          name: 'Emily Carter',
          title: 'STEM Specialist',
          description: 'Loves turning science and math into interactive adventures for every age.',
          subjects: [{ label: 'Math' }, { label: 'Physics' }],
        },
      ],
    },
  ],
}

