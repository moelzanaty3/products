import React from 'react'
import {MdOutlineArticle} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  type: 'document',
  title: 'Article',
  icon: MdOutlineArticle,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'state',
      title: 'Current State',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'draft',
      options: {
        list: [
          {title: 'draft', value: 'draft'},
          {title: 'published', value: 'published'},
        ],
      },
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({type: 'linkResource'}),
        defineArrayMember({type: 'tweet'}),
        defineArrayMember({type: 'reference', to: [{type: 'article'}]}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'body',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'imageNew',
      title: 'Image (To be removed)',
      type: 'image',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image.asset.url',
    },
    prepare(selection) {
      const {title, media} = selection

      return {
        title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
})