# TypeDoc to Mintlify MDX Migration Plan

## Overview

This document outlines the plan to migrate our TypeDoc-generated documentation to Mintlify-compatible MDX format. The goal is to leverage our existing TypeDoc setup while adapting the output to meet Mintlify's requirements.

## Current Setup Analysis

### TypeDoc Configuration
- **Location**: `sdk/typedoc.json`
- **Plugin**: `typedoc-plugin-markdown`
- **Entry Points**: `./src/react/hooks`
- **Output**: `docs/hooks`
- **Strategy**: Module-based documentation with categorization

### Current Documentation Structure
```
docs/hooks/
├── config/
├── contracts/
├── data/
│   ├── collectibles/
│   ├── collections/
│   ├── inventory/
│   ├── market/
│   ├── orders/
│   ├── primary-sales/
│   └── tokens/
├── transactions/
├── ui/
├── util/
└── utils/
```

### Hook Categories
- **config**: Configuration hooks
- **data**: Data fetching hooks
- **transactions**: Transaction-related hooks
- **ui**: UI-related hooks
- **utils**: Utility hooks
- **contracts**: Contract interaction hooks

## Mintlify Requirements

### 1. Frontmatter Structure
Every MDX file must include YAML frontmatter:
```yaml
---
title: "Page Title"
description: "Brief description for SEO and preview"
sidebarTitle: "Sidebar Title"
icon: "icon-name"
tag: "NEW" # optional
---
```

### 2. File Extension
- Must use `.mdx` extension instead of `.md`
- Supports React components within markdown

### 3. MDX Components
Mintlify provides built-in components:
- `<Card>` - Feature cards with icons
- `<CardGroup>` - Grid of cards
- `<CodeGroup>` - Multiple code examples with tabs
- `<Tabs>` - Tab navigation
- `<Accordion>` - Collapsible sections
- `<Callout>` - Highlighted information blocks
- `<Frame>` - Image/component containers

### 4. API Documentation
- Supports OpenAPI integration via frontmatter
- Interactive API playground
- SDK code examples

### 5. Navigation Structure
Requires `mint.json` configuration file with navigation hierarchy.

## TypeDoc Plugin Markdown Capabilities

### Key Findings from Research

#### 1. Frontmatter Support ✅
The ecosystem includes `typedoc-plugin-frontmatter` which provides:
- Ability to prepend YAML frontmatter to all pages
- Customizable frontmatter through local plugins
- Event-based system to modify frontmatter dynamically
- Support for page-specific frontmatter via comment tags

#### 2. File Extension Configuration ✅
The plugin supports:
- `fileExtension` option to change output from `.md` to `.mdx`
- Custom file naming conventions
- Flexible output structure

#### 3. Customization Capabilities ✅
- **Hooks System**: Inject content at specific locations
  - `page.begin`, `page.end`, `content.begin`
- **Page Events**: Modify content before/after rendering
  - `MarkdownPageEvent.BEGIN`, `MarkdownPageEvent.END`
- **Async Jobs**: Perform pre/post rendering tasks
- **Local Plugin Support**: ESM-based plugin system

#### 4. Display Options ✅
Extensive formatting options including:
- `useCodeBlocks`: Wrap signatures in code blocks
- `expandObjects`: Expand object declarations
- `parametersFormat`: Control parameter display format
- Custom page title templates
- Table column configuration

#### 5. Navigation Generation ⚠️
- The plugin generates its own navigation structure
- Would need custom processing to generate Mintlify's `mint.json` format

### What's Missing
1. **MDX Component Transformation**: No built-in support for converting to Mintlify components
2. **mint.json Generation**: Need custom implementation
3. **Icon Mapping**: No automatic icon assignment based on content type

## Migration Strategy (Updated)

### Phase 1: Configure TypeDoc Plugins ✅
1. Install `typedoc-plugin-frontmatter`
2. Configure `fileExtension` to `.mdx`
3. Set up display options for better formatting
4. Create local plugin for Mintlify-specific frontmatter

### Phase 2: Create Mintlify Adapter Plugin
1. **Frontmatter Generation**:
   - Use `typedoc-plugin-frontmatter` with custom plugin
   - Map hook categories to icons
   - Generate title, description, and sidebarTitle
   
2. **Content Transformation**:
   - Hook into `MarkdownPageEvent.BEGIN`
   - Transform code blocks to `<CodeGroup>` components
   - Convert parameter lists to `<Field>` components
   - Add `<Tabs>` for multiple examples

3. **Navigation Generation**:
   - Post-render job to generate `mint.json`
   - Map TypeDoc structure to Mintlify navigation
   - Handle nested categories appropriately

### Phase 3: Enhanced Post-Processing
1. Modify `generate-hook-docs.cjs` to:
   - Ensure proper MDX formatting
   - Add category-specific enhancements
   - Generate index pages with `<Card>` components

### Phase 4: Content Enhancement
1. Add interactive examples using Mintlify components
2. Create category overview pages with visual hierarchy
3. Add search keywords for better discoverability

## Implementation Tasks

### Immediate Actions
1. Research typedoc-plugin-markdown capabilities
2. Test configuration options
3. Identify gaps between current output and Mintlify requirements

### Short-term Goals
1. Implement frontmatter injection
2. File extension conversion
3. Basic navigation generation

### Long-term Goals
1. Full MDX component integration
2. Interactive examples
3. API playground integration
4. Automated deployment pipeline

## Example Transformations

### Current Output (TypeDoc)
```markdown
# data/collectibles/useCollectible

## Type Aliases

### UseCollectibleParams

\`\`\`ts
type UseCollectibleParams = Optional<CollectibleQueryOptions, "config">;
\`\`\`
```

### Target Output (Mintlify)
```mdx
---
title: "useCollectible"
description: "Hook to fetch metadata for a specific collectible"
sidebarTitle: "useCollectible"
icon: "image"
tag: "Data"
---

# useCollectible

Hook to fetch metadata for a specific collectible including properties like name, description, image, and attributes.

## Parameters

<Field name="params" type="UseCollectibleParams" required>
  Configuration parameters for the collectible query
</Field>

## Returns

<Field name="data" type="TokenMetadata">
  The collectible metadata
</Field>

## Example

<CodeGroup>
```typescript React
const { data: collectible, isLoading } = useCollectible({
  chainId: 137,
  collectionAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
  collectibleId: '12345'
});
```

```typescript Next.js
// In a Next.js component
export default function CollectiblePage({ id }) {
  const { data, isLoading } = useCollectible({
    chainId: 137,
    collectionAddress: process.env.NEXT_PUBLIC_COLLECTION_ADDRESS,
    collectibleId: id
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{data?.name}</div>;
}
```
</CodeGroup>
```

## Implementation Approach

### Step 1: Install Required Packages
```bash
npm install --save-dev typedoc-plugin-frontmatter
```

### Step 2: Create Mintlify Adapter Plugin
Create `sdk/plugins/typedoc-mintlify-adapter.mjs`:
```javascript
// @ts-check
import { ReflectionKind } from 'typedoc';
import { MarkdownPageEvent, MarkdownApplication } from 'typedoc-plugin-markdown';

const ICON_MAP = {
  config: 'gear',
  data: 'database',
  transactions: 'arrow-right-arrow-left',
  ui: 'palette',
  utils: 'wrench',
  contracts: 'file-contract',
  collectibles: 'image',
  collections: 'layer-group',
  inventory: 'box',
  market: 'store',
  orders: 'receipt',
  'primary-sales': 'tag',
  tokens: 'coins'
};

export function load(app) {
  // Configure frontmatter
  app.renderer.on(MarkdownPageEvent.BEGIN, (page) => {
    if (page.model?.kind === ReflectionKind.Function) {
      const path = page.url.split('/');
      const category = path[0] || 'general';
      
      page.frontmatter = {
        title: page.model.name,
        description: extractDescription(page.model),
        sidebarTitle: page.model.name,
        icon: ICON_MAP[category] || 'code',
        ...page.frontmatter
      };
    }
  });
  
  // Transform content for Mintlify components
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    page.contents = transformToMintlifyMDX(page.contents);
  });
  
  // Generate mint.json after rendering
  app.renderer.postRenderAsyncJobs.push(async (renderer) => {
    await generateMintConfig(renderer);
  });
}
```

### Step 3: Update TypeDoc Configuration
```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["./src/react/hooks"],
  "entryPointStrategy": "expand",
  "exclude": [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/node_modules/**",
    "**/_internal/**"
  ],
  "out": "docs/hooks",
  "plugin": [
    "typedoc-plugin-markdown",
    "typedoc-plugin-frontmatter",
    "./plugins/typedoc-mintlify-adapter.mjs"
  ],
  "fileExtension": ".mdx",
  "useCodeBlocks": true,
  "expandObjects": true,
  "parametersFormat": "table",
  "outputFileStrategy": "modules",
  "frontmatterGlobals": {
    "pagination": true
  }
}
```

### Step 4: Test and Iterate
1. Run TypeDoc with new configuration
2. Validate MDX output format
3. Test in Mintlify development environment
4. Refine transformations based on results

## Next Steps

1. **Implementation Phase**: Create the adapter plugin
2. **Testing Phase**: Validate with sample hooks
3. **Refinement Phase**: Improve transformations based on Mintlify rendering
4. **Deployment Phase**: Apply to all documentation and set up CI/CD

## Resources

- [TypeDoc Plugin Markdown](https://typedoc-plugin-markdown.org/)
- [TypeDoc Plugin Frontmatter](https://typedoc-plugin-markdown.org/plugins/frontmatter)
- [Mintlify Documentation](https://mintlify.com/docs)
- [MDX Specification](https://mdxjs.com/)
- [TypeDoc Plugin Development](https://typedoc.org/documents/Development.Plugins.html)