/* eslint-disable import/no-anonymous-default-export */
import {MdVideocam} from 'react-icons/md'

export default {
  name: 'videoResource',
  title: 'Video Resource',
  type: 'document',
  icon: MdVideocam,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'muxAsset',
      title: 'Mux Asset',
      type: 'muxAsset',
    },
    {
      name: 'originalMediaUrl',
      title: 'AWS S3 Url',
      description: 'A URL to the source video in an S3 Bucket',
      type: 'url',
    },
    {
      name: 'castingwords',
      title: 'Castingwords',
      type: 'castingwordsTranscript',
    },
  ],
}