import { Address } from "viem";

// TODO: Replace with deployed addresses after running `forge script`
export const CONTRACTS = {
    // Sepolia (Example)
    11155111: {
        liquidityVault: "0x0000000000000000000000000000000000000000" as Address,
        strategyManager: "0x0000000000000000000000000000000000000000" as Address,
        crossChainBridge: "0x0000000000000000000000000000000000000000" as Address,
    },
    // Anvil (Local)
    31337: {
        liquidityVault: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address, // Default Anvil 1st deployment
        strategyManager: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" as Address,
        crossChainBridge: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as Address,
    }
} as const;

export function getContractAddress(chainId: number | undefined, name: keyof typeof CONTRACTS[31337]) {
    if (!chainId || !CONTRACTS[chainId as keyof typeof CONTRACTS]) {
        return CONTRACTS[31337][name]; // Default to Anvil for local dev
    }
    return CONTRACTS[chainId as keyof typeof CONTRACTS][name] || CONTRACTS[31337][name];
}
