// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StrategyManager is Ownable {

    struct Destination {
        uint32 chainId;
        address targetPool;
        uint256 weight;
    }

    Destination[] public destinations;
    address public vault;

    event DestinationAdded(uint32 chainId, address pool, uint256 weight);
    event VaultUpdated(address newVault);

    constructor(address _owner) Ownable(_owner) {}

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

    function getDestinations() external view returns (Destination[] memory) {
        return destinations;
    }
}
