/**
 * usePaymentRequest Hook
 * Custom hook for interacting with the PaymentRequest smart contract
 */

import { useCallback, useState } from "react";
import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useAccount 
} from "wagmi";
import { parseUnits, formatUnits, isAddress } from "viem";
import {
  PAYMENT_REQUEST_ABI,
  getPaymentRequestContractAddress,
  getTokenAddress,
  POLYGON_CHAIN_ID,
  POLYGON_AMOY_CHAIN_ID,
  formatPaymentId,
} from "@/constants/paymentRequest";
import {
  PaymentRequestData,
  PaymentRequestCreationResult,
  PaymentRequestRetrievalResult,
  PaymentMarkingResult,
  SupportedPaymentToken,
  PaymentStatus,
  FormattedPaymentRequestData,
} from "@/types/payment-request";
import { toast } from "sonner";

/**
 * Hook for creating payment requests
 */
export const useCreatePaymentRequest = (isTestnet: boolean = false) => {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createPaymentRequest = useCallback(
    async (
      merchantAddress: `0x${string}`,
      token: SupportedPaymentToken,
      amount: string
    ): Promise<PaymentRequestCreationResult> => {
      if (!address) {
        const error = "Please connect your wallet";
        setCreateError(error);
        return { success: false, error };
      }

      if (!isAddress(merchantAddress)) {
        const error = "Invalid merchant address";
        setCreateError(error);
        return { success: false, error };
      }

      if (!amount || parseFloat(amount) <= 0) {
        const error = "Invalid amount";
        setCreateError(error);
        return { success: false, error };
      }

      setIsCreating(true);
      setCreateError(null);

      try {
        const contractAddress = getPaymentRequestContractAddress(isTestnet);
        const tokenAddress = getTokenAddress(token, isTestnet);
        
        // Convert amount to wei (6 decimals for USDC/USDT)
        const amountWei = parseUnits(amount, 6);

        // Write to contract
        writeContract({
          address: contractAddress,
          abi: PAYMENT_REQUEST_ABI,
          functionName: "createPaymentRequest",
          args: [merchantAddress, tokenAddress, amountWei],
          chainId: isTestnet ? POLYGON_AMOY_CHAIN_ID : POLYGON_CHAIN_ID,
        });

        // Note: The actual payment ID will be available from the transaction receipt
        // For now, we return success without the ID
        return { success: true, transactionHash: hash };
      } catch (error: any) {
        const errorMessage = error?.message || "Failed to create payment request";
        setCreateError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsCreating(false);
      }
    },
    [address, writeContract, hash, isTestnet]
  );

  return {
    createPaymentRequest,
    isCreating: isCreating || isConfirming,
    isSuccess,
    createError: createError || writeError?.message || null,
    transactionHash: hash,
  };
};

/**
 * Hook for reading payment request data
 */
export const useGetPaymentRequest = (
  paymentId: number | null,
  isTestnet: boolean = false
) => {
  const contractAddress = getPaymentRequestContractAddress(isTestnet);

  const {
    data: rawData,
    error,
    isLoading,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: PAYMENT_REQUEST_ABI,
    functionName: "getPaymentRequest",
    args: paymentId ? [BigInt(paymentId)] : undefined,
    query: {
      enabled: paymentId !== null && paymentId > 0,
    },
    chainId: isTestnet ? POLYGON_AMOY_CHAIN_ID : POLYGON_CHAIN_ID,
  });

  const getPaymentRequest = useCallback(
    async (id: number): Promise<PaymentRequestRetrievalResult> => {
      if (id <= 0) {
        return { success: false, error: "Invalid payment ID", exists: false };
      }

      try {
        // Trigger a fresh read
        const result = await refetch();
        
        if (result.error) {
          return { success: false, error: result.error.message, exists: false };
        }

        if (!result.data) {
          return { success: false, error: "Payment request not found", exists: false };
        }

        // TypeScript fix: Handle the tuple return from contract
        const data = result.data as any;
        const merchant = data[0] as string;
        const token = data[1] as string;
        const amount = data[2] as bigint;
        const timestamp = data[3] as bigint;
        const status = data[4] as number;
        const payer = data[5] as string;
        const paidAt = data[6] as bigint;

        const paymentData: PaymentRequestData = {
          merchant: merchant as `0x${string}`,
          token: token as `0x${string}`,
          amount: amount.toString(),
          timestamp: Number(timestamp),
          status: status as PaymentStatus,
        payer: payer === "0x0000000000000000000000000000000000000000" ? null : (payer as `0x${string}`),
        paidAt: paidAt === BigInt(0) ? null : Number(paidAt),
        };

        return { success: true, data: paymentData, exists: true };
      } catch (error: any) {
        const errorMessage = error?.message || "Failed to fetch payment request";
        return { success: false, error: errorMessage, exists: false };
      }
    },
    [refetch]
  );

  // Format the current data if available
  const formattedData: PaymentRequestData | null = rawData
    ? {
        merchant: (rawData as any)[0] as `0x${string}`,
        token: (rawData as any)[1] as `0x${string}`,
        amount: (rawData as any)[2].toString(),
        timestamp: Number((rawData as any)[3]),
        status: (rawData as any)[4] as PaymentStatus,
        payer: (rawData as any)[5] === "0x0000000000000000000000000000000000000000" 
          ? null 
          : ((rawData as any)[5] as `0x${string}`),
        paidAt: (rawData as any)[6] === BigInt(0) ? null : Number((rawData as any)[6]),
      }
    : null;

  return {
    data: formattedData,
    isLoading,
    error: error?.message || null,
    refetch,
    getPaymentRequest,
  };
};

/**
 * Hook for marking payments as paid
 */
export const useMarkPaymentAsPaid = (isTestnet: boolean = false) => {
  const { address } = useAccount();
  const [isMarking, setIsMarking] = useState(false);
  const [markError, setMarkError] = useState<string | null>(null);

  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const markAsPaid = useCallback(
    async (paymentId: number, payerAddress: `0x${string}`): Promise<PaymentMarkingResult> => {
      if (!address) {
        const error = "Please connect your wallet";
        setMarkError(error);
        return { success: false, error };
      }

      if (!isAddress(payerAddress)) {
        const error = "Invalid payer address";
        setMarkError(error);
        return { success: false, error };
      }

      setIsMarking(true);
      setMarkError(null);

      try {
        const contractAddress = getPaymentRequestContractAddress(isTestnet);

        writeContract({
          address: contractAddress,
          abi: PAYMENT_REQUEST_ABI,
          functionName: "markAsPaid",
          args: [BigInt(paymentId), payerAddress],
          chainId: isTestnet ? POLYGON_AMOY_CHAIN_ID : POLYGON_CHAIN_ID,
        });

        return { success: true, transactionHash: hash };
      } catch (error: any) {
        const errorMessage = error?.message || "Failed to mark payment as paid";
        setMarkError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsMarking(false);
      }
    },
    [address, writeContract, hash, isTestnet]
  );

  return {
    markAsPaid,
    isMarking: isMarking || isConfirming,
    isSuccess,
    markError: markError || writeError?.message || null,
    transactionHash: hash,
  };
};

/**
 * Hook for checking if a payment request exists
 */
export const usePaymentExists = (paymentId: number | null, isTestnet: boolean = false) => {
  const contractAddress = getPaymentRequestContractAddress(isTestnet);

  const { data: exists, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: PAYMENT_REQUEST_ABI,
    functionName: "paymentExists",
    args: paymentId ? [BigInt(paymentId)] : undefined,
    query: {
      enabled: paymentId !== null && paymentId > 0,
    },
    chainId: isTestnet ? POLYGON_AMOY_CHAIN_ID : POLYGON_CHAIN_ID,
  });

  return {
    exists: Boolean(exists),
    isLoading,
    error: error?.message || null,
  };
};

/**
 * Utility hook for formatting payment request data for display
 */
export const useFormatPaymentRequest = (isTestnet: boolean = false) => {
  const formatPaymentRequest = useCallback(
    (data: PaymentRequestData, tokenSymbol: SupportedPaymentToken): FormattedPaymentRequestData => {
      return {
        ...data,
        formattedAmount: formatUnits(BigInt(data.amount), 6), // 6 decimals for USDC/USDT
        tokenSymbol,
        createdAt: new Date(data.timestamp * 1000),
        paidAtDate: data.paidAt ? new Date(data.paidAt * 1000) : null,
        statusLabel: data.status === PaymentStatus.Pending 
          ? "Pending" 
          : data.status === PaymentStatus.Paid 
          ? "Paid" 
          : "Cancelled",
        isActive: data.status === PaymentStatus.Pending,
      };
    },
    []
  );

  return { formatPaymentRequest };
};

/**
 * Combined hook that provides all payment request functionality
 */
export const usePaymentRequest = (isTestnet: boolean = false) => {
  const createHook = useCreatePaymentRequest(isTestnet);
  const markHook = useMarkPaymentAsPaid(isTestnet);
  const formatHook = useFormatPaymentRequest(isTestnet);

  const loadPaymentRequest = useCallback(
    async (paymentId: number): Promise<PaymentRequestRetrievalResult> => {
      // We'll need to create a fresh read for this
      // For now, this is a placeholder - the actual implementation will use useGetPaymentRequest
      return { success: false, error: "Not implemented", exists: false };
    },
    []
  );

  return {
    // Creation
    createPaymentRequest: createHook.createPaymentRequest,
    isCreating: createHook.isCreating,
    createError: createHook.createError,
    createSuccess: createHook.isSuccess,

    // Marking as paid
    markAsPaid: markHook.markAsPaid,
    isMarking: markHook.isMarking,
    markError: markHook.markError,
    markSuccess: markHook.isSuccess,

    // Utility
    formatPaymentRequest: formatHook.formatPaymentRequest,
    loadPaymentRequest,

    // Helper functions
    formatPaymentId,
  };
};
