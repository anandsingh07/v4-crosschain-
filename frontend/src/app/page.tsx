"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownLeft, Layers, Wallet, Activity, TrendingUp } from "lucide-react";
import { DepositModal } from "@/components/DepositModal";
import { useVaultTotalAssets, useVaultBalance } from "@/hooks/useLiquidityVault";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { getContractAddress } from "@/config/contracts";

export default function Home() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const { address, chainId } = useAccount();
  const vaultAddress = getContractAddress(chainId, "liquidityVault");

  const { data: totalAssets } = useVaultTotalAssets(vaultAddress || "0x0000000000000000000000000000000000000000");
  const { data: userBalance } = useVaultBalance(vaultAddress || "0x0000000000000000000000000000000000000000", address!);

  const formattedTVL = useMemo(() => {
    // Need to cast to bigint because wagmi's useReadContract raw output might be inferred loosely
    return totalAssets ? `$${Number(formatUnits(totalAssets as bigint, 6)).toLocaleString()}` : "$0.00";
  }, [totalAssets]);

  const formattedBalance = useMemo(() => {
    return userBalance ? `$${Number(formatUnits(userBalance as bigint, 6)).toLocaleString()}` : "$0.00";
  }, [userBalance]);

  return (
    <div className="space-y-6">
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-1">Real-time overview of your cross-chain liquidity positions.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-all shadow-sm shadow-blue-500/10"
          >
            New Deposit
          </button>
          <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-md text-sm font-medium transition-all border border-white/5">
            Manage
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Value Locked", value: formattedTVL, change: "+0.0%", icon: Layers, trend: "up" },
          { label: "Your Liquidity", value: formattedBalance, change: "+0.0%", icon: Wallet, trend: "up" },
          { label: "Net APY", value: "8.42%", change: "+0.0%", icon: Activity, trend: "up" }, // APY requires more complex calculation/indexing
          { label: "Protocol Revenue", value: "$0.00", change: "+0.0%", icon: TrendingUp, trend: "down" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-lg bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-1.5 rounded-md bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                <stat.icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${stat.trend === 'up'
                ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                : 'text-red-400 border-red-500/20 bg-red-500/5'
                } flex items-center gap-1`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownLeft className="w-2.5 h-2.5" />}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-lg font-bold text-white mt-0.5 tabular-nums tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart/Liquidity Section (2/3 width) */}
        <div className="lg:col-span-2 rounded-lg bg-[#0a0a0a] border border-white/5 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Liquidity Performance
            </h3>
            <div className="flex bg-white/5 rounded p-0.5">
              {['1H', '1D', '1W', '1M', '1Y'].map(period => (
                <button key={period} className="px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-white rounded hover:bg-white/10 transition-colors">
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
            {/* Grid Lines Background */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="border-r border-b border-white/[0.02]" />
              ))}
            </div>

            <div className="text-center relative z-10">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Chart Visualization</p>
              <p className="text-xs text-gray-600 mt-1">Data will populate once subgraph is synced</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (1/3 width) */}
        <div className="rounded-lg bg-[#0a0a0a] border border-white/5 flex flex-col h-full">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
            <button className="text-[10px] text-blue-400 hover:text-blue-300">View Explorer</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px]">
            {[
              { type: 'Deposit', amount: '+5,000 USDC', time: '2 mins ago', status: 'Confirmed' },
              { type: 'Bridge', amount: '1,200 USDC', time: '15 mins ago', status: 'Pending' },
              { type: 'Withdraw', amount: '-500 USDC', time: '4 hours ago', status: 'Confirmed' },
              { type: 'Deposit', amount: '+10,000 USDC', time: '1 day ago', status: 'Confirmed' },
              { type: 'Admin', amount: 'New Strategy', time: '2 days ago', status: 'Executed' },
            ].map((tx, i) => (
              <div key={i} className="px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded bg-white/5 flex items-center justify-center text-xs font-bold ${tx.type === 'Withdraw' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {tx.type[0]}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-gray-200 group-hover:text-white transition-colors">{tx.type} USDC</p>
                    <p className="text-[10px] text-gray-500">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[12px] font-medium ${tx.type === 'Withdraw' ? 'text-white' : 'text-emerald-400'}`}>{tx.amount}</p>
                  <p className={`text-[9px] uppercase tracking-wide ${tx.status === 'Pending' ? 'text-orange-400' : 'text-gray-600'}`}>{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
