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
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#5FA3E8] p-1">
        <div className="bg-white rounded-t-3xl">
          <CardHeader className="flex flex-col w-full items-center px-8 pt-8 pb-6">
            <div className="w-20 h-20 bg-[#E6F3FF] rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold text-[#1A3A52] mb-2">
              Welcome to Nexus
            </CardTitle>
            <CardDescription className="text-center text-[#5A7A94] max-w-2xl text-base">
              Experience seamless cross-chain interactions. Move tokens between chains, 
              execute smart contracts, and manage your assets all in one place.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 md:px-8 pb-8">
            <div className="bg-[#F5F9FF] rounded-2xl p-6">
              <NexusContentWrapper>
                {activeTab === "unified-balance" && <UnifiedBalance />}
                {activeTab === "bridge" && <NexusBridge isTestnet={isTestnet} />}
                {activeTab === "transfer" && <NexusTransfer isTestnet={isTestnet} />}
                {activeTab === "bridge-execute" && !isTestnet && <NexusBridgeAndExecute isTestnet={isTestnet} />}
              </NexusContentWrapper>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F0F7FF] rounded-xl p-4 border border-[#B8D4ED]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4A90E2] bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A3A52]">Secure</p>
                    <p className="text-xs text-[#5A7A94]">Audited contracts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F0F7FF] rounded-xl p-4 border border-[#B8D4ED]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4A90E2] bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A3A52]">Fast</p>
                    <p className="text-xs text-[#5A7A94]">Quick transfers</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F0F7FF] rounded-xl p-4 border border-[#B8D4ED]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4A90E2] bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A3A52]">Low Fees</p>
                    <p className="text-xs text-[#5A7A94]">Best rates</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default Nexus;
