# Bespoke — Full-Stack AI Resume & LinkedIn Outreach SaaS

**Bespoke** is a full-stack SaaS web application designed for job seekers and recruiters. It transforms resumes into ATS-optimized, high-impact resumes tailored specifically to any job description, generates personalized LinkedIn outreach messages, securely saves generation history in a PostgreSQL database, and enforces monthly free tier rate limits.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Next.js 14 App Router /client (/login, /signup, /dashboard, /generate)"]
    Cookie["httpOnly JWT Cookie"]
    Server["NestJS SaaS API Server /server"]
    Prisma["Prisma ORM"]
    DB[("PostgreSQL Database (Supabase / Render / Local)")]
    Gemini["Google Gemini 2.5 Flash API"]

    Client -->|1. Sign Up / Log In / Log Out| Server
    Server -->|2. Issue httpOnly JWT Cookie| Cookie
    Cookie -->|3. Attached to API requests| Client
    Client -->|4. POST /api/generate with JWT| Server
    Server -->|5. MonthlyUsageGuard checks DB count| Prisma
    Prisma --> DB
    Server -->|6. Server-Side AI Prompt| Gemini
    Gemini -->|"7. Structured JSON Output"| Server
    Server -->|8. Persist Generation Record| Prisma
    Server -->|9. Return Result| Client
    Client -->|10. GET /api/me (Profile + Stats + History)| Server
```

---

## 🛠️ Tech Stack & Features

- **Frontend (`/client`)**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide icons, `pdfjs-dist` for client-side PDF/TXT resume text parsing.
- **Backend (`/server`)**: NestJS (TypeScript), Prisma ORM, Passport & JWT authentication with `httpOnly` secure cookies, bcrypt password hashing.
- **Database**: PostgreSQL (hosted on Supabase, Render, or Docker).
- **AI Engine**: Google Gemini 2.5 Flash API via `@google/generative-ai` with server-side prompt engineering. Zero API keys in browser.
- **Rate Limiting**: Database-backed `MonthlyUsageGuard` capping Free plan users to 3 generations per calendar month.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (v24 tested)
- **PostgreSQL**: Local Postgres instance, Docker (`postgres:latest`), or a free [Supabase](https://supabase.com) project.
- **Google Gemini API Key**: Free at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Backend Setup (`/server`)

1. Open a terminal and navigate to `/server`:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Set the environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bespoke_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   GEMINI_MODEL="gemini-2.5-flash"
   ```
5. Push the database schema:
   ```bash
   npx prisma db push
   ```
6. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   The backend API will run on `http://localhost:3001/api`.

### 3. Frontend Setup (`/client`)

1. Open a second terminal and navigate to `/client`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Set `NEXT_PUBLIC_API_URL`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000`.

---

## ☁️ Production Deployment Guide

### Step 1: Database Setup on Supabase

1. Go to [Supabase](https://supabase.com) and create a free project.
2. In the Supabase dashboard, go to **Project Settings** -> **Database**.
3. Under **Connection string**, select **URI** (or Transaction Pooler).
4. Copy your connection URI (e.g. `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`).

---

### Step 2: Deploy Backend (`/server`) to Render

1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your repository.
4. Configure service settings:
   - **Name**: `bespoke-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm run start:prod` (or `npx prisma db push && npm run start:prod`)
   - **Plan**: `Free`
5. Add Environment Variables in Render:
   - `DATABASE_URL`: *(Your Supabase connection string)*
   - `JWT_SECRET`: *(A random 32+ character secret string)*
   - `GEMINI_API_KEY`: *(Your Google AI Studio API key)*
   - `FRONTEND_URL`: `https://your-bespoke-app.vercel.app` *(Your Vercel URL)*
   - `PORT`: `10000` (or leave default, Render sets this automatically)
6. Click **Deploy Web Service** and copy your backend URL (e.g., `https://bespoke-api.onrender.com`).

---

### Step 3: Deploy Frontend (`/client`) to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Next.js`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://bespoke-api.onrender.com` *(Your Render backend URL)*
5. Click **Deploy**.
6. Once deployed, update `FRONTEND_URL` in your Render backend settings with your live Vercel domain!

---

## 🔒 Security & Privacy Architecture

- **Zero Browser API Key Exposure**: The Gemini API key is never exposed to the client. All AI generation requests pass through the NestJS backend.
- **httpOnly Cookies**: JWT authentication tokens are sent and stored strictly in `httpOnly`, `sameSite`, secure cookies to prevent XSS attacks.
- **Database-Backed Monthly Quotas**: Free accounts are limited to 3 generations per calendar month, enforced by `MonthlyUsageGuard` querying PostgreSQL.
- **Client-Side PDF Extraction**: Uploaded `.pdf` and `.txt` files are parsed directly in the browser via `pdfjs-dist` without storing raw binary files on the server.

---

## 📄 License
MIT License.
