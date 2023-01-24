import z from 'zod'

export const ResourceSchema = z.object({
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.nullable(z.any().array().optional()),
})

export type Resource = z.infer<typeof ResourceSchema>