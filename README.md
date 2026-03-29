# 🚀 SkillSync Core Backend API

The core business logic microservice for the **SkillSync Job Board Platform**.
Built with NestJS, this service handles user profiles, company management, job vacancies, applications, and acts as the central data source. It communicates with a Java API Gateway via HTTP and Kafka.

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (v11)
- **Database & ORM:** PostgreSQL + [Prisma](https://www.prisma.io/) (v7)
- **Message Broker:** [Kafka](https://kafka.apache.org/) (for asynchronous events)
- **Validation:** `class-validator` & `class-transformer`
- **Documentation:** Swagger (OpenAPI)

## 🏗️ Architecture & Authentication

This service is designed to run behind an **API Gateway**.
It **does not** handle JWT verification directly. Instead, it trusts the API Gateway to authenticate users and pass the user context via HTTP Headers:

- `x-user-id`: UUID of the authenticated user.
- `x-user-role`: The global role of the user (e.g., `APPLICANT` or `EMPLOYER`).

*Custom Decorators (`@CurrentUser`, `@Roles`) and Guards (`RolesGuard`) are used across controllers to enforce Role-Based Access Control (RBAC).*

## 📦 Core Modules

- **`Users`**: Applicant and recruiter profiles. Listens to Kafka `topic-registration` for new users.
- **`Companies`**: Company CRUD, joining requests, and employer management.
- **`Vacancies`**: Job postings with advanced filtering, pagination, and relation to skills/languages.
- **`Applications`**: Inbound job applications, outbound recruiter invitations, and status tracking.
- **`Dictionaries`**: Static catalogs (Skills, Languages, Categories).

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Kafka broker (e.g., Aiven or local docker container)

### 2. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/skillsync?schema=public"

# Kafka Configuration
KAFKA_BROKER="your-kafka-broker-url:port"
KAFKA_GROUP_ID="skillsync-nestjs-group"
```

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Push schema to the database (if not using migrations yet)
npm run prisma:push

# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

📚 API Documentation (Swagger)

Once the application is running, the interactive OpenAPI documentation is available at:
👉 http://localhost:3000/api/docs

You can test endpoints directly from the browser. To emulate the API Gateway, simply provide the x-user-id and x-user-role headers in the Swagger UI.
📜 Available Scripts

    npm run start:dev - Start application in watch mode.

    npm run prisma:studio - Open Prisma Studio to view/edit database records graphically.

    npm run prisma:generate - Re-generate Prisma Client after schema changes.

    npm run prisma:push - Sync database schema with schema.prisma.

    npm run seed - Populate the database with initial/mock data (skills, languages, etc.).

    npm run lint - Run ESLint.