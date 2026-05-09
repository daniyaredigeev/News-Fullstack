<div align="center">

# 🏠 ZhKH KZ — Kazakhstan Housing News Portal

**A fullstack application for publishing housing & utilities news and submitting complaints**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

[🚀 Live Demo](https://your-app.vercel.app) · [📖 API Docs](https://your-api.onrender.com/docs) · [🐛 Report a Bug](https://github.com/daniyaredigeev/News-Fullstack/issues)

</div>

---

## 📸 Screenshots

<div align="center">

| Home Page | Article Page |
|:---:|:---:|
| ![Home](./public/screenshots/home.png) | ![Article](./public/screenshots/article.png) |

| Admin Dashboard | Complaint Form |
|:---:|:---:|
| ![Admin](./public/screenshots/admin.png) | ![Complaint](./public/screenshots/complaint.png) |

</div>

---

## ✨ Features

### For Users
- 📰 News feed with filtering by **city**, **category**, and **tags**
- 🔍 Full-text search across title and content
- ❤️ Likes and comments on articles
- 📋 Submit housing complaints (anonymously or authenticated)
- 👤 Personal profile page

### For Admins
- ✍️ Create, edit, and delete news articles
- 🖼️ Image upload via Cloudinary
- 📊 View and manage submitted complaints
- 👥 User management and role assignment *(Super Admin only)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| Auth | JWT (httpOnly cookie + localStorage) |
| HTTP Client | Fetch API (custom wrapper with refresh token) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
news-front/
├── src/
│   ├── app/                    # App Router — pages
│   │   ├── page.tsx            # Home — news feed
│   │   ├── news/[slug]/        # Article detail page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── profile/            # User profile
│   │   ├── complaint/          # Complaint submission form
│   │   └── admin/              # Admin panel
│   │       ├── page.tsx        # Dashboard
│   │       ├── news/           # News management
│   │       ├── complaints/     # Complaints management
│   │       └── users/          # User management
│   ├── components/             # Reusable React components
│   ├── contexts/               # React Context (AuthContext)
│   ├── lib/                    # API client, utilities
│   ├── middleware.ts            # Private route protection
│   └── types/                  # TypeScript types & interfaces
└── .env.local                  # Environment variables (not in git!)
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/daniyaredigeev/News-Fullstack.git
cd News-Fullstack/news-front
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3001**

---

## 🔐 User Roles

| Role | Permissions |
|------|------------|
| `USER` | Read articles, like, comment, submit complaints |
| `ADMIN` | All above + create/edit/delete **own** articles |
| `SUPER_ADMIN` | All above + edit any article + manage users |

---

## 🗺️ Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | News feed with filters and pagination | Public |
| `/news/[slug]` | Article detail page | Public |
| `/complaint` | Complaint submission form | Public |
| `/login` | Login page | Guest |
| `/register` | Registration page | Guest |
| `/profile` | User profile | USER+ |
| `/admin` | Admin dashboard | ADMIN+ |
| `/admin/news` | All articles including drafts | ADMIN+ |
| `/admin/news/create` | Create new article | ADMIN+ |
| `/admin/news/[id]/edit` | Edit article | ADMIN+ |
| `/admin/complaints` | View complaints | ADMIN+ |
| `/admin/users` | User management | SUPER_ADMIN |

---

## 🔗 Related Repository

The backend (NestJS) is located in [`../news-back`](../news-back/README.md).

---

## 🤖 AI Tools

**Claude (Anthropic)** was used during development for:
- Generating components and pages
- Debugging TypeScript errors
- Designing the API client architecture

All generated code was reviewed, adapted, and understood by the author.

---

## 👤 Author

**Daniyar Yedigeyev** — [github.com/daniyaredigeev](https://github.com/daniyaredigeev)

---

<div align="center">
Built as a Capstone Project | Fullstack Next.js + PostgreSQL
</div>