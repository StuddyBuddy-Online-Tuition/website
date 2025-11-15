import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'Personalized tutoring that helps students excel in their studies while having a great time learning.',
    },
    {
      name: 'metrics',
      type: 'group',
      fields: [
        {
          name: 'parents',
          label: 'Parents Reached',
          type: 'number',
          required: true,
          defaultValue: 1000,
        },
        {
          name: 'students',
          label: 'Students Helped',
          type: 'number',
          required: true,
          defaultValue: 5000,
        },
        {
          name: 'subjects',
          label: 'Subjects Covered',
          type: 'number',
          required: true,
          defaultValue: 25,
        },
        {
          name: 'tutors',
          label: 'Qualified Tutors',
          type: 'number',
          required: true,
          defaultValue: 50,
        },
      ],
    },
    {
      name: 'carousel',
      label: 'Hero Carousel',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      defaultValue: [
        { image: undefined, alt: 'Tutor session 1' },
        { image: undefined, alt: 'Tutor session 2' },
        { image: undefined, alt: 'Tutor session 3' },
      ],
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
          required: false,
        },
      ],
    },
  ],
}

