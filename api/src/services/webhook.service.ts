import type {
  CaptureWebhookData,
  WebhookRepository,
} from '@/repositories/webhook.repository'

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class WebhookService {
  constructor(private repository: WebhookRepository) {}

  async getWebhookById(id: string) {
    const webhook = await this.repository.findById(id)

    if (!webhook) {
      throw new NotFoundError('Webhook not found.')
    }

    return webhook
  }

  async listWebhooks(limit: number, cursor?: string) {
    const result = await this.repository.findMany(limit, cursor)

    const hasMore = result.length > limit
    const items = hasMore ? result.slice(0, limit) : result
    const nextCursor = hasMore ? items[items.length - 1].id : null

    return {
      webhooks: items,
      nextCursor,
    }
  }

  async captureWebhook(data: CaptureWebhookData) {
    return this.repository.create(data)
  }

  async deleteWebhook(id: string) {
    const deleted = await this.repository.delete(id)

    if (!deleted) {
      throw new NotFoundError('Webhook not found.')
    }
  }
}
