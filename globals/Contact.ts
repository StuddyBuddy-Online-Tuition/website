import { revalidatePath } from 'next/cache'
import type { GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
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
      maxLength: 80,
      defaultValue: 'Contact Us',
    },
    {
      name: 'description',
      label: 'Section Description',
      type: 'textarea',
      required: true,
      maxLength: 320,
      defaultValue: "Have questions? We're here to help! Reach out for more information about our tutoring services.",
    },
    {
      name: 'contactInfo',
      label: 'Contact Information',
      type: 'group',
      fields: [
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
          required: true,
          maxLength: 30,
          defaultValue: '(123) 456-7890',
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          defaultValue: 'info@studybuddy.com',
        },
        {
          name: 'location',
          label: 'Location',
          type: 'textarea',
          required: true,
          maxLength: 180,
          defaultValue: '123 Learning Lane, Education City, EC 12345',
        },
      ],
    },
    {
      name: 'workingHours',
      label: 'Working Hours Text',
      type: 'textarea',
      required: true,
      maxLength: 400,
      defaultValue: `Monday - Friday: 9:00 AM - 7:00 PM
Saturday: 10:00 AM - 4:00 PM
Sunday: Closed`,
    },
    {
      name: 'followLinks',
      label: 'Follow Us Links',
      type: 'group',
      fields: [
        {
          name: 'facebookUrl',
          label: 'Facebook URL',
          type: 'text',
          maxLength: 200,
          defaultValue: '',
        },
        {
          name: 'instagramUrl',
          label: 'Instagram URL',
          type: 'text',
          maxLength: 200,
          defaultValue: '',
        },
        {
          name: 'tiktokUrl',
          label: 'TikTok URL',
          type: 'text',
          maxLength: 200,
          defaultValue: '',
        },
      ],
    },
  ],
}

