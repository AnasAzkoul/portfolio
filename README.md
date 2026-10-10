# Portfolio

Anas Azkoul's personal portfolio website, built with [Nuxt 4](https://nuxt.com) and TypeScript (strict).

## Running locally

Requires Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` and [pnpm](https://pnpm.io).

```bash
pnpm install     # install dependencies
pnpm dev         # dev server on http://localhost:3000
pnpm typecheck   # type-check the project
pnpm lint        # lint with ESLint (pnpm lint:fix to auto-fix)
pnpm format      # format with Prettier (pnpm format:check to verify)
pnpm build       # production build
pnpm generate    # static (pre-rendered) build
pnpm preview     # preview the production build
```

`pnpm install` sets up a pre-commit hook (via `simple-git-hooks`) that runs ESLint and Prettier on staged files through `lint-staged`.
