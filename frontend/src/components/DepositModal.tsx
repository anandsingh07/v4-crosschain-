"use client";

import { useState } from "react";
import { X, Loader2, ArrowRight } from "lucide-react";
import { useVaultDeposit } from "@/hooks/useLiquidityVault";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";

import { getContractAddress } from "@/config/contracts";

export function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [amount, setAmount] = useState("");
    const { address, chainId } = useAccount();
    const vaultAddress = getContractAddress(chainId, "liquidityVault");
    const { deposit, isPending, isConfirming, isConfirmed, error, hash } = useVaultDeposit();

    const handleDeposit = async () => {
        if (!amount || !address) return;
        try {
            const amountBigInt = parseUnits(amount, 6); // Assuming USDC (6 decimals)
            await deposit(vaultAddress, amountBigInt, address);
        } catch (e) {
            console.error("Deposit failed", e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0f141f] border border-white/10 rounded-xl shadow-2xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-1">Deposit Liquidity</h2>
                    <p className="text-sm text-gray-400 mb-6">Add USDC to the vault to earn yield.</p>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount (USDC)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button
                                    onClick={() => setAmount("1000")} // Mock max
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-400 hover:text-blue-300"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
                            <div className="flex justify-between mb-1">
                                <span>Est. APY</span>
                                <span className="font-bold">8.42%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Lock-up Period</span>
                                <span className="font-bold">None</span>
                            </div>
                        </div>

                        {hash && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300 break-all">
                                <p className="font-bold mb-1">Transaction Sent!</p>
                                <p className="text-xs opacity-80">Hash: {hash}</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                                <p className="font-bold mb-1">Error</p>
                                <p className="text-xs opacity-80">{(error as any).shortMessage || error.message}</p>
                            </div>
                        )}

                        <button
                            onClick={handleDeposit}
                            disabled={!amount || isPending || isConfirming}
                            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Confirm Deposit <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
