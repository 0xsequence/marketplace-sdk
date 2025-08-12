# transactions/useOrderSteps

## Functions

### useOrderSteps()

```ts
function useOrderSteps(): {
  executeStep: (__namedParameters) => Promise<undefined | `0x${string}`>;
};
```

Defined in: [sdk/src/react/hooks/transactions/useOrderSteps.tsx:141](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/transactions/useOrderSteps.tsx#L141)

#### Returns

```ts
{
  executeStep: (__namedParameters) => Promise<undefined | `0x${string}`>;
}
```

##### executeStep()

```ts
executeStep: (__namedParameters) => Promise<undefined | `0x${string}`>;
```

###### Parameters

###### \_\_namedParameters

###### chainId

`number`

###### step

`Step`

###### Returns

`Promise`\<`undefined` \| `` `0x${string}` ``\>
