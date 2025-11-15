import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

const iconOptions = [
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Target', value: 'target' },
  { label: 'Star', value: 'star' },
  { label: 'Clock', value: 'clock' },
  { label: 'CheckCircle', value: 'check' },
  { label: 'Lightbulb', value: 'lightbulb' },
]

export const WhyUs: GlobalConfig = {
  slug: 'why-us',
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
      defaultValue: 'What Makes Study Buddy Special',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue: "We're not just tutors - we're learning partners who make education exciting and effective.",
    },
    {
      name: 'features',
      label: 'Features',
      type: 'group',
      fields: Array.from({ length: 6 }).map((_, index) => ({
        name: `feature${index + 1}`,
        label: `Feature ${index + 1}`,
        type: 'group',
        fields: [
          {
            name: 'icon',
            label: 'Icon',
            type: 'select',
            required: true,
            defaultValue: iconOptions[index]?.value ?? iconOptions[0].value,
            options: iconOptions,
          },
          {
            name: 'title',
            type: 'text',
            required: true,
            maxLength: 80,
            defaultValue: [
              'Fun Learning Environment',
              'Personalized Approach',
              'Qualified Tutors',
              'Flexible Scheduling',
              'Proven Results',
              'Critical Thinking',
            ][index],
          },
          {
            name: 'description',
            type: 'textarea',
            required: true,
            maxLength: 180,
            defaultValue: [
              'We make learning enjoyable with interactive lessons and engaging activities.',
              "Customized learning plans tailored to each student's unique needs and goals.",
              'Experienced educators who are experts in their subjects and passionate about teaching.',
              'Convenient session times that fit into your busy family schedule.',
              'Our students consistently show improvement in grades and confidence.',
              'We develop problem-solving skills that extend beyond the classroom.',
            ][index],
          },
          {
            name: 'expandedContent',
            type: 'textarea',
            required: true,
            maxLength: 400,
            defaultValue: [
              'Our tutors use games, interactive exercises, and real-world examples to make learning fun and memorable. Students are more engaged when they are enjoying themselves, which leads to better retention and understanding of concepts.',
              "We begin with a comprehensive assessment to understand your child's learning style, strengths, and areas for improvement. Then we create a personalized learning plan that adapts as they progress.",
              'Our tutors are not only subject matter experts but also trained in effective teaching methods. They undergo rigorous screening and training to ensure they can connect with students.',
              "We understand that families are busy. That's why we offer sessions seven days a week, with early morning and evening options available.",
              'We track progress carefully and can demonstrate measurable improvements in academic performance, confidence, and study habits.',
              'We focus on developing critical thinking and problem-solving skills so students can succeed beyond their current classes.',
            ][index],
          },
        ],
      })),
    },
  ],
}

