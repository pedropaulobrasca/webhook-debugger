import type { FastifyReply, FastifyRequest } from 'fastify'
import type { GenerateHandlerBody } from '@/dto/generate-handler.dto'
import type { GenerateHandlerService } from '@/services/generate-handler.service'

export class GenerateHandlerController {
  constructor(private service: GenerateHandlerService) {}

  async generateHandler(
    request: FastifyRequest<{ Body: GenerateHandlerBody }>,
    reply: FastifyReply,
  ) {
    const { webhookIds } = request.body
    const result = await this.service.generateHandler(webhookIds)
    return reply.status(201).send(result)
  }
}
