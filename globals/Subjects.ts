import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

const iconOptions: { label: string; value: string }[] = [
  { label: 'Book', value: 'book' },
  { label: 'Languages', value: 'languages' },
  { label: 'Calculator', value: 'calculator' },
  { label: 'Atom', value: 'atom' },
  { label: 'Globe', value: 'globe' },
  { label: 'Code', value: 'code' },
  { label: 'Music', value: 'music' },
  { label: 'Palette', value: 'palette' },
]

const defaultHighlights = ['One-on-one tutoring', 'Homework help', 'Test preparation']

function subjectDefaults(
  subjects: { title: string; icon: string; description: string }[],
) {
  return subjects.map((subject) => ({
    title: subject.title,
    icon: subject.icon,
    shortDescription: subject.description,
    highlights: defaultHighlights.map((text) => ({ text })),
  }))
}

export const Subjects: GlobalConfig = {
  slug: 'subjects',
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
      defaultValue: 'What We Teach',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue: 'We offer tutoring in a wide range of subjects for students of all ages and levels.',
    },
    {
      name: 'categories',
      label: 'Subject Categories',
      type: 'group',
      fields: [
        {
          name: 'primary',
          label: 'Primary',
          type: 'group',
          fields: [
            {
              name: 'subjects',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  maxLength: 60,
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: iconOptions,
                },
                {
                  name: 'shortDescription',
                  type: 'textarea',
                  required: true,
                  maxLength: 200,
                },
                {
                  name: 'highlights',
                  type: 'array',
                  minRows: 1,
                  maxRows: 3,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      maxLength: 80,
                    },
                  ],
                },
              ],
              defaultValue: subjectDefaults([
                { title: 'English', icon: 'book', description: 'Personalized tutoring in English.' },
                { title: 'Bahasa Malaysia', icon: 'languages', description: 'Bantuan pembelajaran Bahasa Malaysia.' },
                { title: 'Mathematics', icon: 'calculator', description: 'Core math skills and problem solving.' },
                { title: 'Science', icon: 'atom', description: 'Foundational science concepts.' },
                { title: 'Sejarah', icon: 'globe', description: 'Introductory history and timelines.' },
              ]),
            },
          ],
        },
        {
          name: 'lowerSecondary',
          label: 'Lower Secondary',
          type: 'group',
          fields: [
            {
              name: 'subjects',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  maxLength: 60,
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: iconOptions,
                },
                {
                  name: 'shortDescription',
                  type: 'textarea',
                  required: true,
                  maxLength: 200,
                },
                {
                  name: 'highlights',
                  type: 'array',
                  minRows: 1,
                  maxRows: 3,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      maxLength: 80,
                    },
                  ],
                },
              ],
              defaultValue: subjectDefaults([
                { title: 'English', icon: 'book', description: 'Strengthen language skills and comprehension.' },
                {
                  title: 'Bahasa Malaysia',
                  icon: 'languages',
                  description: 'Pengukuhan Bahasa Malaysia untuk menengah rendah.',
                },
                { title: 'Mathematics', icon: 'calculator', description: 'Algebraic thinking and applied problem solving.' },
                {
                  title: 'Science',
                  icon: 'atom',
                  description: 'Integrated science: physics, chemistry, biology foundations.',
                },
                { title: 'Sejarah', icon: 'globe', description: 'Kurikulum sejarah menengah rendah.' },
                { title: 'Geography', icon: 'globe', description: 'Physical and human geography basics.' },
              ]),
            },
          ],
        },
        {
          name: 'upperSecondary',
          label: 'Upper Secondary',
          type: 'group',
          fields: [
            {
              name: 'subjects',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  maxLength: 60,
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: iconOptions,
                },
                {
                  name: 'shortDescription',
                  type: 'textarea',
                  required: true,
                  maxLength: 200,
                },
                {
                  name: 'highlights',
                  type: 'array',
                  minRows: 1,
                  maxRows: 3,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      maxLength: 80,
                    },
                  ],
                },
              ],
              defaultValue: subjectDefaults([
                { title: 'English', icon: 'book', description: 'Advanced English skills and exam prep.' },
                { title: 'Bahasa Malaysia', icon: 'languages', description: 'Persediaan peperiksaan dan karangan.' },
                { title: 'Mathematics', icon: 'calculator', description: 'Comprehensive mathematics tutoring.' },
                { title: 'Addmath', icon: 'calculator', description: 'Additional mathematics topics and techniques.' },
                { title: 'Physics', icon: 'atom', description: 'Physics fundamentals and calculations.' },
                { title: 'Chemistry', icon: 'atom', description: 'Chemistry principles and problem solving.' },
                { title: 'Biology', icon: 'atom', description: 'Biology concepts and exam strategies.' },
                { title: 'Sejarah', icon: 'globe', description: 'Malaysian and world history topics.' },
                { title: 'Prinsip Akaun', icon: 'calculator', description: 'Principles of accounting.' },
                { title: 'Ekonomi', icon: 'calculator', description: 'Economics theory and practice.' },
                { title: 'Perniagaan', icon: 'calculator', description: 'Business studies essentials.' },
                { title: 'Geography', icon: 'globe', description: 'Physical and human geography.' },
              ]),
            },
          ],
        },
      ],
    },
    {
      name: 'packages',
      label: 'Packages',
      type: 'array',
      minRows: 1,
      maxRows: 15,
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          label: 'Package Name',
          type: 'textarea',
          required: true,
          maxLength: 80,
        },
        {
          name: 'grade',
          label: 'Grade',
          type: 'text',
          required: true,
          maxLength: 60,
        },
        {
          name: 'price',
          label: 'Price (Monthly)',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'subjects',
          type: 'array',
          minRows: 1,
          maxRows: 15,
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
          name: 'popular',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      defaultValue: [
        {
          id: 'pcs-s4-6',
          name: 'Pakej Cuti Sekolah',
          grade: 'Standard 4,5,6',
          price: 99.9,
          popular: false,
          subjects: ['Bahasa Malaysia', 'English', 'Mathematics', 'Science', 'Sejarah'].map((label) => ({ label })),
        },
        {
          id: 'pcs-f1-3',
          name: 'Pakej Cuti Sekolah',
          grade: 'Form 1,2,3',
          price: 129.9,
          popular: false,
          subjects: ['Bahasa Malaysia', 'English', 'Mathematics', 'Science', 'Sejarah'].map((label) => ({ label })),
        },
        {
          id: 'pcs-f4-5',
          name: 'Pakej Cuti Sekolah',
          grade: 'Form 4,5',
          price: 149.9,
          popular: true,
          subjects: [
            'Bahasa Malaysia',
            'English',
            'Mathematics',
            'Sejarah',
            'Kimia',
            'Biology',
            'Physics',
            'Addmath',
            'Science',
            'Prinsip Akaun',
            'Ekonomi',
            'Perniagaan',
          ].map((label) => ({ label })),
        },
      ],
    },
  ],
}

