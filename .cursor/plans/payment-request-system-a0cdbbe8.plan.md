<!-- a0cdbbe8-d56c-41d1-930e-3484bf7ab3c9 00e54b8b-8f44-434d-97f2-4b330939a483 -->
# Payment Request System Implementation

## Overview

Implement a decentralized payment request system using a Solidity smart contract deployed on Polygon. Merchants create payment requests stored on-chain, and payers fulfill them via Nexus cross-chain transfers.

## Phase 1: Smart Contract Development

### 1.1 Setup Hardhat Project

- Create `@back-end/` directory structure
- Initialize Hardhat with TypeScript
- Install dependencies: `hardhat`, `@nomicfoundation/hardhat-toolbox`, `@openzeppelin/contracts`
- Configure `hardhat.config.ts` with Polygon network settings

### 1.2 Create PaymentRequest Smart Contract

**File**: `@back-end/contracts/PaymentRequest.sol`

Core functionality:

- **State Variables**:
  - `uint256 public nextPaymentId` - counter for unique IDs
  - `mapping(uint256 => PaymentRequestData) public paymentRequests`
  - Struct: `PaymentRequestData { address merchant, address token, uint256 amount, uint256 timestamp, PaymentStatus status, address payer, uint256 paidAt }`
  - Enum: `PaymentStatus { Pending, Paid, Cancelled }`

- **Functions**:
  - `createPaymentRequest(address merchant, address token, uint256 amount)` returns `uint256 paymentId`
    - Validate token is USDC or USDT (hardcoded addresses for Polygon)
    - Increment `nextPaymentId`
    - Store payment request
    - Emit `PaymentRequestCreated` event

  - `getPaymentRequest(uint256 paymentId)` returns full payment details
    - Return struct with all fields
    - Revert if payment ID doesn't exist

  - `markAsPaid(uint256 paymentId, address payer)` 
    - Update status to Paid
    - Record payer address and timestamp
    - Emit `PaymentFulfilled` event
    - Only callable by merchant or contract owner (for verification)

  - `cancelPaymentRequest(uint256 paymentId)`
    - Only merchant can cancel
    - Update status to Cancelled
    - Emit `PaymentCancelled` event

- **Events**:
  - `PaymentRequestCreated(uint256 indexed paymentId, address indexed merchant, address token, uint256 amount)`
  - `PaymentFulfilled(uint256 indexed paymentId, address indexed payer, uint256 paidAt)`
  - `PaymentCancelled(uint256 indexed paymentId)`

### 1.3 Write Deployment Script

**File**: `@back-end/scripts/deploy.ts`

- Deploy `PaymentRequest` contract to Polygon
- Log deployed contract address
- Save address to `@back-end/deployments/polygon.json`

### 1.4 Contract Testing

**File**: `@back-end/test/PaymentRequest.test.ts`

- Test payment request creation
- Test retrieval of payment data
- Test marking as paid
- Test cancellation
- Test invalid payment ID handling

### 1.5 Deploy to Polygon

- Set up `.env` in `@back-end/` with `POLYGON_RPC_URL`, `PRIVATE_KEY`, `POLYGONSCAN_API_KEY`
- Run deployment script: `npx hardhat run scripts/deploy.ts --network polygon`
- Verify contract on Polygonscan: `npx hardhat verify --network polygon <address>`

## Phase 2: Frontend Integration

### 2.1 Add Contract Constants

**File**: `src/constants/paymentRequest.ts`

- Export deployed contract address
- Export contract ABI (generated from compilation)
- Export supported payment tokens: `['USDC', 'USDT']`
- Export Polygon token addresses for USDC/USDT

### 2.2 Create Payment Request Types

**File**: `src/types/payment-request.ts`

```typescript
export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Cancelled = 2
}

export interface PaymentRequestData {
  merchant: `0x${string}`;
  token: `0x${string}`;
  amount: string;
  timestamp: number;
  status: PaymentStatus;
  payer: `0x${string}` | null;
  paidAt: number | null;
}

export interface PaymentRequestFormData {
  merchantAddress: `0x${string}`;
  selectedToken: 'USDC' | 'USDT';
  requestedAmount: string;
}
```

### 2.3 Create Payment Request Hook

**File**: `src/hooks/usePaymentRequest.ts`

- Use `wagmi` hooks (`useWriteContract`, `useReadContract`)
- Function: `createPaymentRequest(merchant, token, amount)` - calls contract, returns paymentId
- Function: `getPaymentRequest(paymentId)` - reads from contract, returns PaymentRequestData
- Function: `markAsPaid(paymentId, payer)` - calls contract to mark paid
- Handle errors and loading states

### 2.4 Create Payment Request Component

**File**: `src/components/payment-request/create-payment-request.tsx`

UI elements:

- Input: Merchant Address (validated as 0x address)
- Select: Token (dropdown with USDC/USDT only)
- Input: Requested Amount (validated as positive number)
- Button: "Create Payment Request"
- Display generated Payment ID prominently after creation (copyable)
- Show success message with payment ID

Form validation:

- Valid Ethereum address for merchant
- Token must be USDC or USDT
- Amount > 0
- Handle contract transaction errors

### 2.5 Modify Transfer Component

**File**: `src/components/nexus-transfer.tsx`

Add before existing form:

- New section: "Pay with Payment ID (Optional)"
- Input field for Payment ID
- "Load Payment" button
- When clicked:
  - Call `getPaymentRequest(paymentId)` hook
  - If found: Auto-fill destination chain (Polygon), token, amount, merchant address
  - Show payment request details: merchant, amount, status, creation date
  - If status is already "Paid", show warning
  - Disable manual editing of pre-filled fields
- After successful transfer execution:
  - Call `markAsPaid()` on the contract
  - Show success message: "Payment fulfilled for Request #[ID]"
- Handle "Payment ID not found" error with clear message

### 2.6 Update Main Navigation

**Files**:

- `src/components/layout/header.tsx` - Add "Payment Request" tab
- `src/app/page.tsx` - Add activeTab condition for payment-request
- `src/components/nexus.tsx` - Import and render CreatePaymentRequest component when activeTab === "payment-request"

### 2.7 Add Payment Request Store (Optional)

**File**: `src/store/paymentRequestStore.ts`

- Store recently created payment IDs
- Cache loaded payment request data
- Persist to localStorage for user convenience

## Phase 3: User Experience Enhancements

### 3.1 Payment ID Display

- Format payment ID with leading zeros (e.g., #000042)
- Copy-to-clipboard button
- QR code generation for payment ID (optional, can use `qrcode.react` library)

### 3.2 Payment Status Badge

- Visual indicators: Pending (yellow), Paid (green), Cancelled (red)
- Show in Transfer tab when payment loaded

### 3.3 Error Handling

- Handle contract reverts gracefully
- Show user-friendly messages for:
  - Invalid payment ID
  - Already paid requests
  - Cancelled requests
  - Network errors

### 3.4 Transaction Tracking

- Integrate with existing transaction history
- Tag transfers made via payment ID
- Link payment requests to fulfilled transfers

## File Structure

```
@back-end/
├── contracts/
│   └── PaymentRequest.sol
├── scripts/
│   └── deploy.ts
├── test/
│   └── PaymentRequest.test.ts
├── deployments/
│   └── polygon.json
├── hardhat.config.ts
├── package.json
└── .env

src/
├── components/
│   ├── payment-request/
│   │   └── create-payment-request.tsx
│   └── nexus-transfer.tsx (modified)
├── hooks/
│   └── usePaymentRequest.ts
├── types/
│   └── payment-request.ts
├── constants/
│   └── paymentRequest.ts
└── store/
    └── paymentRequestStore.ts (optional)
```

## Testing Checklist

1. Create payment request on Polygon testnet/mainnet
2. Verify payment ID generation
3. Fetch payment data by ID in Transfer tab
4. Execute cross-chain payment via Nexus
5. Verify payment marked as "Paid" on-chain
6. Test invalid payment ID handling
7. Test already-paid request handling

### To-dos

- [ ] Setup Hardhat project in @back-end/ directory with TypeScript and Polygon network configuration
- [ ] Develop PaymentRequest.sol smart contract with create, read, and markAsPaid functions
- [ ] Write comprehensive tests for PaymentRequest contract
- [ ] Deploy contract to Polygon and verify on Polygonscan
- [ ] Add contract address, ABI, and token addresses to frontend constants
- [ ] Create TypeScript types for payment request data structures
- [ ] Implement usePaymentRequest hook with wagmi for contract interactions
- [ ] Build CreatePaymentRequest component with form validation
- [ ] Add payment ID input and auto-fill logic to Transfer tab
- [ ] Add Payment Request tab to header and routing logic
- [ ] End-to-end testing of create request, load by ID, and fulfill payment flow