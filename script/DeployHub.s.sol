// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {LiquidityVault} from "../src/core/LiquidityVault.sol";
import {StrategyManager} from "../src/core/StrategyManager.sol";
import {CrossChainBridge} from "../src/bridge/CrossChainBridge.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract DeployHub is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdc = vm.envAddress("USDC_SEPOLIA");
        address lzEndpoint = vm.envAddress("LZ_ENDPOINT_SEPOLIA");
        address owner = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Strategy Manager
        StrategyManager strategyManager = new StrategyManager(owner);
        console.log("StrategyManager deployed at:", address(strategyManager));

        // 2. Deploy Vault
        LiquidityVault vault = new LiquidityVault(
            IERC20(usdc), 
            "CrossChain LP Vault", 
            "xLP", 
            owner
        );
        console.log("LiquidityVault deployed at:", address(vault));

        // 3. Deploy Bridge
        CrossChainBridge bridge = new CrossChainBridge(lzEndpoint, owner);
        console.log("Hub Bridge deployed at:", address(bridge));

        // 4. Wire expectations
        vault.setStrategyManager(address(strategyManager));
        strategyManager.setVault(address(vault));
        // bridge.setVault(address(vault)); // If bridge needs to know about vault
        
        vm.stopBroadcast();
    }
}
