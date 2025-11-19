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
  { label: 'Flask', value: 'flask' },
  { label: 'DNA', value: 'dna' },
]

function subjectDefaults(
  subjects: { title: string; icon: string }[],
) {
  return subjects.map((subject) => ({
    title: subject.title,
    icon: subject.icon,
  }))
}

export const Register: GlobalConfig = {
  slug: 'register',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidatePath('/register')
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
      defaultValue: 'Enroll Your Child with StudyBuddy',
    },
    {
      name: 'description',
      label: 'Page Description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue: "Share a few details and we'll match your child with the perfect tutor.",
    },
    {
      name: 'gradeLabel',
      label: 'Grade Selection Label',
      type: 'text',
      required: true,
      maxLength: 80,
      defaultValue: 'Choose Grade (For Year 2026)',
    },
    {
      name: 'subjects',
      label: 'Available Subjects',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          label: 'Subject Name',
          type: 'text',
          required: true,
          maxLength: 60,
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          required: true,
          options: iconOptions,
        },
      ],
      defaultValue: subjectDefaults([
        { title: 'English', icon: 'book' },
        { title: 'Bahasa Malaysia', icon: 'languages' },
        { title: 'Mathematics', icon: 'calculator' },
        { title: 'Addmath', icon: 'calculator' },
        { title: 'Science', icon: 'flask' },
        { title: 'Sejarah', icon: 'globe' },
        { title: 'Kimia', icon: 'flask' },
        { title: 'Biology', icon: 'dna' },
        { title: 'Physics', icon: 'atom' },
        { title: 'Prinsip Akaun', icon: 'calculator' },
        { title: 'Ekonomi', icon: 'calculator' },
        { title: 'Perniagaan', icon: 'globe' },
      ]),
    },
  ],
}

