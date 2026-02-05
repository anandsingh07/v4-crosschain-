// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {UniswapV3Adapter} from "../src/adapters/UniswapV3Adapter.sol";
import {CrossChainBridge} from "../src/bridge/CrossChainBridge.sol";

contract DeploySpoke is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address positionManager = vm.envAddress("NONFUNGIBLE_POSITION_MANAGER_BASE");
        address lzEndpoint = vm.envAddress("LZ_ENDPOINT_BASE");
        address owner = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Uniswap Adapter
        UniswapV3Adapter adapter = new UniswapV3Adapter(positionManager, owner);
        console.log("UniswapV3Adapter deployed at:", address(adapter));

        // 2. Deploy Bridge
        CrossChainBridge bridge = new CrossChainBridge(lzEndpoint, owner);
        console.log("Spoke Bridge deployed at:", address(bridge));

        // 3. Wire Component
        adapter.setVault(address(bridge)); // Adapter treats Bridge as the 'Vault' on this chain
        
        vm.stopBroadcast();
    }
}
