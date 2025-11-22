# WaaS Fee Selection - Integrator Guide

## Overview

When users perform transactions with WaaS wallets (Sequence Embedded Wallets), they need to pay transaction fees. The Marketplace SDK provides two modes for handling fee option selection, giving you control over the user experience.

## Configuration

Control the fee selection behavior via the `waasFeeOptionSelectionType` configuration option:

```typescript
import { MarketplaceProvider } from '@0xsequence/marketplace-sdk';

function App() {
  return (
    <MarketplaceProvider
      config={{
        projectAccessKey: 'your-key',
        projectId: 'your-project-id',
        // Choose fee selection mode:
        waasFeeOptionSelectionType: 'automatic', // or 'manual' (default)
      }}
    >
      {/* Your app */}
    </MarketplaceProvider>
  );
}
```

## Mode 1: Automatic (Headless)

**Configuration:** `waasFeeOptionSelectionType: 'automatic'`

### Integrator Experience

**What happens:**
1. User initiates a sell transaction
2. SDK automatically checks available fee options (native token, ERC20s, etc.)
3. SDK automatically selects the first option where user has sufficient balance
4. Transaction proceeds immediately without user intervention
5. No fee selection UI is shown

**User Experience:**
- Seamless, one-click transaction flow
- No fee selection step visible in the modal
- Transaction proceeds directly from approval (if needed) to execution
- Best for experienced users or when you want minimal friction

**When to use:**
- Headless/embedded flows
- One-click checkout experiences
- When user experience speed is priority
- Gaming applications with frequent transactions
- When you trust the automatic selection logic

**Error Handling:**
- If user has insufficient balance for ALL fee options:
  - Transaction is blocked
  - Error is shown: "Insufficient balance for any fee option"
  - Error cause: "Add more funds to your wallet to cover the fee"
  - User can close modal and add funds

### Code Example

```typescript
import { MarketplaceProvider } from '@0xsequence/marketplace-sdk';

function App() {
  return (
    <MarketplaceProvider
      config={{
        projectAccessKey: 'pk_...',
        projectId: '12345',
        waasFeeOptionSelectionType: 'automatic', // Headless mode
      }}
    >
      <YourMarketplaceUI />
    </MarketplaceProvider>
  );
}
```

### Transaction Flow (Automatic Mode)

```
1. User clicks "Accept Offer"
   ↓
2. SDK checks if approval needed
   ↓ (if needed)
3. User approves token
   ↓
4. [AUTOMATIC] SDK fetches fee options
   ↓
5. [AUTOMATIC] SDK selects first option with balance
   ↓
6. [AUTOMATIC] SDK confirms selection
   ↓
7. Transaction executes
   ↓
8. Success! (or error if insufficient balance)
```

**No user interaction needed for fee selection.**

---

## Mode 2: Manual (Default)

**Configuration:** `waasFeeOptionSelectionType: 'manual'` or `undefined` (default)

### Integrator Experience

**What happens:**
1. User initiates a sell transaction
2. SDK fetches available fee options
3. Fee selection UI is shown in the modal
4. SDK pre-selects first option with sufficient balance
5. User can review and change the selected option
6. User must click confirm to proceed
7. Transaction executes after confirmation

**User Experience:**
- Full transparency - user sees all available fee options
- User can choose their preferred fee currency
- Each option shows:
  - Token name and symbol (e.g., "USDC")
  - Fee amount (e.g., "0.0025 USDC")
  - User's balance for that token
  - Whether they have sufficient balance (visual indicator)
- User must explicitly confirm their choice
- Best for first-time users or when transparency is important

**When to use:**
- Default/recommended mode
- When you want users to have full control
- When transparency is important for compliance
- Marketplaces with various price points
- When users may have preferences for fee currency
- First-time user experiences

**Error Handling:**
- User can see all options and their balances
- Options without sufficient balance are visually marked but still selectable
- If user selects an option without sufficient balance:
  - Transaction will fail
  - User can retry with different option

### Code Example

```typescript
import { MarketplaceProvider } from '@0xsequence/marketplace-sdk';

function App() {
  return (
    <MarketplaceProvider
      config={{
        projectAccessKey: 'pk_...',
        projectId: '12345',
        waasFeeOptionSelectionType: 'manual', // Default - can be omitted
      }}
    >
      <YourMarketplaceUI />
    </MarketplaceProvider>
  );
}

// Or simply omit the option (defaults to manual):
function AppWithDefaults() {
  return (
    <MarketplaceProvider
      config={{
        projectAccessKey: 'pk_...',
        projectId: '12345',
        // waasFeeOptionSelectionType defaults to 'manual'
      }}
    >
      <YourMarketplaceUI />
    </MarketplaceProvider>
  );
}
```

### Transaction Flow (Manual Mode)

```
1. User clicks "Accept Offer"
   ↓
2. SDK checks if approval needed
   ↓
3. [MANUAL] Fee selection UI appears FIRST
   ↓
4. [MANUAL] User reviews fee options:
       - Native token (ETH, MATIC, etc.)
       - Stablecoins (USDC, USDT, etc.)
       - Other ERC20s
   ↓
5. [MANUAL] User confirms selection
   ↓
6. Approve/Sell buttons become enabled
   ↓
7. User approves token (if needed)
   ↓
8. Transaction executes
   ↓
9. Success!
```

**Important:** Fee selection must be confirmed BEFORE any transactions can execute. The approve/sell buttons are disabled until fee is confirmed.

---

## Fee Selection UI (Manual Mode Only)

The fee selection UI shows:

```
┌─────────────────────────────────────────┐
│  Select Fee Payment Method              │
├─────────────────────────────────────────┤
│                                         │
│  ○ ETH                                  │
│    Fee: 0.0023 ETH                      │
│    Balance: 0.15 ETH         ✓          │
│                                         │
│  ● USDC (Selected)                      │
│    Fee: 3.45 USDC                       │
│    Balance: 50.00 USDC       ✓          │
│                                         │
│  ○ DAI                                  │
│    Fee: 3.47 DAI                        │
│    Balance: 0.00 DAI         ⚠️         │
│                                         │
│         [Confirm Fee Selection]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Accessing Flow Steps (Custom UI Integration)

If you're building a custom UI on top of the SellModal flow, you can access the steps array to track progress and display custom UI:

### Basic Usage

```typescript
import { useSellModalContext, type Step, type WaasFeeSelectionStep } from '@0xsequence/marketplace-sdk';

function CustomSellUI() {
  const { flow } = useSellModalContext();
  
  return (
    <div>
      <h2>Transaction Progress: {flow.progress}%</h2>
      
      {flow.steps.map((step) => (
        <div key={step.id}>
          <span>{step.label}</span>
          <span>{step.status}</span>
          {step.isPending && <Spinner />}
          {step.isSuccess && <CheckIcon />}
          {step.isError && <ErrorIcon />}
        </div>
      ))}
    </div>
  );
}
```

### Flow Object Structure

```typescript
type Flow = {
  steps: Step[];           // All steps in the flow
  nextStep: Step | undefined;  // The next step to execute
  status: 'idle' | 'pending' | 'success' | 'error';
  isPending: boolean;      // Any step is pending
  totalSteps: number;      // Total number of main steps (excludes fee selection)
  completedSteps: number;  // Number of completed main steps
  progress: number;        // 0-100 percentage
};
```

### Step Types

```typescript
type SellStepId = 'waas-fee-selection' | 'approve' | 'sell';

type Step = {
  id: SellStepId;
  label: string;           // Human-readable label
  status: string;          // 'idle' | 'pending' | 'success' | 'error'
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  run: () => void;         // Execute this step
};

// For type narrowing
type WaasFeeSelectionStep = Step & {
  id: 'waas-fee-selection';
  waasFee: {
    feeOptionConfirmation: WaasFeeOptionConfirmation;
    selectedOption: FeeOptionExtended | undefined;
    optionConfirmed: boolean;
    waasFeeSelectionError?: Error;
    setSelectedFeeOption: (option: FeeOptionExtended | undefined) => void;
    confirmFeeOption: (id: string, contractAddress: string | null) => void;
    rejectFeeOption: (id: string) => void;
    setOptionConfirmed: (confirmed: boolean) => void;
  };
};
```

### Step Behavior by Mode

#### Automatic Mode
- **Fee selection step:** NOT included in `flow.steps` array
- **Steps array:** `['approve'?, 'sell']`
- **totalSteps:** Excludes fee selection (1-2 steps)
- **progress:** Based on approve + sell only

```typescript
// Automatic mode - steps array example
[
  { id: 'approve', label: 'Approve Token', status: 'idle', ... },
  { id: 'sell', label: 'Accept Offer', status: 'idle', ... }
]
```

#### Manual Mode
- **Fee selection step:** Included as first step in `flow.steps` array
- **Steps array:** `['waas-fee-selection', 'approve'?, 'sell']`
- **totalSteps:** Excludes fee selection (still 1-2 steps)
- **progress:** Based on approve + sell only (fee selection doesn't count toward progress)
- **nextStep:** Will be `undefined` until fee is confirmed (blocks transaction buttons)

```typescript
// Manual mode - steps array example BEFORE fee confirmation
[
  { id: 'waas-fee-selection', label: 'Select Fee Option', status: 'idle', isSuccess: false, ... },
  { id: 'approve', label: 'Approve Token', status: 'idle', ... },
  { id: 'sell', label: 'Accept Offer', status: 'idle', ... }
]
// flow.nextStep = undefined (buttons disabled)

// Manual mode - steps array AFTER fee confirmation
[
  { id: 'waas-fee-selection', label: 'Select Fee Option', status: 'success', isSuccess: true, ... },
  { id: 'approve', label: 'Approve Token', status: 'idle', ... },
  { id: 'sell', label: 'Accept Offer', status: 'idle', ... }
]
// flow.nextStep = { id: 'approve', ... } (approve button enabled)
```

**Important:** The fee selection step MUST be confirmed before any transaction steps can execute. `flow.nextStep` will be `undefined` until fee confirmation is complete, which disables the approve/sell buttons in the default UI.

### Type Narrowing Example

```typescript
import { 
  useSellModalContext, 
  type Step, 
  type WaasFeeSelectionStep 
} from '@0xsequence/marketplace-sdk';

function CustomStepDisplay() {
  const { flow } = useSellModalContext();
  
  return (
    <div>
      {flow.steps.map((step) => {
        // Type narrow to access waasFee data
        if (step.id === 'waas-fee-selection') {
          const feeStep = step as WaasFeeSelectionStep;
          return (
            <div key={step.id}>
              <h3>{step.label}</h3>
              <p>Selected: {feeStep.waasFee.selectedOption?.token.name}</p>
              <p>Confirmed: {feeStep.waasFee.optionConfirmed ? 'Yes' : 'No'}</p>
              {feeStep.waasFee.waasFeeSelectionError && (
                <span>Error: {feeStep.waasFee.waasFeeSelectionError.message}</span>
              )}
            </div>
          );
        }
        
        // Regular step
        return (
          <div key={step.id}>
            <h3>{step.label}</h3>
            <p>Status: {step.status}</p>
          </div>
        );
      })}
    </div>
  );
}
```

### Custom Fee Selection UI (Manual Mode)

If you want to build your own fee selection UI in manual mode:

```typescript
import { useSellModalContext, type WaasFeeSelectionStep } from '@0xsequence/marketplace-sdk';

function CustomFeeSelector() {
  const { flow } = useSellModalContext();
  
  const feeStep = flow.steps.find(
    (s) => s.id === 'waas-fee-selection'
  ) as WaasFeeSelectionStep | undefined;
  
  if (!feeStep) return null; // Automatic mode or no fee selection needed
  
  const { waasFee } = feeStep;
  const options = waasFee.feeOptionConfirmation?.options || [];
  
  return (
    <div>
      <h3>Choose Fee Payment Method</h3>
      
      {options.map((option) => (
        <button
          key={option.token.contractAddress || 'native'}
          onClick={() => waasFee.setSelectedFeeOption(option)}
          disabled={waasFee.optionConfirmed}
        >
          <span>{option.token.name}</span>
          <span>Fee: {option.token.value} {option.token.symbol}</span>
          {option.hasEnoughBalanceForFee ? '✓' : '⚠️ Insufficient'}
        </button>
      ))}
      
      <button
        onClick={() => {
          const id = waasFee.feeOptionConfirmation?.id;
          const address = waasFee.selectedOption?.token.contractAddress || null;
          if (id) {
            waasFee.confirmFeeOption(id, address);
            waasFee.setOptionConfirmed(true);
          }
        }}
        disabled={!waasFee.selectedOption || waasFee.optionConfirmed}
      >
        Confirm Fee Selection
      </button>
    </div>
  );
}
```

### Progress Tracking Example

```typescript
function TransactionProgress() {
  const { flow } = useSellModalContext();
  
  return (
    <div>
      <h3>Transaction Progress</h3>
      <progress value={flow.completedSteps} max={flow.totalSteps} />
      <span>{flow.completedSteps} of {flow.totalSteps} completed</span>
      
      {/* Or use percentage */}
      <div style={{ width: '100%', background: '#eee' }}>
        <div style={{ width: `${flow.progress}%`, background: 'blue', height: '20px' }} />
      </div>
      
      {flow.nextStep && (
        <button onClick={flow.nextStep.run}>
          Continue: {flow.nextStep.label}
        </button>
      )}
    </div>
  );
}
```

---

## Comparison Table

| Feature | Automatic Mode | Manual Mode |
|---------|---------------|-------------|
| **User sees fee options** | ❌ No | ✅ Yes |
| **User can choose fee currency** | ❌ No | ✅ Yes |
| **User must confirm** | ❌ No | ✅ Yes |
| **Shows balance info** | ❌ No | ✅ Yes |
| **Transaction speed** | ⚡ Instant | 🐢 Requires confirmation |
| **Best for** | Headless flows, gaming | Transparency, control |
| **Default** | No | ✅ Yes |
| **Error visibility** | Low (modal only) | High (per-option) |

---

## Selection Logic

### Automatic Mode Selection Algorithm

```typescript
// Pseudocode for automatic selection
function selectFeeOptionAutomatic(options) {
  // 1. Get all available fee options from WaaS
  const feeOptions = await waas.getFeeOptions();
  
  // 2. Fetch user's token balances
  const balances = await indexer.getBalances(userAddress);
  
  // 3. Find first option where user has sufficient balance
  for (const option of feeOptions) {
    const userBalance = balances.find(b => 
      b.contractAddress === option.token.contractAddress
    );
    
    if (userBalance && BigInt(userBalance.balance) >= BigInt(option.value)) {
      return option; // First match wins
    }
  }
  
  // 4. If no option has sufficient balance, throw error
  throw new Error("Insufficient balance for any fee option");
}
```

**Order matters:** Fee options are checked in the order provided by WaaS (typically native token first, then ERC20s).

### Manual Mode Pre-selection

```typescript
// Pseudocode for manual mode pre-selection
function preselectFeeOptionManual(options) {
  // 1. Get all available fee options
  const feeOptions = await waas.getFeeOptions();
  
  // 2. Fetch user's token balances  
  const balances = await indexer.getBalances(userAddress);
  
  // 3. Find first option with sufficient balance (same as automatic)
  const firstWithBalance = feeOptions.find(option => {
    const userBalance = balances.find(b => 
      b.contractAddress === option.token.contractAddress
    );
    return userBalance && BigInt(userBalance.balance) >= BigInt(option.value);
  });
  
  // 4. Pre-select that option (or first option if none have balance)
  return firstWithBalance || feeOptions[0];
  
  // 5. Show UI - user can change selection before confirming
}
```

**Pre-selection is just a suggestion** - user can choose any option in manual mode.

---

## Migration Guide

### Upgrading from Previous Versions

If you were previously managing WaaS fees manually or had custom implementation:

#### Before (Custom Implementation)
```typescript
// You may have been handling fees manually
const [feeOption, setFeeOption] = useState();
const [feeConfirmation] = useWaasFeeOptions();

// Manual selection logic
useEffect(() => {
  if (feeConfirmation) {
    // Custom logic to select fee
    // Custom UI to show options
  }
}, [feeConfirmation]);
```

#### After (SDK Handles It)
```typescript
// Just configure the mode - SDK handles everything
<MarketplaceProvider
  config={{
    projectAccessKey: 'pk_...',
    projectId: '12345',
    waasFeeOptionSelectionType: 'automatic', // or 'manual'
  }}
>
  <YourApp />
</MarketplaceProvider>

// That's it! No manual fee handling needed.
```

### Default Behavior (No Breaking Changes)

If you don't specify `waasFeeOptionSelectionType`:
- Defaults to `'manual'` mode
- Existing integrations continue to work
- Users will see fee selection UI
- **No breaking changes**

To opt into automatic mode:
- Explicitly set `waasFeeOptionSelectionType: 'automatic'`

---

## Best Practices

### ✅ Do

1. **Use automatic mode** for:
   - Gaming applications with frequent transactions
   - Headless/embedded marketplace experiences
   - Internal tools where users are trusted
   - When transaction speed is critical

2. **Use manual mode** for:
   - First-time user experiences
   - High-value transactions
   - When transparency is required
   - Compliance-sensitive applications
   - When users may have fee currency preferences

3. **Handle errors gracefully:**
   ```typescript
   // The SDK will show errors, but you can also listen to them
   function SellButton() {
     const { sell } = useSellModalContext();
     
     return (
       <button onClick={() => sell.mutate()}>
         Accept Offer
       </button>
     );
   }
   ```

### ❌ Don't

1. **Don't** try to manually manage `useWaasFeeOptions` when using the SDK modals
   - The SDK handles this for you
   - Manual intervention can cause conflicts

2. **Don't** assume automatic mode will always succeed
   - User may have insufficient balance
   - Always handle the error case

3. **Don't** switch modes dynamically based on user state
   - Pick one mode for your entire application
   - Consistent UX is better than optimizing per user

---

## Testing Recommendations

### Testing Automatic Mode

1. **Happy path:**
   - User has balance in native token → Transaction succeeds
   - User has balance in USDC → Transaction succeeds

2. **Edge cases:**
   - User has no balance in any option → Shows error
   - User has balance in second option but not first → Uses second option
   - Network delays in balance fetching → Shows loading state

3. **Test on multiple chains:**
   - Polygon (MATIC as native)
   - Ethereum (ETH as native)
   - Different fee token availability per chain

### Testing Manual Mode

1. **Happy path:**
   - User reviews options → Selects one → Confirms → Succeeds

2. **Edge cases:**
   - User has no balance → All options marked as insufficient
   - User changes selection multiple times → Last selection is used
   - User closes modal → Fee confirmation is rejected

3. **UI states:**
   - Loading state while fetching options
   - Empty state (no options available)
   - Error state (network failure)

---

## FAQ

### Q: Can I switch modes dynamically?

**A:** Not recommended. The mode is configured at the provider level and should be consistent across your application. If you have different flows that need different modes, consider using separate provider instances.

### Q: What happens if user has insufficient balance in automatic mode?

**A:** The transaction will fail with an error message asking the user to add funds. The error is shown in the modal UI.

### Q: Can users opt out of automatic mode?

**A:** No. The mode is set by the integrator. If you want to give users control, use manual mode.

### Q: What order are fee options presented?

**A:** Fee options are provided by WaaS in order of preference (typically native token first, then stablecoins, then other ERC20s). In automatic mode, the first option with sufficient balance is selected. In manual mode, all options are shown in the same order.

### Q: Does this work with custom modals?

**A:** The configuration works with the built-in `SellModal` component. If you're building custom modals, you can use the `useAutoSelectFeeOption` hook directly:

```typescript
import { useAutoSelectFeeOption } from '@0xsequence/marketplace-sdk';

function CustomModal() {
  const autoSelect = useAutoSelectFeeOption({ enabled: true });
  // Use the hook in your custom flow
}
```

### Q: Are there any additional costs?

**A:** No. The SDK uses existing WaaS and Indexer APIs. No additional API calls beyond what was already needed for transaction execution.

### Q: Can I customize the fee selection logic?

**A:** The automatic selection logic (first option with sufficient balance) is built-in. If you need custom logic, use manual mode and guide users to select your preferred option via UI hints.

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/0xsequence/marketplace-sdk
- Documentation: https://docs.sequence.xyz
- Discord: https://discord.gg/sequence
