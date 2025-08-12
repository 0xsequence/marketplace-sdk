# utils/useEnsureCorrectChain

## Functions

### useEnsureCorrectChain()

```ts
function useEnsureCorrectChain(): {
  currentChainId: undefined | number;
  ensureCorrectChain: (targetChainId, callbacks?) => void;
  ensureCorrectChainAsync: (targetChainId) => Promise<unknown>;
};
```

Defined in: [sdk/src/react/hooks/utils/useEnsureCorrectChain.ts:7](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useEnsureCorrectChain.ts#L7)

#### Returns

```ts
{
  currentChainId: undefined | number;
  ensureCorrectChain: (targetChainId, callbacks?) => void;
  ensureCorrectChainAsync: (targetChainId) => Promise<unknown>;
}
```

##### currentChainId

```ts
currentChainId: undefined | number;
```

##### ensureCorrectChain()

```ts
ensureCorrectChain: (targetChainId, callbacks?) => void;
```

###### Parameters

###### targetChainId

`number`

###### callbacks?

###### onClose?

() => `void`

###### onError?

(`error`) => `void`

###### onSuccess?

() => `void`

###### Returns

`void`

##### ensureCorrectChainAsync()

```ts
ensureCorrectChainAsync: (targetChainId) => Promise<unknown>;
```

###### Parameters

###### targetChainId

`number`

###### Returns

`Promise`\<`unknown`\>
