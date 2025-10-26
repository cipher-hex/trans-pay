/**
 * Payment Request Constants
 * Contract addresses, ABIs, and token information for the payment request system
 */

import { SupportedPaymentToken, TokenInfo } from "@/types/payment-request";

/**
 * PaymentRequest contract address on Polygon mainnet
 * TODO: Update this after deploying the contract
 */
export const PAYMENT_REQUEST_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

/**
 * PaymentRequest contract address on Polygon Amoy testnet (for testing)
 * TODO: Update this after deploying to testnet
 */
export const PAYMENT_REQUEST_CONTRACT_ADDRESS_TESTNET = "0x0000000000000000000000000000000000000000" as const;

/**
 * Polygon Chain ID
 */
export const POLYGON_CHAIN_ID = 137;

/**
 * Polygon Amoy Testnet Chain ID
 */
export const POLYGON_AMOY_CHAIN_ID = 80002;

/**
 * Supported payment tokens on Polygon mainnet
 */
export const POLYGON_TOKENS: Record<SupportedPaymentToken, TokenInfo> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    decimals: 6,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    decimals: 6,
  },
} as const;

/**
 * Supported payment tokens on Polygon Amoy testnet
 * Note: These are testnet addresses - update with actual testnet token addresses
 */
export const POLYGON_AMOY_TOKENS: Record<SupportedPaymentToken, TokenInfo> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin (Testnet)',
    address: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
    decimals: 6,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD (Testnet)',
    address: '0xf9f98365566f4d55234f24b99caa1afbe6428d44',
    decimals: 6,
  },
} as const;

/**
 * PaymentRequest contract ABI
 * Essential functions and events for frontend interaction
 */
export const PAYMENT_REQUEST_ABI = [
  // Functions
  {
    "type": "function",
    "name": "createPaymentRequest",
    "inputs": [
      { "name": "merchant", "type": "address" },
      { "name": "token", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "paymentId", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getPaymentRequest",
    "inputs": [{ "name": "paymentId", "type": "uint256" }],
    "outputs": [
      {
        "name": "requestData",
        "type": "tuple",
        "components": [
          { "name": "merchant", "type": "address" },
          { "name": "token", "type": "address" },
          { "name": "amount", "type": "uint256" },
          { "name": "timestamp", "type": "uint256" },
          { "name": "status", "type": "uint8" },
          { "name": "payer", "type": "address" },
          { "name": "paidAt", "type": "uint256" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "markAsPaid",
    "inputs": [
      { "name": "paymentId", "type": "uint256" },
      { "name": "payer", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "cancelPaymentRequest",
    "inputs": [{ "name": "paymentId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "paymentExists",
    "inputs": [{ "name": "paymentId", "type": "uint256" }],
    "outputs": [{ "name": "exists", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCurrentPaymentId",
    "inputs": [],
    "outputs": [{ "name": "currentId", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSupportedTokens",
    "inputs": [],
    "outputs": [
      { "name": "usdc", "type": "address" },
      { "name": "usdt", "type": "address" }
    ],
    "stateMutability": "pure"
  },
  // Events
  {
    "type": "event",
    "name": "PaymentRequestCreated",
    "inputs": [
      { "name": "paymentId", "type": "uint256", "indexed": true },
      { "name": "merchant", "type": "address", "indexed": true },
      { "name": "token", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "PaymentFulfilled",
    "inputs": [
      { "name": "paymentId", "type": "uint256", "indexed": true },
      { "name": "payer", "type": "address", "indexed": true },
      { "name": "paidAt", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "PaymentCancelled",
    "inputs": [
      { "name": "paymentId", "type": "uint256", "indexed": true },
      { "name": "cancelledAt", "type": "uint256", "indexed": false }
    ]
  },
  // Custom Errors
  {
    "type": "error",
    "name": "InvalidToken",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAmount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PaymentRequestNotFound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PaymentAlreadyFulfilled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PaymentAlreadyCancelled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnauthorizedCancellation",
    "inputs": []
  }
] as const;

/**
 * Helper function to get contract address based on network
 */
export const getPaymentRequestContractAddress = (isTestnet: boolean): `0x${string}` => {
  return (isTestnet ? PAYMENT_REQUEST_CONTRACT_ADDRESS_TESTNET : PAYMENT_REQUEST_CONTRACT_ADDRESS) as `0x${string}`;
};

/**
 * Helper function to get supported tokens based on network
 */
export const getSupportedTokens = (isTestnet: boolean): Record<SupportedPaymentToken, TokenInfo> => {
  return isTestnet ? POLYGON_AMOY_TOKENS : POLYGON_TOKENS;
};

/**
 * Helper function to get token info by symbol
 */
export const getTokenInfo = (symbol: SupportedPaymentToken, isTestnet: boolean): TokenInfo => {
  const tokens = getSupportedTokens(isTestnet);
  return tokens[symbol];
};

/**
 * Helper function to get token address by symbol
 */
export const getTokenAddress = (symbol: SupportedPaymentToken, isTestnet: boolean): `0x${string}` => {
  const tokenInfo = getTokenInfo(symbol, isTestnet);
  return tokenInfo.address;
};

/**
 * Payment ID formatting configuration
 */
export const PAYMENT_ID_CONFIG = {
  PREFIX: '#',
  MIN_LENGTH: 6,
  FILL_CHAR: '0',
} as const;

/**
 * Helper function to format payment ID for display
 */
export const formatPaymentId = (paymentId: number): string => {
  return `${PAYMENT_ID_CONFIG.PREFIX}${paymentId.toString().padStart(PAYMENT_ID_CONFIG.MIN_LENGTH, PAYMENT_ID_CONFIG.FILL_CHAR)}`;
};

/**
 * Helper function to parse payment ID from formatted string
 */
export const parsePaymentId = (formattedId: string): number | null => {
  const cleanId = formattedId.replace(PAYMENT_ID_CONFIG.PREFIX, '');
  const parsed = parseInt(cleanId, 10);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Supported payment token symbols array
 */
export const SUPPORTED_PAYMENT_TOKENS: SupportedPaymentToken[] = ['USDC', 'USDT'] as const;

/**
 * Status labels for payment requests
 */
export const PAYMENT_STATUS_LABELS = {
  0: 'Pending',
  1: 'Paid', 
  2: 'Cancelled',
} as const;
