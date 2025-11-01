import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getWebhookParamsSchema, webhookSchema } from '@/dto/webhook.dto'
import { Container } from '@/lib/container'

export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  const controller = Container.getWebhookController()

  app.get(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Get a specific webhook by ID',
        tags: ['Webhooks'],
        params: getWebhookParamsSchema,
        response: {
          200: webhookSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    (request, reply) => controller.getWebhook(request, reply),
  )
}
