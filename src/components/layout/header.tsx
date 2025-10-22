"use client";
import React from "react";
import ConnectWallet from "../blocks/connect-wallet";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isTestnet: boolean;
}

const Header = ({ activeTab, onTabChange, isTestnet }: HeaderProps) => {
  const tabs = [
    { value: "unified-balance", label: "Unified Balance" },
    { value: "bridge", label: "Bridge" },
    { value: "transfer", label: "Transfer" },
    ...(!isTestnet ? [{ value: "bridge-execute", label: "Bridge & Execute" }] : [])
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-lg">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/avail-logo.svg" alt="Nexus" width={136} height={126} />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-[#1A3A52]">Nexus Upgrade</span>
              <span className="text-xs text-[#5A7A94]">
                Seamless cross-chain interactions
              </span>
            </div>
          </Link>
          <ConnectWallet />
        </div>
        
        <nav className="flex items-center gap-2 border-t border-[#E1ECF7] pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${activeTab === tab.value
                  ? 'bg-[#4A90E2] text-white shadow-md'
                  : 'bg-[#F0F7FF] text-[#4A90E2] hover:bg-[#E6F3FF] hover:shadow-sm'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
          {isTestnet && (
            <span className="ml-auto text-xs text-[#E74C3C] bg-[#FFE6E6] px-3 py-1 rounded-full">
              Devnet Mode
            </span>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
