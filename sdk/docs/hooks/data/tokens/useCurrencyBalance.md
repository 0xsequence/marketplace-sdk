# data/tokens/useCurrencyBalance

## Type Aliases

### UseCurrencyBalanceArgs

```ts
type UseCurrencyBalanceArgs = {
  chainId: number | undefined;
  currencyAddress: Address | undefined;
  query?: {
     enabled?: boolean;
  };
  userAddress: Address | undefined;
};
```

Defined in: [sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx:7](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx#L7)

#### Properties

##### chainId

```ts
chainId: number | undefined;
```

Defined in: [sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx:9](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx#L9)

##### currencyAddress

```ts
currencyAddress: Address | undefined;
```

Defined in: [sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx:8](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx#L8)

##### query?

```ts
optional query: {
  enabled?: boolean;
};
```

Defined in: [sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx:11](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx#L11)

###### enabled?

```ts
optional enabled: boolean;
```

##### userAddress

```ts
userAddress: Address | undefined;
```

Defined in: [sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx:10](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx#L10)

## Functions

### useCurrencyBalance()

```ts
function useCurrencyBalance(args): 
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
}
  | {
  data:   | undefined
     | {
     formatted: string;
     value: bigint;
   };
};
```

Defined in: [sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx:64](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/data/tokens/useCurrencyBalance.tsx#L64)

Hook to fetch cryptocurrency balance for a user

Retrieves the balance of a specific currency (native token or ERC-20)
for a given user address using wagmi. Handles both native tokens (ETH, MATIC, etc.)
and ERC-20 tokens with automatic decimal formatting through direct blockchain calls.

#### Parameters

##### args

[`UseCurrencyBalanceArgs`](#usecurrencybalanceargs)

Configuration parameters

#### Returns

  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}
  \| \{
  `data`:   \| `undefined`
     \| \{
     `formatted`: `string`;
     `value`: `bigint`;
   \};
\}

Wagmi query result containing raw and formatted balance values

#### Examples

Native token balance (ETH):
```typescript
const { data: ethBalance, isLoading } = useCurrencyBalance({
  currencyAddress: '0x0000000000000000000000000000000000000000', // Zero address for ETH
  chainId: 1,
  userAddress: '0x1234...'
})

if (data) {
  console.log(`ETH Balance: ${data.formatted} ETH`); // e.g., "1.5 ETH"
  console.log(`Raw balance: ${data.value.toString()}`); // e.g., "1500000000000000000"
}
```

ERC-20 token balance (USDC):
```typescript
const { data: usdcBalance } = useCurrencyBalance({
  currencyAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  chainId: 1,
  userAddress: userAddress,
  query: {
    enabled: Boolean(userAddress), // Only fetch when user is connected
    refetchInterval: 30000 // Update every 30 seconds
  }
})

if (data) {
  console.log(`USDC Balance: $${data.formatted}`); // e.g., "$1000.50"
}
```
