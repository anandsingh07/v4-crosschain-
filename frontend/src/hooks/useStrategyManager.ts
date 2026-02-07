import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import StrategyManagerABI from '@/abis/StrategyManager.json'

export function useDestinations(managerAddress: `0x${string}`) {
    return useReadContract({
        address: managerAddress,
        abi: StrategyManagerABI,
        functionName: 'getDestinations',
    })
}

export function useAddDestination() {
    const { writeContract, data: hash, isPending, error } = useWriteContract()

    const addDestination = (managerAddress: `0x${string}`, chainId: number, pool: `0x${string}`, weight: bigint) => {
        writeContract({
            address: managerAddress,
            abi: StrategyManagerABI,
            functionName: 'addDestination',
            args: [chainId, pool, weight]
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash })

    return { addDestination, hash, isConfirming, isConfirmed, error }
}
