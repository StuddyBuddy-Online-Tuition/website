import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
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
      name: 'brandName',
      label: 'Brand Name',
      type: 'text',
      required: true,
      maxLength: 60,
      defaultValue: 'StudyBuddy',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue:
        'StudyBuddy is your go-to online tutoring platform. Connect with expert tutors who care about your academic growth. Learn at your own pace, anytime, anywhere. Find your perfect study buddy today!',
    },
    {
      name: 'links',
      label: 'Contact + Social Links',
      type: 'group',
      fields: [
        {
          name: 'facebookUrl',
          label: 'Facebook URL',
          type: 'text',
          required: true,
          maxLength: 200,
          defaultValue: 'https://www.facebook.com/studybuddysynergy/',
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          defaultValue: 'admin@studybuddysynergy.com',
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
          required: true,
          maxLength: 30,
          defaultValue: '+60124997926',
        },
      ],
    },
  ],
}


