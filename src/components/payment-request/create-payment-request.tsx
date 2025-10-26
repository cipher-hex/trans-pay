"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, AlertTriangle, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import { useCreatePaymentRequest } from "@/hooks/usePaymentRequest";
import { 
  SUPPORTED_PAYMENT_TOKENS, 
  formatPaymentId,
  getSupportedTokens 
} from "@/constants/paymentRequest";
import { 
  PaymentRequestFormData, 
  PaymentRequestComponentProps,
  SupportedPaymentToken 
} from "@/types/payment-request";

interface CreatePaymentRequestProps extends PaymentRequestComponentProps {
  className?: string;
}

const CreatePaymentRequest: React.FC<CreatePaymentRequestProps> = ({ 
  isTestnet = false, 
  onSuccess, 
  onError,
  className = ""
}) => {
  const { address, isConnected } = useAccount();
  
  // Form state
  const [formData, setFormData] = useState<PaymentRequestFormData>({
    merchantAddress: "" as `0x${string}`,
    selectedToken: "USDC",
    requestedAmount: "",
  });

  // UI state
  const [createdPaymentId, setCreatedPaymentId] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  // Hook for creating payment requests
  const { 
    createPaymentRequest, 
    isCreating, 
    createError, 
    createSuccess,
    transactionHash 
  } = useCreatePaymentRequest(isTestnet);

  // Get supported tokens for current network
  const supportedTokens = getSupportedTokens(isTestnet);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Validate merchant address
    if (!formData.merchantAddress) {
      errors.merchantAddress = "Merchant address is required";
    } else if (!isAddress(formData.merchantAddress)) {
      errors.merchantAddress = "Please enter a valid Ethereum address";
    }

    // Validate token selection
    if (!formData.selectedToken) {
      errors.selectedToken = "Please select a token";
    }

    // Validate amount
    if (!formData.requestedAmount) {
      errors.requestedAmount = "Amount is required";
    } else {
      const amount = parseFloat(formData.requestedAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.requestedAmount = "Please enter a valid amount greater than 0";
      } else if (amount > 1000000) {
        errors.requestedAmount = "Amount too large (max: 1,000,000)";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      const result = await createPaymentRequest(
        formData.merchantAddress,
        formData.selectedToken,
        formData.requestedAmount
      );

      if (result.success) {
        // For now, we'll simulate a payment ID since we don't have event parsing yet
        // In a real implementation, you'd parse the transaction receipt for the PaymentRequestCreated event
        const simulatedPaymentId = Math.floor(Math.random() * 1000) + 1;
        setCreatedPaymentId(simulatedPaymentId);
        
        toast.success("Payment request created successfully!", {
          description: `Payment ID: ${formatPaymentId(simulatedPaymentId)}`,
          duration: 5000,
        });

        // Reset form
        setFormData({
          merchantAddress: "" as `0x${string}`,
          selectedToken: "USDC",
          requestedAmount: "",
        });
        setValidationErrors({});

        // Call onSuccess callback if provided
        onSuccess?.(simulatedPaymentId);
      } else {
        toast.error("Failed to create payment request", {
          description: result.error,
        });
        onError?.(result.error || "Unknown error");
      }
    } catch (error: any) {
      console.error("Error creating payment request:", error);
      toast.error("Unexpected error occurred");
      onError?.(error.message || "Unexpected error");
    }
  }, [formData, isConnected, validateForm, createPaymentRequest, onSuccess, onError]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof PaymentRequestFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Copy payment ID to clipboard
  const copyPaymentId = useCallback(async () => {
    if (createdPaymentId) {
      const formattedId = formatPaymentId(createdPaymentId);
      await navigator.clipboard.writeText(formattedId);
      setShowCopiedFeedback(true);
      toast.success("Payment ID copied to clipboard!");
      
      setTimeout(() => setShowCopiedFeedback(false), 2000);
    }
  }, [createdPaymentId]);

  // Set max amount to self address (for testing)
  const setMerchantToSelf = useCallback(() => {
    if (address) {
      handleInputChange('merchantAddress', address);
    }
  }, [address, handleInputChange]);

  return (
    <div className={`flex flex-col gap-y-4 py-4 ${className}`}>
      {/* Success State - Show created payment ID */}
      {createdPaymentId && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <div className="text-lg font-semibold text-green-800 mb-1">
                  Payment Request Created!
                </div>
                <div className="text-sm text-green-700 mb-2">
                  Share this Payment ID with your customer:
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-mono bg-white px-3 py-1">
                    {formatPaymentId(createdPaymentId)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPaymentId}
                    className="h-8 px-2 text-green-600 hover:text-green-700"
                  >
                    {showCopiedFeedback ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            {transactionHash && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="text-xs text-green-600">
                  Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {createError && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <AlertDescription className="text-red-700">
            {createError}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <Card className="border-none py-4 !shadow-[var(--ck-connectbutton-box-shadow)] !rounded-[var(--ck-connectbutton-border-radius)] bg-accent-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Create Payment Request</CardTitle>
          <CardDescription>
            Generate a payment request that customers can fulfill via cross-chain transfers
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Merchant Address */}
            <div className="space-y-2">
              <Label htmlFor="merchantAddress" className="text-sm font-semibold">
                Merchant Address
              </Label>
              <div className="relative">
                <Input
                  id="merchantAddress"
                  type="text"
                  placeholder="0x..."
                  value={formData.merchantAddress}
                  onChange={(e) => handleInputChange('merchantAddress', e.target.value)}
                  className={`pr-20 ${validationErrors.merchantAddress ? 'border-red-500' : ''}`}
                />
                {address && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setMerchantToSelf}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 h-6"
                  >
                    Use Mine
                  </Button>
                )}
              </div>
              {validationErrors.merchantAddress && (
                <p className="text-sm text-red-600">{validationErrors.merchantAddress}</p>
              )}
            </div>

            {/* Token Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Payment Token</Label>
              <Select
                value={formData.selectedToken}
                onValueChange={(value: SupportedPaymentToken) => handleInputChange('selectedToken', value)}
              >
                <SelectTrigger className={validationErrors.selectedToken ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_PAYMENT_TOKENS.map((token) => {
                    const tokenInfo = supportedTokens[token];
                    return (
                      <SelectItem key={token} value={token}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{token}</span>
                          <span className="text-sm text-muted-foreground">
                            {tokenInfo.name}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {validationErrors.selectedToken && (
                <p className="text-sm text-red-600">{validationErrors.selectedToken}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Requested Amount
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="0.0"
                  value={formData.requestedAmount}
                  onChange={(e) => handleInputChange('requestedAmount', e.target.value)}
                  className={`pr-20 ${validationErrors.requestedAmount ? 'border-red-500' : ''}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {formData.selectedToken}
                </div>
              </div>
              {validationErrors.requestedAmount && (
                <p className="text-sm text-red-600">{validationErrors.requestedAmount}</p>
              )}
            </div>

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="w-4 h-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Payment requests are stored on-chain. Customers can pay from any supported network 
                and the funds will arrive on Polygon.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isConnected || isCreating}
              className="w-full font-semibold"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Request...
                </>
              ) : !isConnected ? (
                "Connect Wallet to Create"
              ) : (
                "Create Payment Request"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePaymentRequest;

