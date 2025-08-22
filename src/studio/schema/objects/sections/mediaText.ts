import { defineField, defineType } from 'sanity';
import { PanelLeftIcon } from '@sanity/icons';

export default defineType({
  name: 'mediaText',
  type: 'object',
  title: 'Media & Text',
  icon: PanelLeftIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      initialValue: 'left',
      title: 'Image position',
      options: { list: ['left', 'right'] },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'cta',
      type: 'object',
      title: 'Call to Action',
      fields: [
        defineField({
          name: 'label',
          type: 'string',
          title: 'Button Label',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'url',
          type: 'string',
          title: 'Button URL',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled',
      };
    },
  },
});
