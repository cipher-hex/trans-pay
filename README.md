# Trans-Pay - Cross-Chain Payment Request System

A comprehensive payment request and cross-chain transfer application built with the [Avail Nexus SDK](https://www.npmjs.com/package/@avail-project/nexus-core), enabling merchants to create payment requests and customers to pay from any supported blockchain network.

## 🌟 Overview

Trans-Pay is a revolutionary decentralized payment platform that enables merchants to create payment requests on any blockchain and allows customers to pay from any supported network. Built with the powerful Avail Nexus SDK, Trans-Pay eliminates the complexity of cross-chain payments, making it as simple as sharing a payment ID.

**Perfect for:**
- E-commerce merchants accepting crypto payments
- Freelancers invoicing clients across different blockchains
- Service providers requiring cross-chain payment flexibility
- Anyone who needs to request and receive payments in USDC/USDT

### Key Features

- **💳 Payment Request System**: Create on-chain payment requests with unique IDs on 7 major blockchains
- **🌐 Multi-Chain Support**: Accept payments on Ethereum, Optimism, Polygon, Arbitrum, Avalanche, Base, and BNB Chain
- **🔍 Payment ID Lookup**: Customers can search by payment ID and auto-fill all payment details
- **🌉 Cross-Chain Bridging**: Transfer tokens between supported blockchain networks seamlessly
- **💸 Flexible Transfers**: Send tokens to any address with optional payment request fulfillment
- **💰 Unified Balance**: View all your assets across multiple chains in one place
- **📊 Transaction History**: Track and monitor all transactions with real-time status updates
- **👛 Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and other popular wallets
- **🎨 Modern UI**: Clean, intuitive interface with informative guides for each feature
- **⚡ Real-time Updates**: Live transaction progress tracking and instant notifications
- **🔐 On-Chain Storage**: Payment requests stored securely on blockchain for transparency

## 🏗️ Architecture

Trans-Pay is built on three core functionalities powered by the Avail Nexus SDK:

### 1. 💳 Payment Request System

**For Merchants:**
- Create on-chain payment requests with unique Payment IDs
- Choose from 7 supported blockchains (Ethereum, Optimism, Polygon, Arbitrum, Avalanche, Base, BNB)
- Specify merchant address, token (USDC/USDT), and payment amount
- Share the generated Payment ID with customers
- Payment requests are stored on-chain for transparency and security

**For Customers:**
- Enter Payment ID in the Transfer tab to load payment details
- All merchant information auto-fills (address, amount, token, chain)
- Pay from any supported blockchain using cross-chain transfer
- Payment is automatically marked as fulfilled on-chain

### 2. 🌉 Cross-Chain Bridge

- Transfer tokens between any supported blockchain networks
- Automatic route optimization for best rates and lowest fees
- Real-time transaction simulation and cost estimation
- Source chain selection for custom balance usage
- Support for popular tokens (ETH, USDC, USDT, MATIC, AVAX, BNB)

### 3. 💸 Direct Transfers

- Send tokens to any wallet address across different chains
- Payment ID integration for fulfilling payment requests
- Multi-chain source selection for optimal routing
- Recipient address validation and gas estimation
- Automatic payment completion tracking

### 4. 📊 Unified Balance Dashboard

- View all token balances across multiple blockchains in one place
- Real-time aggregation of assets with USD values
- Quick overview of portfolio distribution
- Instant balance refresh functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/trans-pay.git
   cd trans-pay
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables))

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# WalletConnect Project ID (required for wallet connections)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### Getting a WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to your `.env.local` file

## 🎯 Usage Guide

### 1. Connect Your Wallet 👛

1. Click "Connect Wallet" in the top right corner
2. Choose your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection request
4. Your wallet address will appear once connected

### 2. Create a Payment Request (Merchants) 💳

1. Navigate to the **"Payment Request"** tab
2. Read the information card to understand the features
3. Fill in the payment details:
   - **Merchant Address**: Enter your wallet address (or click "Use Mine")
   - **Destination Blockchain**: Select where you want to receive payment
   - **Payment Token**: Choose USDC or USDT
   - **Requested Amount**: Enter the payment amount
4. Click "Create Payment Request"
5. Copy the generated Payment ID (e.g., #000042)
6. Share this Payment ID with your customer

### 3. Pay a Payment Request (Customers) 💸

1. Go to the **"Transfer"** tab
2. In the "Pay with Payment ID" section at the top:
   - Enter the Payment ID you received
   - Click "Load" button
3. Payment details will auto-fill:
   - Merchant address
   - Token and amount
   - Destination chain
4. Select source chains (optional) for custom routing
5. Review the cost estimate
6. Click "Fulfill Payment Request"
7. The payment will be marked as completed on-chain

### 4. Bridge Tokens 🌉

1. Navigate to the **"Bridge"** tab
2. View the information card for bridge advantages
3. Select your destination chain
4. Choose token and enter amount
5. Optionally select specific source chains
6. Review transaction simulation and fees
7. Click "Continue" to execute the bridge

### 5. Direct Transfer 💰

1. Go to the **"Transfer"** tab
2. Select the destination blockchain
3. Choose token and enter amount
4. Input recipient wallet address
5. Select source chains (optional)
6. Review cost estimate
7. Click "Continue" to send tokens

### 6. Check Your Balances 📊

1. Navigate to the **"Unified Balance"** tab
2. View all your tokens across all supported chains
3. See real-time USD values and distribution
4. Click refresh to update balances

### 7. Monitor Transactions 🔍

- View real-time progress in the transaction tracker
- Check transaction history for past operations
- Track payment request status (Pending/Paid/Cancelled)
- Click on transactions to view details on block explorer

## 🌐 Supported Networks

Trans-Pay supports 7 major blockchain networks for payment requests:

| Blockchain | Chain ID | Native Token | Payment Requests | Transfers | Bridge |
|------------|----------|--------------|------------------|-----------|--------|
| **Ethereum** | 1 | ETH | ✅ | ✅ | ✅ |
| **Optimism** | 10 | ETH | ✅ | ✅ | ✅ |
| **Polygon** | 137 | MATIC | ✅ | ✅ | ✅ |
| **Arbitrum** | 42161 | ETH | ✅ | ✅ | ✅ |
| **Avalanche** | 43114 | AVAX | ✅ | ✅ | ✅ |
| **Base** | 8453 | ETH | ✅ | ✅ | ✅ |
| **BNB Chain** | 56 | BNB | ✅ | ✅ | ✅ |

**Additional networks supported for transfers and bridging:**
- Linea, Scroll, and other Nexus SDK supported networks

## 🛠️ Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Web3**: Wagmi, Viem, ConnectKit
- **State Management**: Zustand with persistence
- **SDK**: Avail Nexus SDK v0.0.5
- **Notifications**: Sonner toast notifications

## 📁 Project Structure

```
Trans-Pay/
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── page.tsx             # Main page with tab management
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── globals.css          # Global styles
│   │
│   ├── components/
│   │   ├── payment-request/     # Payment request system
│   │   │   └── create-payment-request.tsx
│   │   │
│   │   ├── bridge/              # Bridge functionality
│   │   │   ├── nexus-bridge.tsx
│   │   │   ├── bridge-form.tsx
│   │   │   ├── transaction-history.tsx
│   │   │   └── transaction-progress.tsx
│   │   │
│   │   ├── blocks/              # Reusable UI blocks
│   │   │   ├── chain-select.tsx
│   │   │   ├── token-select.tsx
│   │   │   ├── source-chain-selector.tsx
│   │   │   └── connect-wallet.tsx
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   └── header.tsx
│   │   │
│   │   ├── shared/              # Shared components
│   │   │   ├── simulation-preview.tsx
│   │   │   └── intent-progress.tsx
│   │   │
│   │   ├── nexus-modals/        # SDK interaction modals
│   │   │   ├── intent-modal.tsx
│   │   │   └── allowance-modal.tsx
│   │   │
│   │   ├── ui/                  # Radix UI components (shadcn/ui)
│   │   ├── nexus.tsx            # Main orchestrator with tab info cards
│   │   ├── nexus-transfer.tsx   # Transfer & payment fulfillment
│   │   └── unified-balance.tsx  # Balance dashboard
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePaymentRequest.ts           # Payment request operations
│   │   ├── useBridgeTransaction.ts        # Bridge logic
│   │   ├── useTransferTransaction.ts      # Transfer logic
│   │   ├── useSourceChainBalances.ts      # Multi-chain balances
│   │   └── useTransactionProgress.ts      # Progress tracking
│   │
│   ├── types/                   # TypeScript definitions
│   │   ├── payment-request.ts             # Payment request types
│   │   ├── bridge.ts                      # Bridge types
│   │   └── transaction.ts                 # Transaction types
│   │
│   ├── constants/               # Configuration
│   │   ├── paymentRequest.ts              # Payment contract & ABI
│   │   └── tokenAddresses.ts              # Token mappings
│   │
│   ├── store/                   # Zustand state management
│   │   ├── bridgeStore.ts
│   │   └── swapStore.ts
│   │
│   ├── provider/                # React context providers
│   │   ├── NexusProvider.tsx              # Nexus SDK initialization
│   │   └── Web3Provider.tsx               # Wagmi + ConnectKit
│   │
│   └── lib/                     # Utilities
│       └── bridge/
│           ├── errorHandling.ts
│           └── formatters.ts
│
└── @back-end/                   # Smart contracts (Hardhat)
    ├── contracts/
    │   └── PaymentRequest.sol   # Payment request contract
    ├── scripts/
    │   └── deploy.ts            # Deployment script
    ├── test/
    │   └── PaymentRequest.test.ts
    └── hardhat.config.ts
```

## 🔍 Key Components

### Frontend Components

- **CreatePaymentRequest**: Payment request creation form with multi-chain support
- **NexusTransfer**: Token transfer interface with payment ID lookup and auto-fill
- **NexusBridge**: Cross-chain token bridging with route optimization
- **UnifiedBalance**: Multi-chain balance aggregation dashboard
- **SourceChainSelector**: Multi-select interface for choosing source chains
- **TabInfoCard**: Dynamic information cards explaining each feature
- **TransactionHistory**: Historical transaction tracking with status
- **IntentModal**: SDK intent confirmation interface
- **AllowanceModal**: Token approval management

### Smart Contracts

- **PaymentRequest.sol**: On-chain payment request storage and management
  - Create payment requests with unique IDs
  - Retrieve payment data by ID
  - Mark payments as fulfilled
  - Cancel payment requests

## 🧪 Features in Detail

### 💳 Payment Request System

- **On-Chain Storage**: Payment requests stored on blockchain for transparency
- **Unique Payment IDs**: Easy-to-share formatted IDs (e.g., #000042)
- **Multi-Chain Support**: Create requests on any of 7 major blockchains
- **Status Tracking**: Real-time status updates (Pending/Paid/Cancelled)
- **Copy to Clipboard**: Quick sharing of payment IDs
- **Auto-Fill Integration**: Customers can load payment details instantly

### 🔄 Transaction Management

- **Persistent History**: Transaction tracking in local storage
- **Real-Time Updates**: Live status updates using SDK events
- **Progress Tracking**: Step-by-step transaction progress display
- **Error Handling**: Comprehensive error messages and recovery options
- **Cross-Chain Routing**: Automatic optimization for best rates

### 🎨 User Experience

- **Informative Cards**: Each tab displays helpful feature guides
- **Form Validation**: Real-time validation with helpful error messages
- **Cost Estimation**: Pre-transaction simulation and fee calculation
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Visual Feedback**: Loading states, success notifications, and error alerts
- **Source Chain Selection**: Custom balance routing for optimal costs

### 👨‍💻 Developer Features

- **Full TypeScript**: Type-safe development with comprehensive types
- **Modular Architecture**: Clean component separation and reusability
- **State Management**: Zustand stores with localStorage persistence
- **Error Boundaries**: Graceful error handling throughout the app
- **SDK Integration**: Easy-to-follow Nexus SDK implementation examples
- **Smart Contracts**: Production-ready Solidity contracts with full test coverage

## 💡 Use Cases

Trans-Pay is perfect for various payment scenarios:

### 🛍️ E-Commerce
- Create payment requests for online orders
- Accept payments from customers on any blockchain
- Automatic order fulfillment tracking via payment status

### 💼 Freelancing
- Invoice clients with unique payment IDs
- Receive payments in USDC/USDT from any network
- Track payment status for accounting purposes

### 🤝 Service Providers
- Generate payment requests for services rendered
- Support clients across different blockchain ecosystems
- Maintain transparent on-chain payment records

### 🎫 Event Ticketing
- Issue payment requests for ticket purchases
- Accept payments from global audience on multiple chains
- Verify payments on-chain automatically

### 💰 Peer-to-Peer Payments
- Request money from friends across chains
- Split bills with multi-chain payment support
- Track and verify all payment settlements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Resources

### Documentation
- [Avail Nexus SDK Documentation](https://www.npmjs.com/package/@avail-project/nexus-core)
- [Avail Project Website](https://www.availproject.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/)

### Smart Contract
- **PaymentRequest.sol**: Solidity contract for on-chain payment requests
- **Deployment**: Polygon mainnet (update contract address after deployment)
- **Testing**: Comprehensive test coverage with Hardhat

### Community
- [Avail Discord](https://discord.gg/avail) - Join the community
- [Avail Twitter](https://twitter.com/availproject) - Follow for updates

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/trans-pay/issues) page
2. Review the [Avail Nexus SDK Documentation](https://www.npmjs.com/package/@avail-project/nexus-core)
3. Join the [Avail Discord](https://discord.gg/avail) community
4. Read the inline documentation in the code

## 🚀 Roadmap

Future enhancements planned for Trans-Pay:

- [ ] Multi-token support (add more ERC20 tokens)
- [ ] Payment request expiration and refunds
- [ ] QR code generation for payment IDs
- [ ] Email/SMS notifications for payment status
- [ ] Merchant dashboard with analytics
- [ ] Batch payment request creation
- [ ] Recurring payment requests
- [ ] Invoice PDF generation
- [ ] API for integration with external systems

---

**Built with ❤️ using Avail Nexus SDK**

*Trans-Pay - Making cross-chain payments simple, secure, and accessible for everyone.*
