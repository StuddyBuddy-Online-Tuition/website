import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
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
      label: 'Section Title',
      type: 'text',
      required: true,
      maxLength: 120,
      defaultValue: 'Who We Are',
    },
    {
      name: 'description',
      label: 'Section Description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue:
        'Study Buddy is a team of passionate educators dedicated to making learning enjoyable and effective for students of all ages.',
    },
    {
      name: 'featureImage',
      label: 'Feature Image',
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
          defaultValue: 'Happy students learning',
        },
      ],
    },
    {
      name: 'missionPoints',
      label: 'Mission Cards',
      type: 'group',
      fields: [
        {
          name: 'card1',
          label: 'First Card',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', required: true, defaultValue: 'Our Mission' },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 220,
              defaultValue:
                'To create a supportive learning environment where students can build confidence and achieve academic success.',
            },
            {
              name: 'longDescription',
              type: 'textarea',
              required: true,
              maxLength: 300,
              defaultValue:
                'We prioritize strong fundamentals, consistent practice, and individualized feedback. Our programs are designed to turn small daily wins into lasting academic growth.',
            },
          ],
        },
        {
          name: 'card2',
          label: 'Second Card',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', required: true, defaultValue: 'Our Team' },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 220,
              defaultValue:
                'Experienced educators who are experts in their fields and passionate about helping students learn.',
            },
            {
              name: 'longDescription',
              type: 'textarea',
              required: true,
              maxLength: 300,
              defaultValue:
                "Every tutor is carefully vetted and trained in our coaching playbook—mixing subject expertise with mentorship that builds motivation and healthy study habits.",
            },
          ],
        },
        {
          name: 'card3',
          label: 'Third Card',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', required: true, defaultValue: 'Our Approach' },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 220,
              defaultValue: "Personalized learning plans that adapt to each student's unique needs, learning style, and pace.",
            },
            {
              name: 'longDescription',
              type: 'textarea',
              required: true,
              maxLength: 300,
              defaultValue:
                'We start with a simple assessment, define clear goals with families, and adjust plans weekly based on progress so every session moves the student forward.',
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      label: 'Quick Stats',
      type: 'group',
      fields: [
        {
          name: 'stat1',
          label: 'Stat 1',
          type: 'group',
          fields: [
            { name: 'value', type: 'text', required: true, defaultValue: '10+' },
            { name: 'label', type: 'text', required: true, maxLength: 40, defaultValue: 'Years Experience' },
          ],
        },
        {
          name: 'stat2',
          label: 'Stat 2',
          type: 'group',
          fields: [
            { name: 'value', type: 'text', required: true, defaultValue: '95%' },
            { name: 'label', type: 'text', required: true, maxLength: 40, defaultValue: 'Success Rate' },
          ],
        },
        {
          name: 'stat3',
          label: 'Stat 3',
          type: 'group',
          fields: [
            { name: 'value', type: 'text', required: true, defaultValue: '24/7' },
            { name: 'label', type: 'text', required: true, maxLength: 40, defaultValue: 'Support' },
          ],
        },
      ],
    },
  ],
}


