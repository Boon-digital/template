import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';
import { createRadioListLayout } from '@/utils/schema';

export default defineType({
  name: 'hero',
  type: 'object',
  icon: DocumentTextIcon,
  title: 'Hero',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'text',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'buttons',
      type: 'array',
      of: [{ type: 'button' }],
      validation: (Rule) => Rule.min(2).max(4),
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: createRadioListLayout(['default', 'centered', 'fullscreen']),
      initialValue: 'default',
      description: 'Choose the layout style for this hero section',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      image: 'image',
      layout: 'layout',
    },
    prepare({ title, image, layout }) {
      return {
        title: title || 'Untitled',
        subtitle: `Hero (${layout || 'default'} layout)`,
        media: image || DocumentTextIcon,
      };
    },
  },
});
