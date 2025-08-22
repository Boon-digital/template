import { defineField, defineType } from 'sanity';
import { ListIcon } from '@sanity/icons';

export default defineType({
  name: 'postCardGrid',
  title: 'Post Card Grid',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'numberOfPosts',
      title: 'Number of Posts to Show',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(20),
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      numberOfPosts: 'numberOfPosts',
    },
    prepare(selection) {
      const { title, numberOfPosts } = selection;

      return {
        title: title || 'Post Card Grid',
        subtitle: `Showing ${numberOfPosts || 3} posts`,
      };
    },
  },
});
