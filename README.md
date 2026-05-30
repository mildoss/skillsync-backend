# SkillSync Backend - Core Service

A robust TypeScript-based core backend API built with NestJS, Prisma ORM, and PostgreSQL for the SkillSync Job Board platform.

## Overview

The SkillSync Core Backend Service is the central monolithic hub of the SkillSync ecosystem. It handles primary business logic, user and company management, job postings (vacancies), applications, and real-time communications. It provides a structured RESTful API and integrates with other microservices (Payment, AI) via an asynchronous event-driven architecture using Kafka.

## Features

- **Core Business Logic**: Comprehensive management of users, companies, vacancies, and job applications.
- **Real-time Communication**: Built-in WebSockets (Socket.io) for real-time chats and system notifications.
- **Database Management**: PostgreSQL integration via Prisma ORM for robust, type-safe data modeling.
- **Microservices Integration**: Kafka messaging for event-driven asynchronous communication with AI and Payment services.
- **Media Management**: Cloudinary integration for handling file and image uploads.
- **Authentication & Authorization**: Secure JWT-based authentication and Role-Based Access Control (RBAC).
- **API Documentation**: Automated Swagger UI integration for clear endpoint exploration.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | NestJS 11.0.1 |
| Language | TypeScript |
| ORM | Prisma 7.4.2 |
| Database | PostgreSQL |
| Message Queue | Kafka (KafkaJS 2.2.4) |
| Real-time | Socket.io |
| Media Storage | Cloudinary |
| Build Tool | TypeScript Compiler / Nest CLI |

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- PostgreSQL database instance
- Kafka cluster
- Cloudinary account credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mildoss/skillsync-backend.git
cd skillsync-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and configure the necessary variables:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/skillsync?schema=public"
KAFKA_BROKER=localhost:9092
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

4. Run database migrations and generate the Prisma client:

```bash
npx prisma generate
npx prisma migrate dev
```

## Usage

### Development

Start the development server with hot reload:

```bash
npm run start:dev
```

The service starts on `http://localhost:3000` by default. API documentation (Swagger) is available at `http://localhost:3000/api`.

### Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start:prod
```

## Core Domains & Endpoints

The API is logically divided into several domains. Full documentation is available via Swagger UI when the server is running.

| Endpoint | Description |
|---|---|
| `/users` | User profile and account management |
| `/companies` | Company profiles and employer operations |
| `/vacancies` | Job postings and search filters |
| `/applications` | Job applications and candidate tracking |
| `/chats` | Real-time messaging (REST & WebSockets) |
| `/notifications` | System and user notifications |
| `/media` | File and image upload handling |
| `/ai` | AI generate service |
| `/dictionaries` | Static data and dropdown values |

## Project Structure

```
src/
├── auth/                 # Authentication & Guards (JWT, RBAC)
├── users/                # User management module
├── companies/            # Company management module
├── vacancies/            # Vacancies module
├── applications/         # Job applications module
├── chats/                # WebSocket gateways & chat logic
├── media/                # Cloudinary uploads integration
├── notifications/        # System notifications module
├── ai/                   # AI service integration logic
├── payments/             # Payment service integration logic
├── dictionaries/         # Get dictionaries   
├── prisma.service.ts     # Database connection service
└── main.ts               # Application entry point
```

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start development server with watch mode |
| `npm run build` | Compile the NestJS application |
| `npm run start:prod` | Start production server |
| `npm run lint` | Run ESLint to analyze the code |
| `npm run format` | Run Prettier to format the code |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

## Development Guidelines

- **Architecture**: The project follows NestJS modular architecture. Keep domain logic isolated in respective modules.
- **Database**: All schema changes must be made via `prisma/schema.prisma`. Run `npx prisma migrate dev` after any changes.
- **Typing**: Use strict typing. DTOs (Data Transfer Objects) must use `class-validator` and `class-transformer` for input validation.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is UNLICENSED — see the `package.json` file for details.

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/mildoss/skillsync-backend).

## Related Projects

This is the core service of the SkillSync platform ecosystem. Other services include:

- [SkillSync Backend - AI Service](https://github.com/mildoss/skillsync-backend-ai)
- [SkillSync Backend - Payment Service](https://github.com/mildoss/skillsync-backend-payment)
- [SkillSync Backend - Auth Service](https://github.com/Eugene-Stellar/SkillSync-auth-service)
- [SkillSync Frontend](https://github.com/mildoss/skillsync-frontend)

---

*Last Updated: 2026-05-29*