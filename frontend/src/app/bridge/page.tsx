"use client";

import { useState } from "react";
import { ArrowDown, Settings, Info, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { useVaultWithdraw, useVaultBalance } from "@/hooks/useLiquidityVault";
import { useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { getContractAddress } from "@/config/contracts";

export default function BridgePage() {
    const [amount, setAmount] = useState("");
    const { address, chainId } = useAccount();
    const vaultAddress = getContractAddress(chainId, "liquidityVault");

    const { data: userBalance } = useVaultBalance(vaultAddress, address!);
    const { withdraw, isPending, isConfirming, isConfirmed, hash, error } = useVaultWithdraw();

    const handleWithdraw = async () => {
        if (!amount || !address) return;
        try {
            const amountBigInt = parseUnits(amount, 6);
            await withdraw(vaultAddress, amountBigInt, address, address);
        } catch (e) {
            console.error(e);
        }
    };

    const maxBalance = userBalance ? formatUnits(userBalance as bigint, 6) : "0";

    return (
        <div className="max-w-md mx-auto mt-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-white">Manage Liquidity</h1>
            </div>

            <div className="bg-[#0f141f] rounded-xl border border-white/5 shadow-xl overflow-hidden">

                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Withdraw from Vault</span>
                </div>

                <div className="p-4 space-y-4">
                    {/* Withdraw Input */}
                    <div className="p-3 rounded-lg bg-[#050a14] border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Amount (USDC)</span>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5">
                                <span className="text-xs font-medium text-gray-200">Vault Shares</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent text-xl font-bold text-white placeholder:text-gray-700 focus:outline-none w-2/3"
                            />
                            <div className="text-right">
                                <div className="text-xs font-medium text-gray-500 cursor-pointer hover:text-blue-400" onClick={() => setAmount(maxBalance)}>
                                    Balance: {Number(maxBalance).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                            Error: {(error as any).shortMessage || error.message}
                        </div>
                    )}

                    <button
                        onClick={handleWithdraw}
                        disabled={!amount || isPending || isConfirming}
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isPending || isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Withdraw Liquidity"}
                    </button>
                </div>

                <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5">
                    <div className="flex items-start gap-2 text-[10px] text-gray-500">
                        <AlertTriangle className="w-3 h-3 mt-0.5 text-orange-400" />
                        <span>Withdrawals are processed from the local vault. If funds are deployed to other chains, you may need to wait for a Rebalance.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
