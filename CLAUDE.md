# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the `@0xsequence/marketplace-sdk` - a TypeScript/React SDK that provides core functionality for building web3 marketplaces using Sequence's Aggregated Marketplace technology.

The repository uses a monorepo structure with:
- Main SDK package in `/sdk`
- React playground in `/playgrounds/react-vite`
- Next.js playground in `/playgrounds/next`
- Shared components in `/playgrounds/shared`

## Development Commands

### Build Commands
- `pnpm build` - Build the SDK
- `pnpm dev:react` - Start React Vite playground with HMR
- `pnpm dev:next` - Start Next.js playground
- `pnpm check` - Run TypeScript type checking (recursive)

### Linting and Formatting
- `pnpm lint` - Lint and fix issues using Biome
- `pnpm lint:check` - Check linting without fixes
- `pnpm format` - Format code using Biome
- `pnpm format:check` - Check formatting without fixes
- `pnpm biome-check` - Run full Biome check with fixes
- `pnpm eslint` - Run ESLint on SDK
- `pnpm eslint:fix` - Fix ESLint issues

### Testing
- `pnpm test run` - Run all tests (requires Foundry/Anvil)
- `pnpm test:update` - Update test snapshots
- `pnpm coverage` - Run tests with coverage report

### Single Test Execution
To run a single test file in the SDK:
```bash
cd sdk && pnpm vitest path/to/test.test.ts
```

## Architecture Overview

### SDK Structure (`/sdk/src`)

1. **Core Exports** (`index.ts`)
   - Constants, types, utilities
   - Builder API exports
   - Includes main CSS bundle

2. **React Integration** (`/react`)
   - `provider.tsx` - Main MarketplaceProvider with QueryClient setup
   - `/hooks` - 40+ custom React hooks for marketplace operations
   - `/queries` - React Query implementations
   - `/ssr` - Server-side rendering utilities
   - `/ui` - UI components including modals (Buy, Sell, List, Transfer)

3. **Internal APIs** (`/react/_internal/api`)
   - `builder-api.ts` - Core builder API client
   - `marketplace-api.ts` - Marketplace operations
   - Query client configuration and keys

4. **State Management**
   - Uses @xstate/store for state management
   - @legendapp/state for reactive state, but is in the process of being replaced with @xstate/store
   - React Query for server state

5. **Type System**
   - Zod schemas for API validation, but is in the process of being replaced with TypeScript types
   - Generated types from API specs (`.gen.ts` files)
   - Comprehensive TypeScript types in `/types`

### Key Architectural Patterns

1. **Provider Pattern**: MarketplaceProvider wraps entire app with config and QueryClient
2. **Hook-based API**: All SDK functionality exposed through React hooks
3. **Modal System**: Pre-built modals for common marketplace actions with internal state management
4. **Wagmi Integration**: Built on wagmi for wallet connections and transactions
5. **Query Caching**: Aggressive caching with React Query for performance

### Testing Approach

- Uses Vitest with jsdom environment
- MSW (Mock Service Worker) for API mocking
- Test utilities in `/test` with wallet mocks
- Foundry/Anvil required for blockchain testing
- Snapshot testing for UI components

### Code Standards

- TypeScript strict mode enabled
- Biome for formatting (tab indentation, single quotes)
- ESLint with React and TypeScript rules
- 'use client' directives preserved for Next.js compatibility
- No unused locals/parameters enforced

### Development Notes

- When adding new SDK exports, run `pnpm install` to update playground symlinks
- Playgrounds work in both "build" and "unbuild" modes for HMR
- CSS is bundled and must be imported as `@0xsequence/marketplace-sdk/styles`
- Images are inlined as data URLs in the build