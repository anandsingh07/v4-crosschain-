"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, ArrowLeftRight, Activity, Settings, BookOpen, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
    { name: "Overview", href: "/", icon: LayoutGrid },
    { name: "Bridge & Swap", href: "/bridge", icon: ArrowLeftRight },
    { name: "Yield Strategies", href: "/strategies", icon: Activity },
    { name: "System Admin", href: "/admin", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed as requested ("hide... then show")

    return (
        <aside
            className={clsx(
                "h-screen sticky top-0 bg-[#050a14] border-r border-white/5 flex flex-col z-40 transition-all duration-300 ease-in-out shrink-0",
                isExpanded ? "w-56" : "w-[68px]"
            )}
        >
            {/* Brand / Toggle */}
            <div
                className="h-14 flex items-center px-5 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group"
                onClick={() => setIsExpanded(!isExpanded)}
                title="Click to toggle menu"
            >
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                        <div className="w-3.5 h-3.5 bg-white rounded-sm" />
                    </div>

                    <span className={clsx(
                        "font-bold text-white tracking-tight transition-opacity duration-200 whitespace-nowrap",
                        isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    )}>
                        DeFi<span className="text-blue-500">Hub</span>
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                <div className={clsx(
                    "px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 transition-opacity duration-200",
                    isExpanded ? "opacity-100" : "opacity-0 hidden"
                )}>
                    Menu
                </div>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5 shrink-0", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300")} />

                            <span className={clsx(
                                "font-medium text-sm whitespace-nowrap transition-all duration-200",
                                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 w-0 overflow-hidden absolute left-10"
                            )}>
                                {item.name}
                            </span>

                            {/* Tooltip for collapsed state */}
                            {!isExpanded && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <button className={clsx(
                    "flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors w-full px-2 py-2 rounded hover:bg-white/5",
                    !isExpanded && "justify-center"
                )}>
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span className={clsx(
                        "transition-opacity duration-200 whitespace-nowrap",
                        isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    )}>
                        Docs
                    </span>
                </button>

                <div className={clsx(
                    "mt-4 px-2 flex items-center gap-2 transition-all",
                    !isExpanded && "justify-center"
                )}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className={clsx(
                        "text-[10px] text-emerald-500 font-medium uppercase tracking-wide whitespace-nowrap transition-opacity duration-200",
                        isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    )}>
                        System Active
                    </span>
                </div>
            </div>
        </aside>
    );
}
