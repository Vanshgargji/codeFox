<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->


# Code Fox 🦊

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://codefoxy.vercel.app)

![Code Fox Logo](./public/code_fox_logo.png)

**Code Fox** is an intelligent, AI-powered code review assistant designed to streamline your development workflow. By connecting directly with your GitHub repositories, Code Fox automatically analyzes pull requests, providing instant, context-aware feedback to help maintain code quality and catch issues early.

## 🚀 Key Features

*   **🤖 AI-Powered Code Reviews:** Leverages advanced LLMs (via Vercel AI SDK) to provide deep, meaningful code analysis on every PR.
*   **🧠 RAG Context Awareness:** Utilizes Pinecone and Retrieval-Augmented Generation (RAG) to understand the full context of your codebase, not just the diff.
*   **🔗 Seamless GitHub Integration:** Connects easily with your GitHub account to import repositories and monitor pull requests automatically.
*   **📊 Interactive Dashboard:** A comprehensive overview of your repositories, review history, and coding activity.
*   **💳 Subscription Management:** Integrated with **Polar.sh** for seamless subscription handling and usage limits.
*   **⚡ Real-time Updates:** Powered by Inngest for reliable background job processing and event handling.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Shadcn UI](https://ui.shadcn.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
*   **Authentication:** [Better Auth](https://better-auth.com/)
*   **AI & Vector:** [Vercel AI SDK](https://sdk.vercel.ai/), [Pinecone](https://www.pinecone.io/)
*   **Background Jobs:** [Inngest](https://www.inngest.com/)
*   **Payments:** [Polar.sh](https://polar.sh/)
*   **State Management:** [TanStack Query](https://tanstack.com/query/latest)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend                               │
│           (Next.js 16 App Router + React 19 + TypeScript)      │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │   Pages / UI    │  │  TanStack Query  │  │  Shadcn UI   │  │
│  │  (dashboard,    │  │  (Server State   │  │  + Radix UI  │  │
│  │  repos, reviews)│  │   Management)    │  │  Components  │  │
│  └─────────────────┘  └──────────────────┘  └──────────────┘  │
│                    │              │                             │
│                    └──────────────┘                             │
│                           │                                     │
│                   [Next.js Server Actions]                      │
└───────────────────────────┼─────────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
┌──────────▼──────┐ ┌───────▼───────┐ ┌──────▼──────────┐
│   Auth Layer    │ │  API Routes   │ │  Inngest Jobs   │
│  (Better Auth   │ │  /api/auth    │ │  (Background    │
│  + GitHub OAuth)│ │  /api/inngest │ │   Processing)   │
│                 │ │  /api/webhooks│ │                 │
└──────────┬──────┘ └───────┬───────┘ └──────┬──────────┘
           │                │                │
           └────────────────┼────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
┌──────────▼──────┐ ┌───────▼───────┐ ┌──────▼──────────┐
│   PostgreSQL    │ │   Pinecone    │ │  External APIs  │
│  (Prisma ORM)   │ │  (Vector DB   │ │  - GitHub API   │
│  Users, Repos,  │ │   for RAG)    │ │  - Google Gemini│
│  Reviews, Usage │ │               │ │  - Polar.sh     │
└─────────────────┘ └───────────────┘ └─────────────────┘
```

## 📈 Retrieval Performance Metrics

CodeFox uses a Pinecone-backed Semantic Code RAG pipeline to retrieve repository context before generating pull request reviews.

📄 **Detailed Benchmark Report:** [View Metrics](metrics.md)

### Highlights

- **100% Hit Rate** across 2 evaluation datasets.
- **95.2% Recall** for repository-scale semantic code retrieval.
- **2.32s Average Retrieval Latency**.
- **Full Repository Indexing** using Pinecone vector embeddings.
- **Context-Aware PR Reviews** powered by Retrieval-Augmented Generation (RAG).

## 🗄️ Database Architecture

The relational schema and table relationships for this project are fully documented and can be viewed interactively here:
👉 **[View CodeFox Database Documentation](https://dbdocs.io/vansgarg55/CodeFox)**

### Data Flow

1.  **GitHub Webhook**: A `pull_request` event (`opened` or `synchronize`) is sent to `/api/webhooks/github`
2.  **Trigger Review**: The webhook handler calls `reviewPullRequest()` asynchronously via Inngest
3.  **RAG Context**: Relevant code snippets are retrieved from Pinecone using embeddings
4.  **AI Analysis**: PR diff + codebase context is sent to Google Gemini via Vercel AI SDK
5.  **Post & Save**: The generated review is posted as a GitHub comment and saved to PostgreSQL
6.  **Dashboard Update**: TanStack Query refetches updated stats and reviews on the dashboard

## 📂 Project Structure

```
codeFox/
├── prisma/
│   ├── schema.prisma              # DB models: User, Repository, Review, UserUsage
│   └── migrations/                # Prisma migration history
├── src/
│   ├── app/
│   │   ├── globals.css            # Global styles (Tailwind v4)
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing / home page
│   │   ├── (auth)/
│   │   │   └── login/page.tsx     # Login page
│   │   ├── api/
│   │   │   ├── auth/[...all]/     # Better Auth handler
│   │   │   ├── inngest/           # Inngest event endpoint
│   │   │   └── webhooks/github/   # GitHub webhook receiver
│   │   └── dashboard/
│   │       ├── layout.tsx         # Dashboard shell with sidebar
│   │       ├── page.tsx           # Main dashboard (stats + charts)
│   │       ├── repository/        # GitHub repo import & management
│   │       ├── reviews/           # AI-generated review listing
│   │       ├── settings/          # Profile & connected repos
│   │       └── subscriptions/     # Plan & usage management
│   ├── components/
│   │   ├── app-sidebar.tsx        # Main navigation sidebar
│   │   ├── ai-elements/           # Custom AI interaction components
│   │   ├── providers/
│   │   │   ├── query-provider.tsx # TanStack Query setup
│   │   │   └── theme-providers.tsx
│   │   └── ui/                    # Shadcn UI component library
│   ├── inngest/
│   │   ├── client.ts              # Inngest client configuration
│   │   └── functions/
│   │       ├── index.ts           # Registers: indexRepo, generateReview
│   │       └── review.ts          # Core review generation job
│   ├── lib/
│   │   ├── auth.ts                # Better Auth configuration
│   │   ├── auth-client.ts         # Client-side auth helpers
│   │   ├── db.ts                  # Prisma client instance
│   │   ├── pinecone.ts            # Pinecone vector DB client
│   │   └── utils.ts               # Shared utilities
│   ├── hooks/
│   │   └── use-mobile.ts
│   └── modules/                   # Feature-specific business logic
│       ├── ai/
│       │   ├── actions/index.ts   # reviewPullRequest() server action
│       │   └── lib/rag.ts         # RAG retrieval logic
│       ├── auth/
│       │   ├── components/        # LoginUI, Logout
│       │   ├── dashboard/         # Stats actions + ContributionGraph
│       │   ├── github/lib/        # GitHub API helpers (Octokit)
│       │   └── utils/auth-utils.ts
│       ├── payment/
│       │   ├── actions/           # Subscription server actions
│       │   ├── config/polar.ts    # Polar.sh client config
│       │   └── lib/subscription.ts
│       ├── repository/
│       │   ├── actions/           # Connect / disconnect repo actions
│       │   ├── components/        # RepositorySkeleton
│       │   └── hooks/             # useRepositories, useConnectRepository
│       ├── review/
│       │   └── actions/           # Fetch reviews server actions
│       └── settings/
│           ├── actions/           # Profile update actions
│           └── components/        # ProfileForm, RepositoryList, SettingsPageClient
```

## ⚙️ Environment Variables

### Required Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth sessions | ✅ Yes |
| `BETTER_AUTH_URL` | Base URL of the application | ✅ Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID | ✅ Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret | ✅ Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key for AI reviews | ✅ Yes |
| `PINECONE_API_KEY` | Pinecone API key for vector storage | ✅ Yes |
| `INNGEST_EVENT_KEY` | Inngest event key for background jobs | ✅ Yes |
| `INNGEST_SIGNING_KEY` | Inngest signing key for webhook verification | ✅ Yes |
| `POLAR_ACCESS_TOKEN` | Polar.sh access token for subscriptions | ✅ Yes |

## 🚧 Error Handling

The application handles various error scenarios gracefully:

- **Unauthenticated Access**: `requireAuth()` in the dashboard layout redirects unauthenticated users to the login page.
- **GitHub Webhook Errors**: The webhook handler wraps processing in try/catch and returns a 500 with a JSON error without leaking stack traces.
- **Failed AI Reviews**: Review generation errors are caught and logged; the PR review job fails gracefully without crashing the server.
- **Repository Disconnect**: Mutation errors in the settings page surface user-friendly toast messages via Sonner.
- **Subscription Limits**: Usage is tracked per user (`UserUsage` model) and enforced before allowing new repo connections or reviews.
- **Database Cascades**: Deleting a user cascades to sessions, accounts, repositories, and reviews — preventing orphaned records.

## 🎨 Code Quality Features

- **Strict TypeScript**: Full type safety across the entire codebase with no implicit `any`.
- **Modular Architecture**: Feature logic is isolated in `modules/` — each feature owns its actions, components, and hooks.
- **Server Actions**: Data mutations use Next.js Server Actions instead of ad-hoc API routes, keeping the client lean.
- **TanStack Query**: All server state is managed with `useQuery` and `useMutation` with proper cache invalidation after every mutation.
- **Prisma ORM**: Type-safe database access with auto-generated types from the schema.
- **Component Separation**: No business logic in JSX — components delegate to server actions and hooks.
- **Tailwind CSS v4**: Utility-first styling with CSS variables for consistent theming across light/dark modes.

## 🔄 Tradeoffs & Limitations

### Current Limitations

1. **Public Repositories Only**: OAuth scope does not currently cover private repositories.
2. **Usage Caps by Tier**: Free-tier users are limited in the number of repositories they can connect and reviews they can generate (tracked via `UserUsage`).
3. **No Streaming Reviews**: AI reviews are generated in full before being posted — no real-time streaming to the dashboard.
4. **Single LLM Provider**: Only Google Gemini is supported via Vercel AI SDK; no fallback provider.
5. **Webhook-Only Trigger**: Reviews are only triggered on `pull_request` `opened` or `synchronize` events — no manual trigger from the dashboard yet.

### Design Decisions

- **Next.js Server Actions over REST**: Reduces API boilerplate and keeps data-fetching co-located with the UI.
- **Inngest for Background Jobs**: Chosen over raw queues for its built-in retry logic, observability dashboard, and easy local development with `inngest-cli`.
- **Pinecone for RAG**: Managed vector DB avoids infrastructure overhead while enabling context-aware reviews.
- **Polar.sh for Payments**: Handles subscription tiers and webhook-based status sync without building a billing system from scratch.

## 🚀 Future Improvements

### Short Term

- [ ] Manual review trigger from the dashboard (without waiting for a webhook)
- [ ] Streaming AI review output to the UI in real time
- [ ] Review status badge on the PR (pending / completed / failed)
- [ ] Dark mode polish across all dashboard pages

### Medium Term

- [ ] Support for private repositories via expanded GitHub OAuth scopes
- [ ] Multi-provider LLM support (OpenAI, Anthropic) with user-selectable models
- [ ] Per-file review breakdown instead of a single diff-level review
- [ ] Configurable review rules and custom prompts per repository

### Long Term

- [ ] GitHub App installation flow (instead of per-user OAuth)
- [ ] Team workspaces with shared repositories and review history
- [ ] Analytics dashboard with review quality metrics over time
- [ ] Webhook event support for `push` events and branch protection rules

## 📸 Screenshots

### Dashboard
Overview of your coding activity and review status.
![Dashboard Page](./public/dashboard_image.png)

### Repositories
Manage your connected GitHub repositories.
![Repository Page](./public/repository_page.png)

### Reviews
Detailed AI-generated feedback on your pull requests.
![Reviews Page](./public/reviews_page.png)

### Settings
Configure your preferences and account details.
![Settings Page](./public/settings_page.png)

### Subscriptions
Manage your plan and usage limits.
![Subscription Page](./public/subscriptions_page.png)

## 🏁 Getting Started

### Prerequisites

*   Node.js (v18+)
*   pnpm, npm, or bun
*   PostgreSQL database
*   GitHub OAuth App credentials
*   Pinecone API Key
*   Google AI API Key (Gemini)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Vanshgargji/codeFox.git
    cd codeFox
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/code_fox?schema=public"

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET="your_secret_key"
    BETTER_AUTH_URL="http://localhost:3000"

    # GitHub OAuth
    GITHUB_CLIENT_ID="your_github_client_id"
    GITHUB_CLIENT_SECRET="your_github_client_secret"

    # AI (Google Gemini)
    GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key"

    # Vector DB (Pinecone)
    PINECONE_API_KEY="your_pinecone_api_key"

    # Background Jobs (Inngest)
    INNGEST_EVENT_KEY="your_inngest_event_key"
    INNGEST_SIGNING_KEY="your_inngest_signing_key"

    # Payments (Polar.sh)
    POLAR_ACCESS_TOKEN="your_polar_access_token"
    ```

4.  **Database Setup:**
    Run the Prisma migrations to set up your database schema.
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    pnpm dev
    # or
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

6.  **Run Inngest Dev Server:**
    In a separate terminal, run Inngest to handle background jobs.
    ```bash
    npx inngest-cli@latest dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
