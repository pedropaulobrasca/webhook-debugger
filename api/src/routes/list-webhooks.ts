import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  listWebhooksQuerySchema,
  listWebhooksResponseSchema,
} from '@/dto/webhook.dto'
import { Container } from '@/lib/container'

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  const controller = Container.getWebhookController()

  app.get(
    '/api/webhooks',
    {
      schema: {
        summary: 'List webhooks',
        tags: ['Webhooks'],
        querystring: listWebhooksQuerySchema,
        response: {
          200: listWebhooksResponseSchema,
        },
      },
    },
    (request, reply) => controller.listWebhooks(request, reply),
  )
}
