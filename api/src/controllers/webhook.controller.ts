import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
  DeleteWebhookParams,
  GetWebhookParams,
  ListWebhooksQuery,
} from '@/dto/webhook.dto'
import type { WebhookService } from '@/services/webhook.service'
import { NotFoundError } from '@/services/webhook.service'
import type { CaptureWebhookData } from '@/repositories/webhook.repository'

export class WebhookController {
  constructor(private service: WebhookService) {}

  async getWebhook(
    request: FastifyRequest<{ Params: GetWebhookParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params
      const webhook = await this.service.getWebhookById(id)
      return reply.send(webhook)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }

  async listWebhooks(
    request: FastifyRequest<{ Querystring: ListWebhooksQuery }>,
    reply: FastifyReply,
  ) {
    const { limit, cursor } = request.query
    const result = await this.service.listWebhooks(limit, cursor)
    return reply.send(result)
  }

  async captureWebhook(request: FastifyRequest, reply: FastifyReply) {
    const method = request.method
    const ip = request.ip
    const contentType = request.headers['content-type'] ?? null
    const contentLength = request.headers['content-length']
      ? Number(request.headers['content-length'])
      : null

    let body: string | null = null

    if (request.body) {
      body =
        typeof request.body === 'string'
          ? request.body
          : JSON.stringify(request.body, null, 2)
    }

    const pathname = new URL(request.url, 'http://localhost').pathname.replace(
      '/capture',
      '',
    )

    const headers = Object.fromEntries(
      Object.entries(request.headers).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(', ') : value || '',
      ]),
    )

    const data: CaptureWebhookData = {
      method,
      ip,
      contentType,
      contentLength,
      body,
      headers,
      pathname,
    }

    const webhook = await this.service.captureWebhook(data)
    return reply.send({ id: webhook.id })
  }

  async deleteWebhook(
    request: FastifyRequest<{ Params: DeleteWebhookParams }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params
      await this.service.deleteWebhook(id)
      return reply.status(204).send()
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }
}
