// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title StrategyManager
 * @notice Decides where to deploy liquidity across chains.
 */
contract StrategyManager is Ownable {

    // ==========================================
    // Structs
    // ==========================================

    struct Destination {
        uint32 chainId;      // LayerZero endpoint ID or similar
        address targetPool;  // Uniswap Pool address on remote chain
        uint256 weight;      // Allocation weight (basis points)
    }

    // ==========================================
    // State Variables
    // ==========================================

    /// @notice List of active destinations
    Destination[] public destinations;

    /// @notice The Vault address that holds funds
    address public vault;

    // ==========================================
    // Events
    // ==========================================

    event DestinationAdded(uint32 chainId, address pool, uint256 weight);
    event VaultUpdated(address newVault);

    // ==========================================
    // Constructor
    // ==========================================

    constructor(address _owner) Ownable(_owner) {}

    // ==========================================
    // Admin Functions
    // ==========================================

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
        emit VaultUpdated(_vault);
    }

    function addDestination(uint32 _chainId, address _pool, uint256 _weight) external onlyOwner {
        destinations.push(Destination({
            chainId: _chainId,
            targetPool: _pool,
            weight: _weight
        }));
        emit DestinationAdded(_chainId, _pool, _weight);
    }

    // ==========================================
    // View Functions
    // ==========================================

    function getDestinations() external view returns (Destination[] memory) {
        return destinations;
    }
}
