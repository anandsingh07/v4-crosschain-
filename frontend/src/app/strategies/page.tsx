"use client";

import { useDestinations } from "@/hooks/useStrategyManager";
import { TrendingUp, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { getContractAddress } from "@/config/contracts";
import { useAccount } from "wagmi";

export default function StrategiesPage() {
    const { chainId } = useAccount();
    const managerAddress = getContractAddress(chainId, "strategyManager");
    const { data: destinations } = useDestinations(managerAddress);

    // Fallback if no destinations (e.g. initial deploy)
    const displayStrategies = (destinations && Array.isArray(destinations) && destinations.length > 0)
        ? destinations.map((d: any, i: number) => ({
            id: i,
            protocol: "Chain ID " + d.chainId, // Mapping needed for name
            chain: "Unknown",
            asset: "USDC", // Vault asset
            weight: d.weight.toString(),
            apy: "0.0", // Need external data
            tvl: "0",
            risk: "Low"
        }))
        : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-white">Yield Strategies</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Active implementations generating yield for the vault.</p>
                </div>
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-xs font-medium border border-white/5 transition-colors">
                    Analyze
                </button>
            </div>

            <div className="rounded-lg border border-white/5 bg-[#0a0a0a] overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Protocol / Chain</div>
                    <div className="col-span-2 text-right">APY</div>
                    <div className="col-span-2 text-right">TVL</div>
                    <div className="col-span-2 text-right">Weight</div>
                    <div className="col-span-2 text-right">Risk</div>
                </div>

                {displayStrategies.length > 0 ? displayStrategies.map((strategy) => (
                    <div key={strategy.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <div className="col-span-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{strategy.protocol}</p>
                                <p className="text-[11px] text-gray-500">{strategy.chain} • {strategy.asset}</p>
                            </div>
                        </div>

                        <div className="col-span-2 text-right">
                            <p className="text-sm font-semibold text-emerald-400">{strategy.apy}%</p>
                        </div>

                        <div className="col-span-2 text-right">
                            <p className="text-sm font-medium text-gray-300">${strategy.tvl}</p>
                        </div>

                        <div className="col-span-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${Number(strategy.weight) / 100}%` }} />
                                </div>
                                <span className="text-xs text-gray-400 w-8">{Number(strategy.weight) / 100}%</span>
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-end">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${strategy.risk === 'Low'
                                    ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
                                    : 'text-orange-400 bg-orange-500/5 border-orange-500/20'
                                }`}>
                                {strategy.risk}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No active strategies found on-chain. <br />
                        <span className="text-xs">Add a destination via Admin panel to see data here.</span>
                    </div>
                )}
            </div>

            <div className="flex items-start gap-3 p-3 rounded bg-blue-500/5 border border-blue-500/10">
                <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-xs font-semibold text-blue-400">Automated Rebalancing</h4>
                    <p className="text-[11px] text-blue-300/70 mt-0.5">
                        Strategies are re-weighted every 24h to optimize for highest risk-adjusted yield.
                    </p>
                </div>
            </div>
        </div>
    );
}
