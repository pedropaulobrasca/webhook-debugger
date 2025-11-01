<div align="center">

# Webhook Debugger

> Capture, inspecione e debuge requisições de webhooks em tempo real com interface moderna e geração de código com IA

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io/)

[Funcionalidades](#funcionalidades) • [Tecnologias](#tecnologias) • [Início Rápido](#início-rápido) • [Documentação](#documentação) • [Estrutura](#estrutura-do-projeto)

</div>

---

## Sobre

**Webhook Debugger** é uma aplicação completa para capturar e inspecionar requisições de webhooks durante o desenvolvimento de integrações. Com interface moderna e intuitiva, você pode visualizar detalhes completos de cada requisição, incluindo headers, body, query params, e até gerar handlers de código automaticamente usando IA.

### Por que usar?

- **Desenvolvimento ágil**: Capture webhooks de APIs externas sem precisar fazer deploy
- **Debugging visual**: Interface moderna com syntax highlighting e formatação JSON
- **Geração de código IA**: Crie handlers automaticamente baseados nas requisições reais
- **Histórico completo**: Todas as requisições são armazenadas para análise posterior
- **Type-safe**: 100% TypeScript com validação de schemas usando Zod

---

## Funcionalidades

- **Captura de webhooks**: Endpoint único que captura qualquer requisição HTTP
- **Inspeção detalhada**: Visualize headers, body, query params, método, IP e mais
- **Syntax highlighting**: Código formatado com Shiki para JSON, JavaScript e outras linguagens
- **Geração de handlers com IA**: Integração com Google Gemini para gerar código baseado nas requisições
- **Paginação com cursor**: Navegação eficiente em grandes volumes de webhooks
- **Interface responsiva**: Design moderno com tema escuro usando Tailwind CSS v4
- **API documentada**: Swagger/Scalar UI com documentação interativa completa
- **Type-safe**: Validação automática de requests e responses com Zod
- **Seed de dados**: Geração de dados de exemplo com Faker.js

---

## Tecnologias

### Backend (API)

| Tecnologia | Descrição |
|------------|-----------|
| **[Fastify](https://fastify.dev/)** | Framework web de alta performance |
| **[TypeScript](https://www.typescriptlang.org/)** | Tipagem estática para JavaScript |
| **[Drizzle ORM](https://orm.drizzle.team/)** | ORM type-safe para PostgreSQL |
| **[PostgreSQL](https://www.postgresql.org/)** | Banco de dados relacional |
| **[Zod](https://zod.dev/)** | Validação de schemas e type inference |
| **[Vercel AI SDK](https://sdk.vercel.ai/)** | SDK para integração com LLMs |
| **[Google Gemini](https://deepmind.google/technologies/gemini/)** | IA generativa para geração de código |
| **[Swagger/Scalar](https://scalar.com/)** | Documentação interativa da API |
| **[UUIDv7](https://www.npmjs.com/package/uuidv7)** | IDs ordenados por tempo |
| **[Faker.js](https://fakerjs.dev/)** | Geração de dados falsos para testes |

### Frontend (Web)

| Tecnologia | Descrição |
|------------|-----------|
| **[React 19](https://react.dev/)** | Biblioteca para interfaces de usuário |
| **[Vite](https://vitejs.dev/)** | Build tool e dev server ultra-rápido |
| **[TanStack Router](https://tanstack.com/router)** | Roteamento type-safe com file-based routing |
| **[TanStack Query](https://tanstack.com/query)** | Gerenciamento de estado assíncrono |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Framework CSS utility-first |
| **[Radix UI](https://www.radix-ui.com/)** | Componentes acessíveis e sem estilo |
| **[Lucide React](https://lucide.dev/)** | Biblioteca de ícones |
| **[Shiki](https://shiki.style/)** | Syntax highlighter com temas do VS Code |
| **[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)** | Painéis redimensionáveis |
| **[date-fns](https://date-fns.org/)** | Manipulação de datas |

### Ferramentas

| Tecnologia | Descrição |
|------------|-----------|
| **[pnpm](https://pnpm.io/)** | Gerenciador de pacotes rápido e eficiente |
| **[Docker](https://www.docker.com/)** | Containerização do PostgreSQL |
| **[Biome](https://biomejs.dev/)** | Linter e formatter ultra-rápido |
| **[tsx](https://github.com/privatenumber/tsx)** | TypeScript executor para Node.js |
| **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** | CLI para migrations e studio |

---

## Início Rápido

### Pré-requisitos

- **Node.js** 18+
- **pnpm** 10.15.0+
- **Docker** e Docker Compose

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd webhook-debugger
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cd api
   cp .env.example .env
   # Edite o .env e adicione suas credenciais
   ```

   Variáveis necessárias:
   ```env
   DATABASE_URL=postgresql://docker:docker@localhost:5432/webhooks
   GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-aqui
   PORT=3333
   NODE_ENV=development
   ```

4. **Inicie o banco de dados**
   ```bash
   docker compose up -d
   ```

5. **Execute as migrações**
   ```bash
   pnpm db:migrate
   ```

6. **Popule o banco com dados de exemplo** (opcional)
   ```bash
   pnpm db:seed
   ```

7. **Inicie os servidores de desenvolvimento**

   Terminal 1 (API):
   ```bash
   cd api
   pnpm dev
   ```

   Terminal 2 (Web):
   ```bash
   cd web
   pnpm dev
   ```

8. **Acesse a aplicação**
   - **Frontend**: http://localhost:5173
   - **API**: http://localhost:3333
   - **Documentação da API**: http://localhost:3333/docs
   - **Drizzle Studio**: `pnpm db:studio` (http://localhost:4983)

---

## Documentação

### Scripts Disponíveis

#### API (diretório `api/`)

```bash
pnpm dev          # Inicia o servidor em modo desenvolvimento com hot reload
pnpm start        # Inicia o servidor em produção
pnpm format       # Formata o código com Biome
pnpm db:generate  # Gera migrations do Drizzle a partir do schema
pnpm db:migrate   # Aplica migrations pendentes no banco de dados
pnpm db:studio    # Abre o Drizzle Studio (GUI para o banco)
pnpm db:seed      # Popula o banco com dados de exemplo usando Faker
```

#### Web (diretório `web/`)

```bash
pnpm dev          # Inicia o servidor Vite de desenvolvimento
pnpm build        # Compila TypeScript e gera build de produção
pnpm preview      # Preview do build de produção localmente
pnpm format       # Formata o código com Biome
```

### Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/webhooks` | Lista webhooks com paginação (cursor-based) |
| `GET` | `/api/webhooks/:id` | Obtém detalhes de um webhook específico |
| `DELETE` | `/api/webhooks/:id` | Deleta um webhook |
| `POST` | `/api/webhooks/generate-handler` | Gera código handler usando IA |
| `ANY` | `/capture/*` | Captura qualquer requisição como webhook |

**Documentação interativa**: http://localhost:3333/docs

### Capturando Webhooks

Para capturar um webhook, envie uma requisição para qualquer rota que comece com `/capture/`:

```bash
curl -X POST http://localhost:3333/capture/seu-webhook \
  -H "Content-Type: application/json" \
  -d '{"evento": "teste", "dados": "exemplo"}'
```

---

## Estrutura do Projeto

```
webhook-debugger/
├── api/                          # Backend (Fastify)
│   ├── src/
│   │   ├── controllers/          # Orquestração request/response
│   │   │   ├── webhook.controller.ts
│   │   │   └── generate-handler.controller.ts
│   │   ├── services/             # Lógica de negócio
│   │   │   ├── webhook.service.ts
│   │   │   └── generate-handler.service.ts
│   │   ├── repositories/         # Acesso a dados
│   │   │   └── webhook.repository.ts
│   │   ├── dto/                  # Schemas Zod e tipos
│   │   │   ├── webhook.dto.ts
│   │   │   └── generate-handler.dto.ts
│   │   ├── routes/               # Rotas HTTP (thin layer)
│   │   │   ├── capture-webhook.ts
│   │   │   ├── list-webhooks.ts
│   │   │   ├── get-webhook.ts
│   │   │   ├── delete-webhook.ts
│   │   │   └── generate-handler.ts
│   │   ├── lib/                  # Utilitários
│   │   │   └── container.ts      # Injeção de dependências
│   │   ├── db/
│   │   │   ├── migrations/       # Migrações SQL geradas
│   │   │   ├── schema/           # Schemas do Drizzle
│   │   │   │   └── webhooks.ts   # Schema da tabela webhooks
│   │   │   ├── index.ts          # Conexão do banco
│   │   │   └── seed.ts           # Script de seed
│   │   ├── env.ts                # Validação de variáveis de ambiente
│   │   └── server.ts             # Entry point do servidor
│   ├── docker-compose.yml        # Container PostgreSQL
│   ├── drizzle.config.ts         # Configuração do Drizzle
│   └── package.json
├── web/                          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Componentes reutilizáveis
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── code-block.tsx
│   │   │   │   └── icon-button.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── webhooks-list.tsx
│   │   │   ├── webhooks-list-item.tsx
│   │   │   ├── webhook-details.tsx
│   │   │   ├── webhook-detail-header.tsx
│   │   │   ├── section-title.tsx
│   │   │   └── section-data-table.tsx
│   │   ├── http/                 # Cliente HTTP (fetch wrapper)
│   │   ├── routes/               # File-based routing
│   │   │   ├── __root.tsx        # Layout raiz
│   │   │   ├── index.tsx         # Página inicial
│   │   │   └── webhooks.$id.tsx  # Detalhes do webhook
│   │   ├── main.tsx              # Entry point
│   │   ├── index.css             # Estilos globais (Tailwind)
│   │   └── routeTree.gen.ts      # Árvore de rotas (gerado)
│   ├── vite.config.ts
│   └── package.json
├── CLAUDE.md                     # Documentação para Claude Code
├── README.md                     # Este arquivo
├── package.json                  # Configuração do workspace
└── pnpm-workspace.yaml           # Configuração do monorepo
```

---

## Workflow de Desenvolvimento

### Modificando o Schema do Banco

1. Edite os arquivos de schema em `api/src/db/schema/`
2. Gere a migration: `pnpm db:generate`
3. Revise o SQL gerado em `api/src/db/migrations/`
4. Aplique a migration: `pnpm db:migrate`
5. Commite tanto o schema quanto as migrations

### Adicionando Novas Rotas (API)

1. Crie um arquivo em `api/src/routes/nome-da-rota.ts`
2. Exporte um `FastifyPluginAsyncZod`
3. Defina schemas Zod para validação
4. Registre a rota no `api/src/server.ts`

### Adicionando Novas Páginas (Web)

1. Crie um arquivo em `web/src/routes/` seguindo a convenção do TanStack Router
2. O `routeTree.gen.ts` será atualizado automaticamente
3. Componentes devem usar Tailwind CSS v4
4. Importe componentes reutilizáveis de `web/src/components/ui/`

---

## Arquitetura

### API - Arquitetura em Camadas

A API segue uma arquitetura em camadas (Layered Architecture) com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Routes (HTTP Layer)          │  ← Roteamento e validação
├─────────────────────────────────────┤
│         Controllers                  │  ← Orquestração HTTP
├─────────────────────────────────────┤
│         Services                     │  ← Lógica de negócio
├─────────────────────────────────────┤
│         Repositories                 │  ← Acesso a dados
├─────────────────────────────────────┤
│         Database (Drizzle ORM)       │
└─────────────────────────────────────┘
```

**Camadas**:

1. **Routes (HTTP Layer)**: Apenas roteamento e validação de schema com Zod. Delega para Controllers.
2. **Controllers**: Orquestração de request/response. Extrai dados, chama Services, formata resposta HTTP.
3. **Services**: Lógica de negócio e regras. Agnóstico de HTTP, pode ser usado em CLIs/jobs.
4. **Repositories**: Acesso a dados com Drizzle ORM. Queries isoladas, sem lógica de negócio.
5. **DTOs**: Schemas Zod compartilhados entre todas as camadas para type safety.

**Container**: Injeção de dependências manual com Singleton pattern para gerenciar instâncias.

**Vantagens**:
- Testabilidade: Services e Repositories facilmente testáveis sem HTTP
- Reusabilidade: Lógica pode ser reutilizada em diferentes contextos
- Manutenibilidade: Mudanças isoladas em cada camada
- Escalabilidade: Padrão consistente para adicionar features

**Stack Técnico**:
- Framework: Fastify com plugin de type provider Zod
- Validação: Schemas Zod em todas as camadas
- Documentação: Gerada automaticamente via schemas
- Database: PostgreSQL com Drizzle ORM
- IDs: UUIDv7 para ordenação temporal nativa
- IA: Vercel AI SDK com Google Gemini

### Web

- **Roteamento**: TanStack Router com file-based routing type-safe
- **State**: TanStack Query para cache e gerenciamento de requisições
- **UI**: Radix UI + Tailwind CSS v4 + tailwind-variants
- **Syntax Highlighting**: Shiki com temas do VS Code
- **Layout**: Painéis redimensionáveis para navegação e detalhes

---

## Monorepo (pnpm workspaces)

Este projeto usa **pnpm workspaces** para gerenciar múltiplos pacotes:

- Dependências compartilhadas são hoisted para a raiz
- Cada workspace (`api`, `web`) tem seu próprio `package.json`
- Use sempre `pnpm` (não `npm` ou `yarn`)
- Rode comandos nos workspaces navegando até a pasta específica

---

## Licença

ISC

---

<div align="center">

Desenvolvido com TypeScript e React

</div>
