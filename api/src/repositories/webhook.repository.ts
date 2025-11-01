import { db } from '@/db'
import { webhooks } from '@/db/schema'
import { desc, eq, inArray, lt } from 'drizzle-orm'

export interface CaptureWebhookData {
  method: string
  ip: string
  contentType: string | null
  contentLength: number | null
  body: string | null
  headers: Record<string, string>
  pathname: string
}

export class WebhookRepository {
  async findById(id: string) {
    const result = await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.id, id))
      .limit(1)

    return result[0] ?? null
  }

  async findMany(limit: number, cursor?: string) {
    const result = await db
      .select({
        id: webhooks.id,
        method: webhooks.method,
        pathname: webhooks.pathname,
        createdAt: webhooks.createdAt,
      })
      .from(webhooks)
      .where(cursor ? lt(webhooks.id, cursor) : undefined)
      .orderBy(desc(webhooks.id))
      .limit(limit + 1)

    return result
  }

  async findBodiesByIds(ids: string[]) {
    return db
      .select({ body: webhooks.body })
      .from(webhooks)
      .where(inArray(webhooks.id, ids))
  }

  async create(data: CaptureWebhookData) {
    const result = await db.insert(webhooks).values(data).returning()

    return result[0]
  }

  async delete(id: string) {
    const result = await db
      .delete(webhooks)
      .where(eq(webhooks.id, id))
      .returning()

    return result.length > 0
  }
}
