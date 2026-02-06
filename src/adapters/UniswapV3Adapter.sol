// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {INonfungiblePositionManager} from "v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";

contract UniswapV3Adapter is Ownable {
    
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

    mapping(uint256 => Position) public positions;

    event LiquidityAdded(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);
    event LiquidityRemoved(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);

    constructor(address _positionManager, address _owner) Ownable(_owner) {
        positionManager = INonfungiblePositionManager(_positionManager);
    }

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    function openPosition(
        address token0,
        address token1,
        uint24 fee,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired
    ) external onlyOwner returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) {
        
        if (amount0Desired > 0) IERC20(token0).transferFrom(vault, address(this), amount0Desired);
        if (amount1Desired > 0) IERC20(token1).transferFrom(vault, address(this), amount1Desired);

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
                recipient: address(this), 
                deadline: block.timestamp
            });

        (tokenId, liquidity, amount0, amount1) = positionManager.mint(params);

        positions[tokenId] = Position({
            tokenId: tokenId,
            token0: token0,
            token1: token1,
            fee: fee,
            tickLower: tickLower,
            tickUpper: tickUpper,
            liquidity: liquidity
        });

        if (amount0 < amount0Desired) IERC20(token0).transfer(vault, amount0Desired - amount0);
        if (amount1 < amount1Desired) IERC20(token1).transfer(vault, amount1Desired - amount1);

        emit LiquidityAdded(tokenId, liquidity, amount0, amount1);
    }

    function closePosition(
        uint256 tokenId,
        uint128 liquidity,
        uint256 amount0Min,
        uint256 amount1Min
    ) external onlyOwner returns (uint256 amount0, uint256 amount1) {
        Position storage pos = positions[tokenId];
        require(pos.liquidity >= liquidity, "Insufficient liquidity");

        INonfungiblePositionManager.DecreaseLiquidityParams memory params =
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liquidity,
                amount0Min: amount0Min,
                amount1Min: amount1Min,
                deadline: block.timestamp
            });

        (amount0, amount1) = positionManager.decreaseLiquidity(params);

        INonfungiblePositionManager.CollectParams memory collectParams =
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: vault,
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        positionManager.collect(collectParams);

        pos.liquidity -= liquidity;
        if (pos.liquidity == 0) {
            delete positions[tokenId];
        }

        emit LiquidityRemoved(tokenId, liquidity, amount0, amount1);
    }
}
