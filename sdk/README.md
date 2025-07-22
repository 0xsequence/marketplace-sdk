# Marketplace SDK
`@0xsequence/marketplace-sdk` provides core functionality for integrators who wish to develop their own web3 Marketplaces using [Sequence's Aggregated Marketplace](https://sequence.xyz/marketplaces) technology.

You can install with:

`pnpm install @0xsequence/marketplace-sdk`

For an example Marketplace implementation that leverages this SDK, see [Sequence Marketplace Boilerplate](https://github.com/0xsequence/marketplace-boilerplate).

## Development

To run the development server, run:

`pnpm dev:react`

This will start the React playground, which is a Vite project

To run the Next.js playground, run:

`pnpm dev:next`

The playgrounds can run against the local SDK in both "build" and "unbuild" modes.
When modifying existing SDK code without building it, you'll get the benefit of Hot Module Replacement (HMR) in the playgrounds automatically with the exeption of adding new exports to the SDK, then you'll need to run `pnpm install` afterward to trigger the creation of new symlinks for the playgrounds.

## Testing

The marketplace SDK uses Foundry / Anvil for testing.

Install Foundry using the following command:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

To run the tests, run:

```bash
pnpm test
```

### Best Practices for Running Tests

1. **Running tests once**: Use `pnpm test run` to run tests in CI mode (without watch mode)
   ```bash
   pnpm test run
   ```

2. **Running tests for a specific file**: Be careful when running tests for a single file as it might cause issues with shared test setup
   ```bash
   # Run tests for a specific file
   pnpm test run src/path/to/file.test.ts
   
   # Better: Run tests matching a pattern
   pnpm test run -t "test name pattern"
   ```

3. **Preventing multiple Vitest instances**: Ensure only one instance of Vitest is running at a time
   - Close any running test watchers before starting new test runs
   - Use `pnpm test run` for one-time execution instead of `pnpm test` (which starts watch mode)

4. **Debugging test failures**: 
   - Check the full test output for detailed error messages
   - Look for ESM module mocking issues (common with wagmi and other external libraries)
   - Ensure all async operations are properly awaited

5. **Mocking external modules**: When testing components that use wagmi or other external libraries:
   ```typescript
   // Mock at the module level, not inside tests
   vi.mock('wagmi', async () => {
     const actual = await vi.importActual('wagmi');
     return {
       ...actual,
       useAccount: vi.fn(() => ({
         address: '0x123',
         isConnected: true,
         // ... other properties
       })),
     };
   });
   ```

