// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {LiquidityVault} from "../src/core/LiquidityVault.sol";
import {StrategyManager} from "../src/core/StrategyManager.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 Token
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1_000_000 * 10**18);
    }
}

contract LiquidityVaultTest is Test {
    LiquidityVault public vault;
    StrategyManager public strategyManager;
    MockUSDC public usdc;

    address public owner = address(1);
    address public user = address(2);

    function setUp() public {
        vm.startPrank(owner);
        usdc = new MockUSDC();
        vault = new LiquidityVault(usdc, "Vault LP", "vLP", owner);
        strategyManager = new StrategyManager(owner);
        
        vault.setStrategyManager(address(strategyManager));
        strategyManager.setVault(address(vault));
        
        // Fund user
        usdc.transfer(user, 1000 * 10**18);
        vm.stopPrank();
    }

    function testDeposit() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10**18);
        uint256 shares = vault.deposit(100 * 10**18, user);
        
        assertEq(shares, 100 * 10**18); // 1:1 initially
        assertEq(vault.totalAssets(), 100 * 10**18);
        assertEq(usdc.balanceOf(address(vault)), 100 * 10**18);
        vm.stopPrank();
    }
    
    function testWithdraw() public {
        vm.startPrank(user);
        usdc.approve(address(vault), 100 * 10**18);
        vault.deposit(100 * 10**18, user);
        
        vault.withdraw(50 * 10**18, user, user);
        
        assertEq(vault.totalAssets(), 50 * 10**18);
        assertEq(usdc.balanceOf(user), 950 * 10**18);
        vm.stopPrank();
    }
}
