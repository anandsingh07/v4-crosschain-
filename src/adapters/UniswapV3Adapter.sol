// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {INonfungiblePositionManager} from "v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";

/**
 * @title UniswapV3Adapter
 * @notice Adapts the LiquidityVault to Uniswap V3.
 * @dev Interacts with the NonfungiblePositionManager to mint/add/decrease liquidity.
 */
contract UniswapV3Adapter is Ownable {
    
    // ==========================================
    // State Variables
    // ==========================================

    INonfungiblePositionManager public immutable positionManager;
    address public vault;

    struct Position {
        uint256 tokenId;
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;
    }

    /// @notice Maps pool ID to Position details
    mapping(uint256 => Position) public positions;

    // ==========================================
    // Events
    // ==========================================

    event LiquidityAdded(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);
    event LiquidityRemoved(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);

    // ==========================================
    // Constructor
    // ==========================================

    constructor(address _positionManager, address _owner) Ownable(_owner) {
        positionManager = INonfungiblePositionManager(_positionManager);
    }

    // ==========================================
    // Admin
    // ==========================================

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    // ==========================================
    // Liquidity Functions
    // ==========================================

    /**
     * @notice Mints a new position on Uniswap V3.
     * @dev Transfers tokens from Vault to here, then approves PositionManager.
     */
    function openPosition(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired
    ) external onlyOwner returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) {
        
        // Transfer funds from Vault (assuming Vault has approved Adapter)
        if (amount0Desired > 0) IERC20(token0).transferFrom(vault, address(this), amount0Desired);
        if (amount1Desired > 0) IERC20(token1).transferFrom(vault, address(this), amount1Desired);

        // Approve PositionManager
        IERC20(token0).approve(address(positionManager), amount0Desired);
        IERC20(token1).approve(address(positionManager), amount1Desired);

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0Desired,
                amount1Desired: amount1Desired,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this), // Adapter holds the NFT
                deadline: block.timestamp
            });

        (tokenId, liquidity, amount0, amount1) = positionManager.mint(params);

        // Store position details
        positions[tokenId] = Position({
            tokenId: tokenId,
            token0: token0,
            token1: token1,
            fee: fee,
            tickLower: tickLower,
            tickUpper: tickUpper,
            liquidity: liquidity
        });

        // Refund dust
        if (amount0 < amount0Desired) IERC20(token0).transfer(vault, amount0Desired - amount0);
        if (amount1 < amount1Desired) IERC20(token1).transfer(vault, amount1Desired - amount1);

        emit LiquidityAdded(tokenId, liquidity, amount0, amount1);
    }
}
