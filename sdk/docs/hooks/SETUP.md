# Hook Documentation Setup Guide

This document explains how the hook documentation system works and how to maintain it.

## Overview

The documentation system uses TypeDoc with the markdown plugin to generate documentation from TSDoc comments in the React hooks source code.

## Setup

### Dependencies
- `typedoc` - Main documentation generator
- `typedoc-plugin-markdown` - Plugin to output markdown instead of HTML

### Configuration
- `typedoc.json` - TypeDoc configuration file
- `scripts/generate-hook-docs.cjs` - Custom script to organize and enhance the generated docs

## Generating Documentation

Run the following command from the SDK directory:

```bash
npm run docs:hooks
# or
pnpm run docs:hooks
```

This will:
1. Clean the `docs/hooks` directory
2. Run TypeDoc to generate markdown documentation
3. Organize hooks by category
4. Generate a main README.md with navigation

## Documentation Structure

```
docs/hooks/
├── README.md              # Main index with categorized hooks
├── SETUP.md              # This file
├── tsdoc-example.md      # TSDoc writing guide
├── config/               # Configuration hooks
├── data/                 # Data fetching hooks
│   ├── collectibles/
│   ├── collections/
│   ├── inventory/
│   ├── market/
│   ├── orders/
│   ├── primary-sales/
│   └── tokens/
├── transactions/         # Transaction hooks
├── ui/                   # UI-related hooks
├── utils/                # Utility hooks
└── contracts/            # Contract hooks
```

## Adding Documentation to Hooks

1. Add TSDoc comments above your hook function
2. Include:
   - Description of the hook's purpose
   - `@param` tags for all parameters
   - `@returns` description
   - `@example` sections with usage examples
   - `@see` references to related hooks (optional)
   - `@since` version information (optional)

See `tsdoc-example.md` for detailed examples and best practices.

## Continuous Integration

A GitHub workflow (`.github/workflows/generate-hook-docs.yml`) can be used to:
- Automatically generate docs on push to main
- Check for documentation updates in PRs
- Commit documentation changes automatically

## Troubleshooting

### Common Issues

1. **Missing documentation**: Ensure your hook file:
   - Starts with `use` (convention for React hooks)
   - Is not a test file (`.test.ts` or `.test.tsx`)
   - Is not an index file
   - Has proper TSDoc comments

2. **TypeDoc warnings**: These usually indicate:
   - Mismatched parameter names in TSDoc vs actual function
   - Missing type exports
   - Circular dependencies

3. **Categories not appearing**: Check that:
   - The directory structure matches expected categories
   - The hook file is in the correct subdirectory

## Maintenance

- Review generated documentation after major refactors
- Update TSDoc comments when hook APIs change
- Run documentation generation before releases
- Consider adding documentation checks to PR reviews