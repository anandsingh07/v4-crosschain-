import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import CrossChainBridgeABI from '@/abis/CrossChainBridge.json'
import { parseEther } from 'viem'

// Enum matching defining contract
export enum MessageType {
    INVEST = 0,
    WITHDRAW = 1,
    DATA = 2
}

export function useBridgeSend() {
    const { writeContract, data: hash, isPending, error } = useWriteContract()

    const send = (
        bridgeAddress: `0x${string}`,
        dstEid: number,
        msgType: MessageType,
        payload: `0x${string}`,
        options: `0x${string}`,
        fee: bigint
    ) => {
        writeContract({
            address: bridgeAddress,
            abi: CrossChainBridgeABI,
            functionName: 'send',
            args: [dstEid, msgType, payload, options],
            value: fee
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash })

    return { send, hash, isPending, isConfirming, isConfirmed, error }
}
