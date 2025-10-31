<div align="center">

# Webhook Debugger

> Capture, inspecione e debuge requisições de webhooks em tempo real

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

</div>

---

## 📋 Sobre

Webhook Debugger é uma ferramenta para capturar e inspecionar requisições de webhooks, facilitando o desenvolvimento e debugging de integrações com APIs externas.

## ✨ Tecnologias

### Backend
- **[Fastify](https://fastify.dev/)** - Framework web de alta performance
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe para PostgreSQL
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional

### Ferramentas
- **[Docker](https://www.docker.com/)** - Containerização
- **[Biome](https://biomejs.dev/)** - Linter e formatter
- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes
- **[Swagger/Scalar](https://scalar.com/)** - Documentação interativa da API

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- pnpm 10.20.0+
- Docker e Docker Compose

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
   ```

4. **Inicie o banco de dados**
   ```bash
   docker compose up -d
   ```

5. **Execute as migrações**
   ```bash
   cd api
   pnpm db:generate
   pnpm db:migrate
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm dev
   ```

O servidor estará rodando em `http://localhost:3333`

---

## 📚 Uso

### Documentação da API

Acesse a documentação interativa em:
- **Scalar UI**: `http://localhost:3333/docs`

### Scripts Disponíveis

#### API
```bash
pnpm dev          # Inicia o servidor em modo desenvolvimento
pnpm start        # Inicia o servidor em produção
pnpm format       # Formata o código com Biome
pnpm db:generate  # Gera migrations do Drizzle
pnpm db:migrate   # Executa migrations
pnpm db:studio    # Abre o Drizzle Studio
```

---

## 🏗️ Estrutura do Projeto

```
webhook-debugger/
├── api/              # Backend (Fastify)
│   ├── src/
│   │   ├── routes/   # Rotas da API
│   │   ├── db/       # Configuração do banco
│   │   └── server.ts # Entry point
│   └── drizzle/      # Migrations
├── web/              # Frontend (em desenvolvimento)
└── docker-compose.yml
```

---

## 🔧 Desenvolvimento

Este projeto utiliza um monorepo gerenciado pelo pnpm workspaces.

### Formatação de Código

```bash
pnpm format
```

### Banco de Dados

Para gerenciar o schema do banco de dados:

```bash
pnpm db:studio  # Abre interface visual do Drizzle Studio
```

---

## 📝 Licença

ISC

---

<div align="center">

Feito com TypeScript e ❤️

</div>
