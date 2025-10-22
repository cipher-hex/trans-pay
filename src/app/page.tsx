"use client";
import { useState } from "react";
import Nexus from "@/components/nexus";
import Header from "@/components/layout/header";

export default function Home() {
  const isTestnet = process.env.NEXT_PUBLIC_ENABLE_TESTNET === "true";
  const [activeTab, setActiveTab] = useState("unified-balance");
  
  return (
    <>
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isTestnet={isTestnet}
      />
      <main className="w-full min-h-screen bg-[#E6F3FF]">
        <div className="w-full pt-8 pb-12 flex flex-col gap-y-6 items-center justify-start">
          <Nexus isTestnet={isTestnet} activeTab={activeTab} />
        </div>
      </main>
    </>
  );
}
