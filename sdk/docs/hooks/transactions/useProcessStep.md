---
title: useProcessStep
description: Processes individual marketplace steps with automatic type detection This hook provides a unified interface for processing both transaction and signature steps. It automatically detects the step type, executes the appropriate action, and handles API calls for signature-based operations.
sidebarTitle: useProcessStep
---

# useProcessStep

Processes individual marketplace steps with automatic type detection This hook provides a unified interface for processing both transaction and signature steps. It automatically detects the step type, executes the appropriate action, and handles API calls for signature-based operations.

## Returns

returns.processStep - Function to process a single step

## Example

```typescript
Processing steps from transaction generation:
```typescript
const { processStep } = useProcessStep();
const { generateListingTransactionAsync } = useGenerateListingTransaction();
// Generate and process listing steps
const steps = await generateListingTransactionAsync({ ... });
for (const step of steps) {
const result = await processStep(step, chainId);
switch (result.type) {
case 'transaction':
console.log(`${step.id} tx:`, result.hash);
break;
case 'signature':
console.log('Listing created:', result.orderId);
break;
}
}
```
```

## Basic Usage

```typescript
import { useProcessStep } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useProcessStep({
  // Add your parameters here
});
```

