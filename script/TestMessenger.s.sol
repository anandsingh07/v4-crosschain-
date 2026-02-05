// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CrossChainBridge} from "../src/bridge/CrossChainBridge.sol";

contract TestMessenger is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address hubBridge = vm.envAddress("BRIDGE_HUB");
        uint32 eidSpoke = uint32(vm.envUint("EID_BASE_SEPOLIA"));

        vm.startBroadcast(deployerPrivateKey);

        // Standard execution options: Type 1 (LZ_RECEIVE), Gas Limit: 200,000
        bytes memory options = abi.encodePacked(uint16(1), uint256(200000));
        
        string memory testMsg = "Cross-Chain Liquidity Signal: INVEST_USDC_BASE";

        // Pay 0.01 ETH for LZ fees (refunds go to sender)
        CrossChainBridge(hubBridge).send{value: 0.01 ether}(
            eidSpoke,
            testMsg,
            options
        );

        console.log("Message sent to EID:", eidSpoke);
        console.log("Payload:", testMsg);

        vm.stopBroadcast();
    }
}
