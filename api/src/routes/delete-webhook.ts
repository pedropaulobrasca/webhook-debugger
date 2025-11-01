import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteWebhookParamsSchema } from '@/dto/webhook.dto'
import { Container } from '@/lib/container'

export const deleteWebhook: FastifyPluginAsyncZod = async (app) => {
  const controller = Container.getWebhookController()

  app.delete(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Delete a specific webhook by ID',
        tags: ['Webhooks'],
        params: deleteWebhookParamsSchema,
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    (request, reply) => controller.deleteWebhook(request, reply),
  )
}
