import { z } from 'zod'

export const generateHandlerBodySchema = z.object({
  webhookIds: z.array(z.string()),
})

export const generateHandlerResponseSchema = z.object({
  code: z.string(),
})

export type GenerateHandlerBody = z.infer<typeof generateHandlerBodySchema>
