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

        StrategyManager strategyManager = new StrategyManager(owner);
        console.log("StrategyManager deployed at:", address(strategyManager));

        LiquidityVault vault = new LiquidityVault(
            IERC20(usdc), 
            "CrossChain LP Vault", 
            "xLP", 
            owner
        );
        console.log("LiquidityVault deployed at:", address(vault));

        CrossChainBridge bridge = new CrossChainBridge(lzEndpoint, owner);
        console.log("Hub Bridge deployed at:", address(bridge));

        vault.setStrategyManager(address(strategyManager));
        vault.setBridge(address(bridge));
        strategyManager.setVault(address(vault));
        
        vm.stopBroadcast();
    }
}
