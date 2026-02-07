import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import LiquidityVaultABI from '@/abis/LiquidityVault.json'

export function useVaultDeposit() {
    const { writeContract, data: hash, isPending, error } = useWriteContract()

    const deposit = async (vaultAddress: `0x${string}`, amount: bigint, receiver: `0x${string}`) => {
        writeContract({
            address: vaultAddress,
            abi: LiquidityVaultABI,
            functionName: 'deposit',
            args: [amount, receiver],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash })

    return { deposit, hash, isPending, isConfirming, isConfirmed, error }
}

export function useVaultBalance(vaultAddress: `0x${string}`, userAddress: `0x${string}`) {
    return useReadContract({
        address: vaultAddress,
        abi: LiquidityVaultABI,
        functionName: 'balanceOf',
        args: [userAddress],
    })
}

export function useVaultTotalAssets(vaultAddress: `0x${string}`) {
    return useReadContract({
        address: vaultAddress,
        abi: LiquidityVaultABI,
        functionName: 'totalAssets',
    })
}

export function useVaultWithdraw() {
    const { writeContract, data: hash, isPending, error } = useWriteContract()

    const withdraw = async (vaultAddress: `0x${string}`, assets: bigint, receiver: `0x${string}`, owner: `0x${string}`) => {
        writeContract({
            address: vaultAddress,
            abi: LiquidityVaultABI,
            functionName: 'withdraw',
            args: [assets, receiver, owner],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash })

    return { withdraw, hash, isPending, isConfirming, isConfirmed, error }
}
