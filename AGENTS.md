# AGENTS.md - Coding Agent Guidelines

## Commands
- **Build**: `pnpm build` (SDK only), `pnpm dev:react` (React playground), `pnpm dev:next` (Next.js playground)
- **Lint/Format**: `pnpm lint` (fix), `pnpm format` (fix), `pnpm biome-check` (all checks), `pnpm eslint:fix`
- **Test**: `pnpm test run` (all), `cd sdk && pnpm vitest path/to/test.test.ts` (single test)
- **Type Check**: `pnpm check` (recursive)

## Code Style
- **Formatting**: Tab indentation, single quotes, self-closing elements (Biome)
- **Imports**: 'use client' at top for React components, organize imports on save
- **Types**: TypeScript strict mode, prefer types over Zod schemas, use `.gen.ts` for generated types
- **Naming**: camelCase functions/variables, PascalCase components/types, kebab-case files
- **State**: @xstate/store (preferred), React Query for server state
- **Errors**: Use try-catch, return meaningful error messages, no console.logs in production

## Architecture
- Monorepo: `/sdk` (main), `/playgrounds/*` (examples)
- Hook-based API: All SDK features exposed as React hooks
- Provider pattern: MarketplaceProvider wraps app with config
- Testing: Vitest + MSW for mocks, Foundry/Anvil for blockchain tests
- CSS: Import as `@0xsequence/marketplace-sdk/styles`