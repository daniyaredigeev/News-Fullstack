<div align="center">

# 🏠 ZhKH KZ — Backend API

**REST API for the Kazakhstan Housing & Utilities News Portal**

[![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85ea2d?style=for-the-badge&logo=swagger)](https://swagger.io/)

[📖 Swagger UI](https://your-api.onrender.com/docs) · [🌐 Frontend](https://your-app.vercel.app) · [🐛 Report a Bug](https://github.com/daniyaredigeev/News-Fullstack/issues)

</div>

---

## ✨ API Features

- 🔐 **Authentication** — JWT (Access Token + Refresh Token in httpOnly cookie)
- 🛡️ **Authorization** — Role-based access (USER / ADMIN / SUPER_ADMIN) via global Guards
- 📰 **News** — full CRUD with pagination, full-text search, and filters
- ❤️ **Likes** — toggle mechanism, uniqueness enforced via composite unique constraint
- 💬 **Comments** — add and delete with author info
- 📋 **Complaints** — anonymous and authenticated submissions, admin-only review
- 🖼️ **Image Upload** — Cloudinary via multipart/form-data
- 👥 **Users** — role management and account deletion (SUPER_ADMIN only)
- 🏙️ **Cities** — 20 Kazakhstan cities/regions (reference table)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL 16 |
| Authentication | Passport.js + passport-jwt + @nestjs/jwt |
| File Upload | Multer + Cloudinary SDK v2 |
| Documentation | Swagger / OpenAPI 3.0 |
| Validation | class-validator + class-transformer |
| Deployment | Render / Railway |

---

## 📁 Project Structure

```
news-back/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script (20 cities)
│   └── migrations/             # Migration history
├── src/
│   ├── main.ts                 # Entry point — Swagger, CORS, cookie-parser
│   ├── app.module.ts           # Root module
│   ├── generated/prisma/       # Generated Prisma Client
│   ├── auth/                   # Authentication (JWT + Passport)
│   │   ├── strategies/         # JwtStrategy
│   │   ├── guards/             # JwtGuard, RolesGuard
│   │   ├── decorators/         # @Public, @Roles, @Authorized
│   │   ├── dto/                # LoginDto, RegisterDto
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── news/                   # News (main entity)
│   ├── city/                   # Cities reference
│   ├── like/                   # Likes
│   ├── comment/                # Comments
│   ├── complaint/              # Complaints
│   ├── upload/                 # Image upload
│   ├── users/                  # User management
│   └── prisma/                 # PrismaModule (DB connection service)
└── uploads/                    # Static files (if not using Cloudinary)
```

---

## 🗄️ Database Schema

```
User ──────┬──── Article   (1:N)
           ├──── Like      (1:N)  ←── Article (N:M via Like)
           ├──── Comment   (1:N)  ←── Article
           └──── Complaint (1:N)

City ──────┬──── Article   (1:N)
           └──── Complaint (1:N)
```

**Tables:** `User`, `City`, `Article`, `Like`, `Comment`, `Complaint`

---

## 📡 API Endpoints

### Auth
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/logout` | Logout | Authenticated |
| POST | `/auth/refresh` | Refresh access token | Public |
| GET | `/auth/me` | Get current user profile | Authenticated |

### News
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/news` | Published news feed (filters, pagination) | Public |
| GET | `/news/:slug` | Single article + increment view count | Public |
| GET | `/news/admin/all` | All articles including drafts | ADMIN+ |
| GET | `/news/admin/one/:id` | Single article by ID | ADMIN+ |
| POST | `/news` | Create article | ADMIN+ |
| PATCH | `/news/:id` | Update article | ADMIN+ |
| DELETE | `/news/:id` | Delete article | ADMIN+ |

### Other
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/cities` | List all cities | Public |
| POST | `/upload/image` | Upload image to Cloudinary | ADMIN+ |
| POST | `/like/:articleId` | Toggle like | USER+ |
| GET | `/like/:articleId/me` | Check if current user liked | USER+ |
| GET | `/comment/:articleId` | Get article comments | Public |
| POST | `/comment/:articleId` | Add comment | USER+ |
| DELETE | `/comment/:id` | Delete comment | USER+ |
| POST | `/complaint` | Submit complaint (anonymous) | Public |
| POST | `/complaint/auth` | Submit complaint (authenticated) | USER+ |
| GET | `/complaint` | List complaints | ADMIN+ |
| GET | `/users` | List all users | SUPER_ADMIN |
| PATCH | `/users/:id/role` | Change user role | SUPER_ADMIN |
| DELETE | `/users/:id` | Delete user | SUPER_ADMIN |

> 📖 Full interactive documentation is available at `/docs`

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/daniyaredigeev/News-Fullstack.git
cd News-Fullstack/news-back
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zkhkz"
JWT_SECRET="your-super-secret-key-minimum-32-characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
CORS_ORIGIN="http://localhost:3001"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 4. Run migrations and seed the database

```bash
# Apply migrations
npx prisma migrate dev

# Seed 20 Kazakhstan cities
npm run seed
```

### 5. Start the server

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run start:prod
```

API will be available at **http://localhost:3000**
Swagger UI: **http://localhost:3000/docs**

---

## 🔐 Authentication Flow

```
Client → POST /auth/login
            ↓
     NestJS verifies email + bcrypt(password)
            ↓
     Generates:
     • Access Token  (JWT, 15 min) → returned in response body
     • Refresh Token (JWT, 7 days) → set as httpOnly cookie
            ↓
Client stores access token in localStorage
Client sends: Authorization: Bearer <access_token>
            ↓
On 401 → automatically requests POST /auth/refresh
```

---

## 🤖 AI Tools

**Claude (Anthropic)** was used during development for:
- Generating NestJS modules (services, controllers, DTOs)
- Designing the Prisma schema and relations
- Debugging errors and architectural decisions

All generated code was reviewed, adapted, and understood by the author.

---

## 👤 Author

**Daniyar Yedigeyev** — [github.com/daniyaredigeev](https://github.com/daniyaredigeev)

---

<div align="center">
Built as a Capstone Project | Fullstack Next.js + PostgreSQL
</div>