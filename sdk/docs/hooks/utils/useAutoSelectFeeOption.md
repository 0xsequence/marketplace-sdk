# utils/useAutoSelectFeeOption

## Functions

### useAutoSelectFeeOption()

```ts
function useAutoSelectFeeOption(__namedParameters): Promise<
  | {
  error: AutoSelectFeeOptionError;
  isLoading?: undefined;
  selectedOption: null;
}
  | {
  error: null;
  isLoading: boolean;
  selectedOption: null;
}
  | {
  error: null;
  isLoading?: undefined;
  selectedOption: FeeOption;
}>;
```

Defined in: [sdk/src/react/hooks/utils/useAutoSelectFeeOption.tsx:90](https://github.com/0xsequence/marketplace-sdk/blob/6a4808051b4d56769c8daea217398414041a4d84/sdk/src/react/hooks/utils/useAutoSelectFeeOption.tsx#L90)

A React hook that automatically selects the first fee option for which the user has sufficient balance.

#### Parameters

##### \_\_namedParameters

`UseAutoSelectFeeOptionArgs`

#### Returns

`Promise`\<
  \| \{
  `error`: `AutoSelectFeeOptionError`;
  `isLoading?`: `undefined`;
  `selectedOption`: `null`;
\}
  \| \{
  `error`: `null`;
  `isLoading`: `boolean`;
  `selectedOption`: `null`;
\}
  \| \{
  `error`: `null`;
  `isLoading?`: `undefined`;
  `selectedOption`: `FeeOption`;
\}\>

A promise that resolves to an object containing:
  - selectedOption: The first fee option with sufficient balance, or null if none found
  - error: Error message if selection fails, null otherwise
  - isLoading: True while checking balances

#### Throws

Possible errors:
  - UserNotConnected: When no wallet is connected
  - NoOptionsProvided: When fee options array is undefined
  - FailedToCheckBalances: When balance checking fails
  - InsufficientBalanceForAnyFeeOption: When user has insufficient balance for all options

#### Example

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
