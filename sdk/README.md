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

