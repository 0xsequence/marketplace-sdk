---
title: useSalesContractABI
description: Detects and retrieves the appropriate ABI for a sales contract This hook automatically determines whether a sales contract uses V0 or V1 ABI by attempting to call contract methods. It first tries V1, and falls back to V0 if V1 fails. This is useful for interacting with sales contracts deployed at different times with different ABI versions.
sidebarTitle: useSalesContractABI
---

# useSalesContractABI

Detects and retrieves the appropriate ABI for a sales contract This hook automatically determines whether a sales contract uses V0 or V1 ABI by attempting to call contract methods. It first tries V1, and falls back to V0 if V1 fails. This is useful for interacting with sales contracts deployed at different times with different ABI versions.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` |  | Configuration for ABI detection |
| `params` |  | .contractAddress - The sales contract address to check |
| `params` |  | .contractType - The collection contract type (ERC721 or ERC1155) |
| `params` |  | .chainId - The blockchain network ID |
| `params` |  | .enabled - Whether to enable the detection (default: true) |

## Returns

returns.error - Error if both V0 and V1 detection fail

## Example

```typescript
Using with contract interactions:
```typescript
const { abi, version, error } = useSalesContractABI({
contractAddress: salesContract,
contractType: ContractType.ERC1155,
chainId: 1,
enabled: !!salesContract
});
const { data: saleDetails } = useReadContract({
address: salesContract,
abi: abi,
functionName: 'tokenSaleDetails',
args: [tokenId],
enabled: !!abi && !error
});
```
```

## Basic Usage

```typescript
import { useSalesContractABI } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useSalesContractABI({
  // Add your parameters here
});
```

