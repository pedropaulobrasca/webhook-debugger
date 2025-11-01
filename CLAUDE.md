# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Webhook Debugger** - pnpm monorepo com aplicação full-stack para captura e inspeção de webhooks em tempo real, com geração de código via IA (Google Gemini).

**Workspaces**:
- `api/` - Fastify REST API + PostgreSQL (Drizzle ORM)
- `web/` - React 19 SPA + Vite + TanStack Router

**Funcionalidade principal**: Captura qualquer requisição HTTP em `/capture/*`, armazena no banco com todos os detalhes (headers, body, query params, IP), e permite inspeção visual e geração automática de handlers TypeScript usando IA.

## Development Setup

### Prerequisites
- pnpm 10.15.0 (via `packageManager` field)
- Docker (PostgreSQL container)
- Google Gemini API key

### Initial Setup
```bash
pnpm install

cd api
cp .env.example .env
# Edite .env com DATABASE_URL e GOOGLE_GENERATIVE_AI_API_KEY

docker compose up -d
pnpm db:migrate
pnpm db:seed  # opcional: dados fake com Faker.js
```

### Running Development Servers
```bash
# Terminal 1 - API (porta 3333)
cd api && pnpm dev

# Terminal 2 - Web (porta 5173)
cd web && pnpm dev
```

**URLs importantes**:
- Frontend: http://localhost:5173
- API: http://localhost:3333
- API Docs (Scalar): http://localhost:3333/docs
- Drizzle Studio: `cd api && pnpm db:studio` (porta 4983)

## Common Commands

### API (diretório `api/`)
```bash
pnpm dev          # Dev server com tsx watch e hot reload
pnpm format       # Biome format + lint
pnpm db:generate  # Gera migrations do schema Drizzle
pnpm db:migrate   # Aplica migrations
pnpm db:studio    # GUI do banco (Drizzle Studio)
pnpm db:seed      # Popula banco com dados fake
```

### Web (diretório `web/`)
```bash
pnpm dev          # Vite dev server
pnpm build        # TypeScript check + production build
pnpm preview      # Preview do build de produção
pnpm format       # Biome format + lint
```

## Architecture

### API Architecture

**Stack**: Fastify + Drizzle ORM + PostgreSQL + Zod + Vercel AI SDK + Google Gemini

**Arquitetura em Camadas**:

A API segue uma arquitetura em camadas (Layered Architecture) com separação clara de responsabilidades:

```
Routes (HTTP Layer) → Controllers → Services → Repositories → Database
```

**Estrutura de diretórios**:
```
src/
├── routes/              # HTTP Layer - roteamento e validação Zod
├── controllers/         # Orquestração request/response
├── services/           # Lógica de negócio
├── repositories/       # Acesso a dados (Drizzle queries)
├── dto/                # Data Transfer Objects (schemas Zod)
├── lib/                # Utilitários (container para DI)
├── db/                 # Database setup
└── env.ts
```

**Responsabilidades das camadas**:

1. **Routes**: Apenas roteamento e validação de schema. Delega para Controllers via Container.
2. **Controllers**: Extrai dados do request, chama Services, formata response HTTP, trata erros.
3. **Services**: Lógica de negócio, regras, validações. Agnóstico de HTTP.
4. **Repositories**: Queries ao banco de dados. Sem lógica de negócio.
5. **DTOs**: Schemas Zod compartilhados para type safety.

**Container (Dependency Injection)**:
- Singleton pattern manual em `src/lib/container.ts`
- Gerencia instâncias de Controllers, Services e Repositories
- Garante única instância de cada classe

**Padrões importantes**:
- Todas as rotas são Fastify plugins (`FastifyPluginAsyncZod`)
- Schemas Zod para validação automática de request/response
- Path aliases: `@/` aponta para `src/`
- Variáveis de ambiente validadas com Zod em `src/env.ts`
- Type provider Zod gera OpenAPI/Swagger automaticamente
- **NUNCA pule camadas**: sempre siga Route → Controller → Service → Repository

**Exemplo completo de feature**:

```typescript
// dto/webhook.dto.ts
export const getWebhookParamsSchema = z.object({ id: z.uuidv7() })

// repositories/webhook.repository.ts
export class WebhookRepository {
  async findById(id: string) {
    return db.select().from(webhooks).where(eq(webhooks.id, id)).limit(1)
  }
}

// services/webhook.service.ts
export class WebhookService {
  constructor(private repository: WebhookRepository) {}

  async getWebhookById(id: string) {
    const webhook = await this.repository.findById(id)
    if (!webhook) throw new NotFoundError('Webhook not found.')
    return webhook
  }
}

// controllers/webhook.controller.ts
export class WebhookController {
  constructor(private service: WebhookService) {}

  async getWebhook(request, reply) {
    try {
      const webhook = await this.service.getWebhookById(request.params.id)
      return reply.send(webhook)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }
}

// routes/get-webhook.ts
export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  const controller = Container.getWebhookController()

  app.get('/api/webhooks/:id', {
    schema: {
      params: getWebhookParamsSchema,
      response: { 200: webhookSchema }
    }
  }, (request, reply) => controller.getWebhook(request, reply))
}
```

**Database**:
- Drizzle ORM com PostgreSQL dialect
- Schema em `src/db/schema/webhooks.ts`
- UUIDv7 para IDs (ordenados por tempo): `.$defaultFn(() => uuidv7())`
- Naming convention: snake_case (configurado em `drizzle.config.ts`)
- JSONB para headers e queryParams

**Principais rotas**:
- `GET /api/webhooks` - Lista com cursor pagination (usando UUIDv7 como cursor)
- `GET /api/webhooks/:id` - Detalhes completos
- `DELETE /api/webhooks/:id` - Remove webhook
- `POST /api/generate` - Gera handler TypeScript via Gemini baseado em IDs de webhooks
- `ALL /capture/*` - Captura qualquer requisição HTTP (método, headers, body, query, IP)

**IA Integration**:
- Vercel AI SDK (`ai` package) com `@ai-sdk/google`
- Modelo: `gemini-2.5-flash`
- Lógica em `src/services/generate-handler.service.ts`

### Web Architecture

**Stack**: React 19 + Vite + TanStack Router + TanStack Query + Tailwind CSS v4 + Radix UI + Shiki

**File-based routing**:
- TanStack Router com `@tanstack/router-plugin` Vite plugin
- Rotas em `src/routes/` (ex: `webhooks.$id.tsx` → `/webhooks/:id`)
- `routeTree.gen.ts` é auto-gerado, nunca editar manualmente
- Layout root em `__root.tsx`

**Styling**:
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Utility classes + `tailwind-variants` para componentes variantes
- `tailwind-merge` para merge condicional de classes
- Tema escuro padrão

**Componentes UI**:
- `src/components/ui/` - componentes reutilizáveis baseados em Radix UI
- `src/components/code-block.tsx` - Syntax highlight com Shiki
- Painéis split com `react-resizable-panels`
- Ícones: `lucide-react`
- Datas: `date-fns`

**Data fetching**:
- TanStack Query para cache e estado assíncrono
- Schemas Zod compartilhados em `src/http/schemas/` para validação de responses
- Padrão: criar hooks customizados que encapsulam `useQuery`/`useMutation`

## Code Style

**Biome** para linting e formatting (não Prettier/ESLint):
- Configuração em `api/biome.json` e `web/biome.json`
- Line width: 80 (API e Web)
- Indent: 2 espaços
- Quotes: single
- Semicolons: asNeeded
- Organização automática de imports habilitada

## Database Workflow

**Modificando schema**:
1. Edite `api/src/db/schema/webhooks.ts`
2. `pnpm db:generate` - gera migration SQL
3. Revise SQL gerado em `api/src/db/migrations/`
4. `pnpm db:migrate` - aplica migration
5. Commite schema + migrations juntos

**Dica**: Use Drizzle Studio (`pnpm db:studio`) para inspeção visual do banco durante desenvolvimento.

## Important Patterns

### Adding API Features

Siga a arquitetura em camadas ao adicionar novas features:

1. **DTO**: Criar schemas Zod em `api/src/dto/`
   ```typescript
   export const createUserBodySchema = z.object({ name: z.string() })
   ```

2. **Repository**: Criar classe em `api/src/repositories/`
   ```typescript
   export class UserRepository {
     async create(data) { return db.insert(users).values(data) }
   }
   ```

3. **Service**: Criar classe em `api/src/services/`
   ```typescript
   export class UserService {
     constructor(private repository: UserRepository) {}
     async createUser(data) { /* lógica de negócio */ }
   }
   ```

4. **Controller**: Criar classe em `api/src/controllers/`
   ```typescript
   export class UserController {
     constructor(private service: UserService) {}
     async createUser(request, reply) { /* orquestração HTTP */ }
   }
   ```

5. **Container**: Adicionar getters em `api/src/lib/container.ts`
   ```typescript
   static getUserController() {
     if (!this.userController) {
       this.userController = new UserController(this.getUserService())
     }
     return this.userController
   }
   ```

6. **Route**: Criar em `api/src/routes/` usando Container
   ```typescript
   export const createUser: FastifyPluginAsyncZod = async (app) => {
     const controller = Container.getUserController()
     app.post('/api/users', { schema }, (req, reply) =>
       controller.createUser(req, reply)
     )
   }
   ```

7. **Register**: Adicionar em `api/src/server.ts`
   ```typescript
   app.register(createUser)
   ```

**IMPORTANTE**: Nunca pule camadas. Sempre siga o fluxo completo.

### Adding Web Pages
1. Criar `web/src/routes/nome-da-pagina.tsx`
2. Exportar componente com `createFileRoute('/nome-da-pagina').createComponent()`
3. `routeTree.gen.ts` atualiza automaticamente via Vite plugin
4. Para rotas dinâmicas: usar `$` (ex: `webhooks.$id.tsx`)

### Environment Variables
- **API**: validadas com Zod em `src/env.ts`, acessadas via `env` object
- **Obrigatórias**: `DATABASE_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`
- **Opcionais**: `PORT` (default 3333), `NODE_ENV` (default development)
- Arquivo `.env` não é commitado (apenas `.env.example`)

### Type Safety
- Backend: Zod schemas geram tipos TypeScript automaticamente
- Frontend: importar schemas Zod de `src/http/schemas/` e usar `.infer<typeof schema>`
- Drizzle: schemas geram tipos via `typeof webhooks.$inferSelect`

## Key Technical Decisions

- **UUIDv7 como IDs**: ordenação temporal + unicidade distribuída
- **Cursor pagination**: usando UUIDv7 como cursor (mais eficiente que offset)
- **Wildcard capture**: `/capture/*` captura qualquer rota para flexibilidade
- **Monorepo**: compartilhamento de tipos via Zod schemas entre API e Web
- **Type providers**: Fastify + Zod = validação runtime + tipos compile-time
- **AI code generation**: Gemini Flash para velocidade + baixo custo

## Monorepo Notes

- **Sempre use pnpm** (não npm/yarn)
- Workspaces: `api/` e `web/` (definidos em `pnpm-workspace.yaml`)
- Dependências compartilhadas hoisted para raiz
- Rodar comandos: navegar até workspace específico (`cd api` ou `cd web`)
- TypeScript versão compartilhada: ~5.9.3
