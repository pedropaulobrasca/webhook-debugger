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

**Padrões importantes**:
- Todas as rotas são Fastify plugins (`FastifyPluginAsyncZod`)
- Schemas Zod para validação automática de request/response
- Path aliases: `@/` aponta para `src/`
- Variáveis de ambiente validadas com Zod em `src/env.ts`
- Type provider Zod gera OpenAPI/Swagger automaticamente

**Estrutura de rotas**:
```typescript
// src/routes/nome-da-rota.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const minhaRota: FastifyPluginAsyncZod = async (app) => {
  app.get('/api/endpoint', {
    schema: {
      summary: 'Descrição',
      tags: ['Tag'],
      querystring: z.object({ /* validação */ }),
      response: { 200: z.object({ /* validação */ }) }
    }
  }, async (request, reply) => {
    // handler
  })
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
- Prompt em `src/routes/generate-handler.ts` instrui a gerar handler TypeScript com Zod schemas

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

### Adding API Routes
1. Criar `api/src/routes/nome-da-rota.ts` exportando `FastifyPluginAsyncZod`
2. Definir schemas Zod completos (request + response)
3. Registrar em `api/src/server.ts`: `app.register(minhaRota)`
4. Documentação Swagger é gerada automaticamente dos schemas

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
