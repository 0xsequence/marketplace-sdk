# transactions/useCancelOrder

## Type Aliases

### TransactionStep

```ts
type TransactionStep = {
  execute: () => Promise<void>;
  exist: boolean;
  isExecuting: boolean;
};
```

Defined in: [sdk/src/react/hooks/transactions/useCancelOrder.tsx:15](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useCancelOrder.tsx#L15)

#### Properties

##### execute()

```ts
execute: () => Promise<void>;
```

Defined in: [sdk/src/react/hooks/transactions/useCancelOrder.tsx:18](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useCancelOrder.tsx#L18)

###### Returns

`Promise`\<`void`\>

##### exist

```ts
exist: boolean;
```

Defined in: [sdk/src/react/hooks/transactions/useCancelOrder.tsx:16](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useCancelOrder.tsx#L16)

##### isExecuting

```ts
isExecuting: boolean;
```

Defined in: [sdk/src/react/hooks/transactions/useCancelOrder.tsx:17](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useCancelOrder.tsx#L17)

## Functions

### useCancelOrder()

```ts
function useCancelOrder(__namedParameters): {
  cancellingOrderId: null | string;
  cancelOrder: (params) => Promise<void>;
  isExecuting: boolean;
};
```

Defined in: [sdk/src/react/hooks/transactions/useCancelOrder.tsx:21](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useCancelOrder.tsx#L21)

#### Parameters

##### \_\_namedParameters

`UseCancelOrderArgs`

#### Returns

```ts
{
  cancellingOrderId: null | string;
  cancelOrder: (params) => Promise<void>;
  isExecuting: boolean;
}
```

##### cancellingOrderId

```ts
cancellingOrderId: null | string;
```

##### cancelOrder()

```ts
cancelOrder: (params) => Promise<void>;
```

###### Parameters

###### params

###### marketplace

`MarketplaceKind`

###### orderId

`string`

###### Returns

`Promise`\<`void`\>

##### isExecuting

```ts
isExecuting: boolean = steps.isExecuting;
```
