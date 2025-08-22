# TSDoc Documentation Guide for Hooks

This guide shows how to add TSDoc comments to hooks that don't have documentation yet.

## Example: Adding TSDoc to `useOpenConnectModal`

### Before (no documentation):
```typescript
import { useConfig } from '../config/useConfig';

export const useOpenConnectModal = () => {
	const context = useConfig();

	return {
		openConnectModal: context.openConnectModal,
	};
};
```

### After (with TSDoc):
```typescript
import { useConfig } from '../config/useConfig';

/**
 * Hook to access the connect modal functionality
 * 
 * This hook provides access to the `openConnectModal` function
 * which can be used to programmatically open the wallet connection modal.
 * 
 * @returns An object containing the openConnectModal function
 * 
 * @example
 * Basic usage:
 * ```typescript
 * const { openConnectModal } = useOpenConnectModal();
 * 
 * // Open the modal when button is clicked
 * <button onClick={openConnectModal}>
 *   Connect Wallet
 * </button>
 * ```
 * 
 * @example
 * With custom handling:
 * ```typescript
 * const { openConnectModal } = useOpenConnectModal();
 * 
 * const handleConnect = async () => {
 *   try {
 *     await openConnectModal();
 *     console.log('Wallet connected successfully');
 *   } catch (error) {
 *     console.error('Failed to connect wallet:', error);
 *   }
 * };
 * ```
 */
export const useOpenConnectModal = () => {
	const context = useConfig();

	return {
		openConnectModal: context.openConnectModal,
	};
};
```

## TSDoc Best Practices for Hooks

1. **Always include a description**: Start with a brief description of what the hook does
2. **Document parameters**: Use `@param` tags with clear descriptions
3. **Document return values**: Use `@returns` to describe what the hook returns
4. **Provide examples**: Include at least one `@example` showing basic usage
5. **Use proper types**: Reference TypeScript types properly in the documentation

## Common TSDoc Tags for Hooks

- `@description` - Main description (can be omitted, first paragraph is used)
- `@param` - Document each parameter
- `@returns` - Document the return value
- `@example` - Provide usage examples
- `@see` - Reference related hooks or documentation
- `@since` - Version when the hook was introduced
- `@deprecated` - Mark deprecated hooks with migration instructions

## Template for New Hooks

```typescript
/**
 * Brief description of what the hook does
 * 
 * More detailed explanation of the hook's purpose,
 * when to use it, and any important considerations.
 * 
 * @param params - Configuration object
 * @param params.field1 - Description of field1
 * @param params.field2 - Description of field2
 * 
 * @returns Description of what the hook returns
 * 
 * @example
 * Basic usage:
 * ```typescript
 * const result = useYourHook({
 *   field1: 'value',
 *   field2: 123
 * });
 * ```
 * 
 * @see {@link useRelatedHook} - For related functionality
 * @since 1.0.0
 */
export function useYourHook(params: YourHookParams) {
  // Implementation
}
```