"use client";

import { Bell, Search, Menu, Command } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
    return (
        <header className="h-14 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md flex items-center justify-between px-6 z-30 sticky top-0">
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 text-muted-foreground hover:text-white">
                    <Menu className="w-4 h-4" />
                </button>
                {/* Breadcrumb or Page Title placeholder could go here */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                    <span className="hover:text-white cursor-pointer transition-colors">App</span>
                    <span className="text-gray-700">/</span>
                    <span className="text-white font-medium">Dashboard</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Search Bar - Compact */}
                <div className="relative group hidden md:block">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-gray-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-[#0f141f] border border-white/5 rounded-md pl-8 pr-8 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 w-48 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <Command className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600">K</span>
                    </div>
                </div>

                <button className="p-2 relative text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-[#030712]"></span>
                </button>

                <div className="h-4 w-px bg-white/10 mx-1"></div>

                <WalletConnect />
            </div>
        </header>
    );
}
