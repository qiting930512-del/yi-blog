import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['個人思考', '影視幕後', '工具流', '社群紀錄']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const lapian = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    film: z.string(),
    director: z.string(),
    year: z.number(),
    scene: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    aspect: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, lapian };
