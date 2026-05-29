# GlowTrack

  A full-stack productivity tracker for junior developers on the job hunt.
  Track applications, manage tasks, build habits, and visualise your growth.

  ## Stack

  - **Frontend**: React 19 + Vite + Tailwind CSS v4 + Framer Motion + Recharts
  - **Backend**: Node.js + Express 5 + Drizzle ORM
  - **Database**: PostgreSQL
  - **Auth**: JWT + bcrypt
  - **Package manager**: pnpm (workspaces)

  ## Prerequisites

  - [Node.js 20+](https://nodejs.org)
  - [pnpm](https://pnpm.io) — install with `npm install -g pnpm`
  - PostgreSQL running locally (or a connection string from [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)

  ## Quick start

  ### 1. Install dependencies

  ```bash
  pnpm install
  ```

  ### 2. Set up the API server environment

  ```bash
  cp artifacts/api-server/.env.example artifacts/api-server/.env
  ```

  Edit `artifacts/api-server/.env` and fill in:

  | Variable       | Description                                     |
  |----------------|-------------------------------------------------|
  | `DATABASE_URL` | PostgreSQL connection string                    |
  | `JWT_SECRET`   | Long random string used to sign JWT tokens      |
  | `PORT`         | Port for the API server (default: `5000`)       |

  ### 3. Set up the frontend environment

  ```bash
  cp artifacts/glow-track/.env.example artifacts/glow-track/.env
  ```

  The defaults work for local development (`PORT=5173`, `BASE_PATH=/`).

  ### 4. Push the database schema

  ```bash
  pnpm --filter @workspace/db run push
  ```

  ### 5. Run the backend

  ```bash
  pnpm --filter @workspace/api-server run dev
  ```

  The API server starts on <http://localhost:5000>.

  ### 6. Run the frontend (new terminal)

  ```bash
  pnpm --filter @workspace/glow-track run dev
  ```

  Open <http://localhost:5173> in your browser.

  ---

  ## Project structure

  ```
  glowtrack/
  ├── artifacts/
  │   ├── api-server/          # Express API (auth, jobs, tasks, habits, profile)
  │   └── glow-track/          # React + Vite frontend
  ├── lib/
  │   ├── db/                  # Drizzle ORM schema + client
  │   ├── api-spec/            # OpenAPI spec (source of truth for the contract)
  │   ├── api-client-react/    # Auto-generated React Query hooks
  │   └── api-zod/             # Auto-generated Zod validation schemas
  ├── pnpm-workspace.yaml
  ├── tsconfig.json
  └── tsconfig.base.json
  ```

  ## Regenerate API types (after editing openapi.yaml)

  ```bash
  pnpm --filter @workspace/api-spec run codegen
  ```

  ## Build for production

  ```bash
  pnpm run build
  ```

  The frontend builds to `artifacts/glow-track/dist/public`.
  Serve the API on your host and point a static file server (or express `static`) at the public folder.

  ---

  ## Environment variables reference

  ### API server (`artifacts/api-server/.env`)

  | Variable       | Required | Default             | Description                    |
  |----------------|----------|---------------------|--------------------------------|
  | `DATABASE_URL` | Yes      | —                   | PostgreSQL connection string   |
  | `JWT_SECRET`   | Yes      | —                   | Secret for signing JWT tokens  |
  | `PORT`         | No       | `5000`              | Port the Express server binds  |

  ### Frontend (`artifacts/glow-track/.env`)

  | Variable    | Required | Default | Description                    |
  |-------------|----------|---------|--------------------------------|
  | `PORT`      | No       | `5173` | Vite dev server port           |
  | `BASE_PATH` | No       | `/`    | URL base path (leave as `/`)   |
  