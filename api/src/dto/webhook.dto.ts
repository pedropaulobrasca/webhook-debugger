import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { webhooks } from '@/db/schema'

export const webhookSchema = createSelectSchema(webhooks)

export const getWebhookParamsSchema = z.object({
  id: z.uuidv7(),
})

export const listWebhooksQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

export const webhookListItemSchema = webhookSchema.pick({
  id: true,
  method: true,
  pathname: true,
  createdAt: true,
})

export const listWebhooksResponseSchema = z.object({
  webhooks: z.array(webhookListItemSchema),
  nextCursor: z.string().nullable(),
})

export const deleteWebhookParamsSchema = z.object({
  id: z.uuidv7(),
})

export const captureWebhookResponseSchema = z.object({
  id: z.uuidv7(),
})

export type GetWebhookParams = z.infer<typeof getWebhookParamsSchema>
export type ListWebhooksQuery = z.infer<typeof listWebhooksQuerySchema>
export type DeleteWebhookParams = z.infer<typeof deleteWebhookParamsSchema>
