import { z } from 'zod'

export const resourceSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
})
