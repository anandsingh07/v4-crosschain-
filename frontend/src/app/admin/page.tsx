"use client";

import { useState } from "react";
import { Plus, Pause, Play, ShieldAlert } from "lucide-react";

export default function AdminPage() {
    const [chainId, setChainId] = useState("");
    const [address, setAddress] = useState("");
    const [weight, setWeight] = useState("");

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Controls</h1>
                <p className="text-muted-foreground mt-1">Manage system parameters and strategies. Restricted access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Strategy Management */}
                <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-400" /> Add New Strategy
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Chain ID</label>
                            <input
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="e.g. 10 (Optimism)"
                                value={chainId}
                                onChange={(e) => setChainId(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Pool Address</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="0x..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Initial Weight (bps)</label>
                            <input
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="e.g. 5000 (50%)"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </div>

                        <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 transition-all mt-4">
                            Add Destination
                        </button>
                    </div>
                </div>

                {/* Emergency Controls */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl glass-panel border border-red-500/20 bg-red-500/5">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                            <ShieldAlert className="w-5 h-5 text-red-400" /> Emergency Controls
                        </h3>
                        <p className="text-sm text-red-200 mb-6">
                            Pausing the vault will disable all deposits and withdraws. This action should only be taken in case of a security incident.
                        </p>
                        <div className="flex gap-4">
                            <button className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-medium shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                                <Pause className="w-4 h-4" /> Pause Vault
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" /> Unpause
                            </button>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl glass-panel border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-4">System Parameters</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-sm text-muted-foreground">Max Deposit Limit</span>
                                <span className="text-sm font-medium text-white">$5,000,000</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-sm text-muted-foreground">Performance Fee</span>
                                <span className="text-sm font-medium text-white">10%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-sm text-muted-foreground">Management Fee</span>
                                <span className="text-sm font-medium text-white">1%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
