import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import UnifiedBalance from "./unified-balance";
import NexusContentWrapper from "./blocks/nexus-content-wrapper";
import NexusTransfer from "./nexus-transfer";
import NexusBridge from "./bridge/nexus-bridge";
import NexusBridgeAndExecute from "./nexus-bridge-execute";
import CreatePaymentRequest from "./payment-request/create-payment-request";

interface NexusProps {
  isTestnet: boolean;
  activeTab: string;
}

const Nexus = ({ isTestnet, activeTab }: NexusProps) => {
  return (
    <Card className="bg-white shadow-2xl rounded-3xl border-none mx-auto w-[95%] max-w-4xl overflow-hidden">
      <div className="bg-white">
        <CardHeader className="flex flex-col w-full items-center px-8 pt-8 pb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl font-bold text-white">TP</span>
          </div>
          <CardTitle className="text-3xl font-bold text-[#1E293B] mb-2">
            Welcome to Trans-Pay
          </CardTitle>
          <CardDescription className="text-center text-[#64748B] max-w-2xl text-base">
            Create payment requests, accept payments from any blockchain, and manage 
            cross-chain transfers seamlessly. The future of decentralized payments.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 md:px-8 pb-8">
          <div className="bg-[#F8FAFF] rounded-2xl p-6">
            <NexusContentWrapper>
              {activeTab === "unified-balance" && <UnifiedBalance />}
              {activeTab === "bridge" && <NexusBridge isTestnet={isTestnet} />}
              {activeTab === "transfer" && <NexusTransfer isTestnet={isTestnet} />}
              {activeTab === "payment-request" && <CreatePaymentRequest isTestnet={isTestnet} />}
              {activeTab === "bridge-execute" && !isTestnet && <NexusBridgeAndExecute isTestnet={isTestnet} />}
            </NexusContentWrapper>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default Nexus;
