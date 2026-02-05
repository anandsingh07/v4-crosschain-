// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC4626} from "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/**
 * @title LiquidityVault
 * @notice A cross-chain liquidity optimizer vault compliant with ERC-4626.
 * @dev Manages user deposits and allocates funds to the StrategyManager.
 */
contract LiquidityVault is ERC4626, Ownable {
    
    // ==========================================
    // State Variables
    // ==========================================
    
    /// @notice The Strategy Manager contract address
    address public strategyManager;
    
    // ==========================================
    // Events
    // ==========================================
    
    event StrategyManagerUpdated(address indexed newManager);
    
    // ==========================================
    // Constructor
    // ==========================================
    
    constructor(
        IERC20 _asset, 
        string memory _name, 
        string memory _symbol,
        address _owner
    ) ERC4626(_asset) ERC20(_name, _symbol) Ownable(_owner) {}

    // ==========================================
    // Admin Functions
    // ==========================================
    
    /**
     * @notice Updates the Strategy Manager address.
     * @param _manager The new strategy manager address.
     */
    function setStrategyManager(address _manager) external onlyOwner {
        require(_manager != address(0), "Invalid address");
        strategyManager = _manager;
        emit StrategyManagerUpdated(_manager);
    }
    
    // ==========================================
    // Overrides
    // ==========================================
    
    /**
     * @notice Triggers a cross-chain investment to the best strategy.
     */
    function invest(uint256 amount) external onlyOwner {
        // 1. Get best destination from StrategyManager
        // (uint32 chainId, address pool) = IStrategyManager(strategyManager).getBestStrategy();
        
        // 2. Bridge funds via CrossChainBridge (pseudo-code integration)
        // IERC20(asset()).approve(address(bridge), amount);
        // bridge.send(chainId, ...);
    }

    /**
     * @dev See {IERC4626-totalAssets}.
     * @notice Returns total assets including those bridged to other chains.
     */
    function totalAssets() public view override returns (uint256) {
        // In a real app, we'd query the adapter or use a stored Oracle value for remote assets
        return super.totalAssets();
    }
}
