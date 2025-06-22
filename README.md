<a href="https://workatime.vercel.app/" target="_blank" rel="noopener">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/banner-dark.png" />
      <img alt="Workatime Banner" src="./assets/banner.png" />
    </picture>
</a>

---

<div align="center">
	<h3>Track time spent on your hardware projects,<br />offline activities and tasks.</h3>
	<a href="https://x.com/snehasishcodes">
    	<img alt="X/Twitter" src="https://img.shields.io/twitter/url.svg?label=%40snehasishcodes&style=social&url=https%3A%2F%2Ftwitter.com%2Fsnehasishcodes" />
  	</a>
</div>

## Content
- [📗 Introduction](#-introduction)
	- [❓ How It Works](#-how-it-works)
	- [❕ Purpose](#-purpose)
- [🔖 Getting Started](#-getting-started)
	- [📚 Tech Stack](#-tech-stack)
	- [🧠 Prerequisites](#-prerequisites)
- [🧰 Development](#-development)
	- [⬇️ Install Packages](#️-install-packages)
	- [*️⃣ Environment Variables](#️⃣-environment-variables)
	- [🔄 Sync DB](#-sync-db)
	- [🟡 Run Development Server](#-running-development-nextjs-server)
	- [🔵 Build and Run](#-build-and-run)
- [🌟 Deploying to Production](#-deploying-to-production)
- [👏🏻 Acknowledgement](#-acknowledgement)
- []()

## 📗 Introduction

Workatime analyzes your live camera feed to automatically track time spent on hardware projects and other offline tasks.

### ❓ How It Works

- 📥&nbsp; Login with Slack (HackClub)
- 📷&nbsp; Allow camera access
- ✍🏻&nbsp; Set your activity details
- 📹&nbsp; (optional) Enable session recording
- ✅&nbsp; Start tracking your activitY


### ❕ Purpose

The main goal of this project is to help track the time spent on hardware projects made at [HackClub](https://hackclub.com). Right now, there’s no easy way to record those hours, so some time goes uncounted and unrewarded during events. This project aims to fix that (atleast tries to).


## 🔖 Getting Started

This is a guide on how to self-host this project, if you wish to.

### 📚 Tech Stack

- [Next.js](https://nextjs.org)
- [PNPM](https://pnpm.io)
- [Vercel AI SDK](https://ai-sdk.com)
- [Zod](https://zod.dev)
- [Zustand](https://zustand.docs.pmnd.rs)
- [Drizzle ORM](https://orm.drizzle.team)
- [NeonDB](https://neon.com) (PostgreSQL)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [Next Themes](https://www.npmjs.com/package/next-themes)
- [Lucide Icons](https://lucide.dev/icons)

### 🧠 Prerequisites

Experience with/and: Next.js, PNPM (package manager), Node.js, Vercel AI SDK, Google Generative AI, Zod (schema validation), Zustand (global state management), PostgreSQL, Drizzle ORM, NeonDB, and Tailwind CSS.

## 🧰 Development

### ⬇️ Install Packages
```bash
pnpm i
```

### *️⃣ Environment Variables
- Create `.env` file at root (not inside any directory)
- Make sure the file is named `.env` and not `.env.local` or others
- Paste this and replace the values with respective secret variables
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

SLACK_CLIENT_ID="--slack-client-id--"
SLACK_CLIENT_SECRET="--slack-client-secret"
SLACK_REDIRECT_URI="--slack-redirect-uri--"

JWT_SECRET="--random-jwt-secret--"

DATABASE_URL="--neon-db-connection-url--"

GOOGLE_GENERATIVE_AI_API_KEY="--google-generative-ai-api-key--"
```
- Useful Links: [Google GenAI API Key](https://aistudio.google.com/app/apikey) | [NeonDB](https://neon.com) | [Slack Apps](https://api.slack.com/apps)

### 🔄 Sync DB
Incase of database schema changes (`/src/db/schema.ts`) run:
```bash
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit push
```

### 🟡 Running Development Next.js Server
```bash
pnpm run dev
```

### 🔵 Build and Run
```bash
pnpm run build
pnpm run start
```

## 🌟 Deploying to Production

Deploy to [Vercel](https://vercel.com) - it's easy AF. Actual deploying guide will be coming soon.

- Reminder: Do not forget to setup Environment Variables before deploying 😂

## 👏🏻 Acknowledgement
GitHub README inspired from [tRPC README](https://github.com/tRPC/tRPC)

## Sponsor Me
Don't (/j) https://buymeacoffee.com/snehasish or just `snehasishlol@fam`