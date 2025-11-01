import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  generateHandlerBodySchema,
  generateHandlerResponseSchema,
} from '@/dto/generate-handler.dto'
import { Container } from '@/lib/container'

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  const controller = Container.getGenerateHandlerController()

  app.post(
    '/api/generate',
    {
      schema: {
        summary: 'Generate a TypeScript handler',
        tags: ['Webhooks'],
        body: generateHandlerBodySchema,
        response: {
          201: generateHandlerResponseSchema,
        },
      },
    },
    (request, reply) => controller.generateHandler(request, reply),
  )
}
