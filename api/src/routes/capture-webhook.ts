import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { captureWebhookResponseSchema } from '@/dto/webhook.dto'
import { Container } from '@/lib/container'

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  const controller = Container.getWebhookController()

  app.all(
    '/capture/*',
    {
      schema: {
        summary: 'Capture incoming webhook requests',
        tags: ['External'],
        hide: true,
        response: {
          201: captureWebhookResponseSchema,
        },
      },
    },
    (request, reply) => controller.captureWebhook(request, reply),
  )
}
