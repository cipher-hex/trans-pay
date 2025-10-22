# Source Chain Selection Feature

## Overview

The Source Chain Selection feature allows users to manually choose which blockchain networks (chains) they want to use as the source of funds for their cross-chain transfers. This gives users more control over which balances are used and can potentially optimize gas costs.

## How It Works

### User Flow

1. **Select Destination Chain**: User chooses where they want to send the tokens
2. **Select Token**: User selects which token to transfer (e.g., USDC, ETH)
3. **Select Source Chains (Optional)**: User can optionally select specific chains to use as funding sources
4. **Enter Amount & Recipient**: User specifies the transfer amount and recipient address
5. **Review & Confirm**: Cost simulation shows the total fees based on the selected configuration

### Default Behavior

- If **NO source chains are selected**: The SDK automatically uses all available chains with the selected token (SDK default behavior)
- If **source chains ARE selected**: Only those specific chains will be used for the transfer

## Components

### 1. SourceChainSelector Component

**Location**: `src/components/blocks/source-chain-selector.tsx`

A modal-based multi-select component that displays:
- Chain logos and names
- Available balance on each chain
- Total combined balance
- Selection checkboxes
- Filter/search capabilities

**Props**:
```typescript
interface SourceChainSelectorProps {
  availableChains: SourceChainOption[];      // List of chains with balances
  selectedChainIds: number[];                 // Currently selected chain IDs
  onSelectionChange: (chainIds: number[]) => void;  // Selection change handler
  destinationChainId: number;                 // Excluded from selection
  tokenSymbol?: string;                       // Token being transferred
  disabled?: boolean;                         // Disable interactions
}
```

### 2. useSourceChainBalances Hook

**Location**: `src/hooks/useSourceChainBalances.ts`

Fetches and manages balance data across all supported chains for a specific token.

**Parameters**:
```typescript
interface UseSourceChainBalancesParams {
  selectedToken?: SUPPORTED_TOKENS;          // Token to fetch balances for
  destinationChainId: SUPPORTED_CHAINS_IDS;  // Excluded from results
  isTestnet: boolean;                         // Mainnet vs testnet
}
```

**Returns**:
```typescript
interface UseSourceChainBalancesReturn {
  availableChains: SourceChainOption[];      // Chains with balances
  isLoading: boolean;                         // Loading state
  error: string | null;                       // Error message if any
  refetch: () => Promise<void>;              // Manually refetch balances
  totalBalance: string;                       // Total across all chains
}
```

## Integration

### In Transfer Component

The feature integrates seamlessly into the transfer flow:

```typescript
// 1. Fetch available source chain balances
const { availableChains, isLoading } = useSourceChainBalances({
  selectedToken: state.selectedToken,
  destinationChainId: state.selectedChain,
  isTestnet,
});

// 2. Render the selector (conditionally)
{state.selectedToken && availableChains.length > 0 && (
  <SourceChainSelector
    availableChains={availableChains}
    selectedChainIds={state.selectedSourceChains}
    onSelectionChange={handleSourceChainsChange}
    destinationChainId={state.selectedChain}
    tokenSymbol={state.selectedToken}
  />
)}

// 3. Include in transfer execution
await executeTransfer({
  token: state.selectedToken,
  amount: state.amount,
  chainId: state.selectedChain,
  recipient: state.recipientAddress,
  sourceChains: state.selectedSourceChains.length > 0 
    ? state.selectedSourceChains 
    : undefined,
});
```

## Validation

The system includes comprehensive validation:

### Balance Validation
- Checks if selected source chains have sufficient combined balance
- Shows error if insufficient funds on selected chains
- Displays available amount in error message

### Example:
```typescript
if (state.selectedSourceChains.length > 0) {
  const selectedChainsBalance = availableChains
    .filter((chain) => state.selectedSourceChains.includes(chain.chainId))
    .reduce((sum, chain) => sum + parseFloat(chain.balance || "0"), 0);

  if (selectedChainsBalance < parseFloat(state.amount)) {
    toast.error("Insufficient balance on selected source chains");
    return;
  }
}
```

## SDK Integration

The feature leverages the Avail Nexus SDK's `sourceChains` parameter:

```typescript
// SDK Transfer with source chains
const result = await sdk.transfer({
  token: 'USDC',
  amount: 100,
  chainId: 42161,  // Arbitrum
  recipient: '0x...',
  sourceChains: [84532, 80002],  // Base Sepolia & Polygon Amoy
});

// SDK Simulation with source chains
const simulation = await sdk.simulateTransfer({
  token: 'USDC',
  amount: 100,
  chainId: 42161,
  recipient: '0x...',
  sourceChains: [84532, 80002],
});
```

## Benefits

1. **User Control**: Users decide which chain balances to use
2. **Cost Optimization**: Select chains with lower fees
3. **Balance Management**: Use specific chain balances strategically
4. **Transparency**: Clear visibility of available balances per chain
5. **Flexibility**: Optional feature that defaults to SDK's automatic selection

## UI/UX Features

### Visual Indicators
- ✅ Checkmarks for selected chains
- 💰 Balance display per chain
- 📊 Total available balance
- 🔴 "No Balance" badges for chains with zero balance
- 🎨 Color-coded selection states

### Interaction
- **Select All**: Quick selection of all chains with balance
- **Clear All**: Remove all selections
- **Individual Toggle**: Click any chain to select/deselect
- **Auto-exclusion**: Destination chain automatically excluded

### Accessibility
- Disabled chains (no balance) are visually distinct
- Keyboard navigation support
- Clear labels and descriptions
- Tooltips for guidance

## Error Handling

The feature includes robust error handling:

1. **Network Errors**: Graceful fallback if balance fetch fails
2. **Insufficient Balance**: Clear error messages with available amounts
3. **Invalid Selection**: Prevents selection of invalid chains
4. **SDK Errors**: Proper error propagation and user feedback

## Testing Scenarios

1. ✅ Select single source chain
2. ✅ Select multiple source chains
3. ✅ Select no source chains (use all)
4. ✅ Select chains with insufficient combined balance
5. ✅ Change token and verify chain list updates
6. ✅ Change destination chain and verify exclusion
7. ✅ Simulate with different source chain combinations
8. ✅ Execute transfer with selected source chains

## Future Enhancements

Potential improvements for future versions:

1. **Smart Suggestions**: Recommend optimal chain combinations
2. **Fee Comparison**: Show estimated fees for different selections
3. **Historical Data**: Remember user's preferred selections
4. **Batch Operations**: Support multiple transfers with different sources
5. **Advanced Filtering**: Filter by gas costs, balance thresholds, etc.

## Related Documentation

- [Avail Nexus SDK - Transfer](https://docs.availproject.org/nexus/avail-nexus-sdk/nexus-core/transfer)
- [Chain Abstraction Concept](https://docs.availproject.org/nexus/concepts/chain-abstraction)
- [Intent System](https://docs.availproject.org/nexus/concepts/intent)

## Support

For issues or questions:
- Check the SDK documentation
- Review error messages in console
- Verify chain IDs are correct
- Ensure sufficient balance across selected chains
