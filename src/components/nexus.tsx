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

interface NexusProps {
  isTestnet: boolean;
  activeTab: string;
}

const Nexus = ({ isTestnet, activeTab }: NexusProps) => {
  return (
    <Card className="bg-white shadow-2xl rounded-3xl border-none mx-auto w-[95%] max-w-4xl overflow-hidden">
      <div className="bg-white">
        <CardHeader className="flex flex-col w-full items-center px-8 pt-8 pb-6">
          <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-[#1E293B] mb-2">
            Welcome to Nexus
          </CardTitle>
          <CardDescription className="text-center text-[#64748B] max-w-2xl text-base">
            Experience seamless cross-chain interactions. Move tokens between chains, 
            execute smart contracts, and manage your assets all in one place.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 md:px-8 pb-8">
          <div className="bg-[#F8FAFF] rounded-2xl p-6">
            <NexusContentWrapper>
              {activeTab === "unified-balance" && <UnifiedBalance />}
              {activeTab === "bridge" && <NexusBridge isTestnet={isTestnet} />}
              {activeTab === "transfer" && <NexusTransfer isTestnet={isTestnet} />}
              {activeTab === "bridge-execute" && !isTestnet && <NexusBridgeAndExecute isTestnet={isTestnet} />}
            </NexusContentWrapper>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default Nexus;
