---
title: useOrderSteps
description: Executes marketplace order steps including transactions and signatures This hook provides a unified interface for executing different types of steps required in marketplace operations. It handles chain switching, message signing (EIP-191 and EIP-712), and transaction sending with proper error handling.
sidebarTitle: useOrderSteps
---

# useOrderSteps

Executes marketplace order steps including transactions and signatures This hook provides a unified interface for executing different types of steps required in marketplace operations. It handles chain switching, message signing (EIP-191 and EIP-712), and transaction sending with proper error handling.

## Returns

returns.executeStep - Function to execute a single marketplace step

## Example

```typescript
Processing multiple steps:
```typescript
const { executeStep } = useOrderSteps();
// Process steps from a marketplace operation
for (const step of steps) {
try {
const result = await executeStep({
step,
chainId: requiredChainId
});
if (step.id === StepType.tokenApproval) {
console.log('Approval tx:', result);
} else if (step.id === StepType.createListing) {
console.log('Listing created:', result);
}
} catch (error) {
if (error instanceof UserRejectedRequestError) {
console.log('User cancelled the operation');
break;
}
throw error;
}
}
```
```

## Basic Usage

```typescript
import { useOrderSteps } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useOrderSteps({
  // Add your parameters here
});
```

