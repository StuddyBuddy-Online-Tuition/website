import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

const gradeOptions: { label: string; value: string }[] = [
  { label: 'Standard 1', value: 'S1' },
  { label: 'Standard 2', value: 'S2' },
  { label: 'Standard 3', value: 'S3' },
  { label: 'Standard 4', value: 'S4' },
  { label: 'Standard 5', value: 'S5' },
  { label: 'Standard 6', value: 'S6' },
  { label: 'Form 1', value: 'F1' },
  { label: 'Form 2', value: 'F2' },
  { label: 'Form 3', value: 'F3' },
  { label: 'Form 4', value: 'F4' },
  { label: 'Form 5', value: 'F5' },
]

function gradeDefaults() {
  return gradeOptions.map((grade) => ({
    value: grade.value,
    label: grade.label,
  }))
}

export const Timetable: GlobalConfig = {
  slug: 'timetable',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidatePath('/timetable')
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Page Title',
      type: 'text',
      required: true,
      maxLength: 120,
      defaultValue: 'Master Timetable',
    },
    {
      name: 'description',
      label: 'Page Description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue: 'Select up to 5 standards/forms to display.',
    },
    {
      name: 'availableGrades',
      label: 'Available Grades',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'value',
          label: 'Grade',
          type: 'select',
          required: true,
          options: gradeOptions,
        },
        {
          name: 'label',
          label: 'Display Label',
          type: 'text',
          required: true,
          maxLength: 60,
        },
      ],
      defaultValue: gradeDefaults(),
    },
  ],
}

