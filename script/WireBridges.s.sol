// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CrossChainBridge} from "../src/bridge/CrossChainBridge.sol";

contract WireBridges is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        address bridgeHub = vm.envAddress("BRIDGE_HUB");
        address bridgeSpoke = vm.envAddress("BRIDGE_SPOKE");
        uint32 eidHub = uint32(vm.envUint("EID_SEPOLIA"));
        uint32 eidSpoke = uint32(vm.envUint("EID_BASE_SEPOLIA"));

        vm.startBroadcast(deployerPrivateKey);

        if (block.chainid == 11155111) {
            CrossChainBridge(bridgeHub).setPeer(eidSpoke, bytes32(uint256(uint160(bridgeSpoke))));
            console.log("Hub mapped to Spoke peer");
        }

        if (block.chainid == 84532) {
            CrossChainBridge(bridgeSpoke).setPeer(eidHub, bytes32(uint256(uint160(bridgeHub))));
            console.log("Spoke mapped to Hub peer");
        }

        vm.stopBroadcast();
    }
}
