# Skifa Frontend

The Skifa frontend is built with Next.js 16, React 19, TypeScript, and
Tailwind CSS 4.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Local setup

```bash
npm run dev
```

Before starting the server, copy `.env.example` to `.env.local`. Then open
[http://localhost:3000](http://localhost:3000).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate route types and run TypeScript checks |
| `npm run check` | Run linting and type checks |

## Project structure

```text
app/          Routes, layouts, route-level loading and error UI
components/   Reusable shared components
config/       Application metadata and configuration
features/     Domain-specific modules grouped by feature
public/       Static assets
screens/      Page-level UI composed and rendered by app routes
```

Keep pages and layouts as Server Components by default. Add `"use client"`
only to the smallest component boundary that needs state, effects, event
handlers, or browser APIs.

## Environment variables

Copy `.env.example` to `.env.local`. Never commit secrets. Only variables with
the `NEXT_PUBLIC_` prefix are exposed to browser code. When adding a variable,
document a safe placeholder in `.env.example`.

## Development conventions

- Use the `@/` import alias for imports from the project root.
- Prefer feature-local code over a large global utility layer.
- Put code shared by multiple features in `components`, `config`, or `lib`.
- Keep route files thin by composing page-level UI in `screens`.
- Run `npm run check` and `npm run build` before opening a pull request.
