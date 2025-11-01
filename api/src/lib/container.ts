import { WebhookRepository } from '@/repositories/webhook.repository'
import { WebhookService } from '@/services/webhook.service'
import { GenerateHandlerService } from '@/services/generate-handler.service'
import { WebhookController } from '@/controllers/webhook.controller'
import { GenerateHandlerController } from '@/controllers/generate-handler.controller'

export class Container {
  private static webhookRepository: WebhookRepository
  private static webhookService: WebhookService
  private static generateHandlerService: GenerateHandlerService
  private static webhookController: WebhookController
  private static generateHandlerController: GenerateHandlerController

  static getWebhookRepository(): WebhookRepository {
    if (!this.webhookRepository) {
      this.webhookRepository = new WebhookRepository()
    }
    return this.webhookRepository
  }

  static getWebhookService(): WebhookService {
    if (!this.webhookService) {
      this.webhookService = new WebhookService(this.getWebhookRepository())
    }
    return this.webhookService
  }

  static getGenerateHandlerService(): GenerateHandlerService {
    if (!this.generateHandlerService) {
      this.generateHandlerService = new GenerateHandlerService(
        this.getWebhookRepository(),
      )
    }
    return this.generateHandlerService
  }

  static getWebhookController(): WebhookController {
    if (!this.webhookController) {
      this.webhookController = new WebhookController(this.getWebhookService())
    }
    return this.webhookController
  }

  static getGenerateHandlerController(): GenerateHandlerController {
    if (!this.generateHandlerController) {
      this.generateHandlerController = new GenerateHandlerController(
        this.getGenerateHandlerService(),
      )
    }
    return this.generateHandlerController
  }
}
