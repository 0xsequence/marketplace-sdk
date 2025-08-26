---
title: useAutoSelectFeeOption
description: A React hook that automatically selects the first fee option for which the user has sufficient balance.
sidebarTitle: useAutoSelectFeeOption
---

# useAutoSelectFeeOption

A React hook that automatically selects the first fee option for which the user has sufficient balance.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` | {Object} | .pendingFeeOptionConfirmation - Configuration for fee option selection |

## Returns

{Promise<{

## Example

```typescript
```tsx
function MyComponent() {
const [pendingFeeOptionConfirmation, confirmPendingFeeOption] = useWaasFeeOptions();
const autoSelectOptionPromise = useAutoSelectFeeOption({
pendingFeeOptionConfirmation: pendingFeeOptionConfirmation
? {
id: pendingFeeOptionConfirmation.id,
options: pendingFeeOptionConfirmation.options,
chainId: 1
}
: {
id: '',
options: undefined,
chainId: 1
}
});
useEffect(() => {
autoSelectOptionPromise.then((result) => {
if (result.isLoading) {
console.log('Checking balances...');
return;
}
if (result.error) {
console.error('Failed to select fee option:', result.error);
return;
}
if (pendingFeeOptionConfirmation?.id && result.selectedOption) {
confirmPendingFeeOption(
pendingFeeOptionConfirmation.id,
result.selectedOption.token.contractAddress
);
}
});
}, [autoSelectOptionPromise, confirmPendingFeeOption, pendingFeeOptionConfirmation]);
return <div>...</div>;
}
```
```

## Basic Usage

```typescript
import { useAutoSelectFeeOption } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useAutoSelectFeeOption({
  // Add your parameters here
});
```

