"use client";

import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { useState } from "react";
import { ChevronDown, Wallet as WalletIcon, Copy, LogOut } from "lucide-react";

export function WalletConnect() {
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const [isOpen, setIsOpen] = useState(false);

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    if (isConnected && address) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium text-gray-200"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{ensName || formatAddress(address)}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#0f141f] border border-white/10 shadow-2xl overflow-hidden z-50">
                        <div className="p-3 border-b border-white/5">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Connected Network</span>
                                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Active</span>
                            </div>
                            <p className="text-sm font-medium text-white">{chain?.name || "Unknown Chain"}</p>
                        </div>

                        <button
                            onClick={() => { navigator.clipboard.writeText(address); setIsOpen(false) }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Copy className="w-3 h-3" /> Copy Address
                        </button>

                        <button
                            onClick={() => disconnect()}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/5"
                        >
                            <LogOut className="w-3 h-3" /> Disconnect
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 transition-all"
            >
                <WalletIcon className="w-3.5 h-3.5" />
                <span>Connect</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#0f141f] border border-white/10 shadow-2xl overflow-hidden z-50 p-2">
                    <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Select Wallet
                    </div>
                    {connectors.map((connector) => (
                        <button
                            key={connector.uid}
                            onClick={() => {
                                connect({ connector });
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{connector.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
