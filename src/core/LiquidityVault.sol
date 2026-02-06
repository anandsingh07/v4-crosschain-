// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IBridge {
    function send(uint32, uint8, bytes calldata, bytes calldata) external payable;
}

contract LiquidityVault is ERC4626, AccessControl, Pausable, ReentrancyGuard {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");

    address public strategyManager;
    address public bridge;

    event StrategyManagerUpdated(address strategyManager);
    event BridgeUpdated(address bridge);
    event Invested(uint32 dstEid, uint256 amount);
    event WithdrawalTriggered(uint32 dstEid, uint256 amount);
    
    constructor(
        IERC20 _asset, 
        string memory _name, 
        string memory _symbol,
        address _admin
    ) ERC4626(_asset) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(STRATEGIST_ROLE, _admin);
    }

    function setStrategyManager(address _strategyManager) external onlyRole(ADMIN_ROLE) {
        strategyManager = _strategyManager;
        emit StrategyManagerUpdated(_strategyManager);
    }

    function setBridge(address _bridge) external onlyRole(ADMIN_ROLE) {
        bridge = _bridge;
        emit BridgeUpdated(_bridge);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function invest(
        uint32 dstEid, 
        uint256 amount, 
        bytes calldata payload, 
        bytes calldata options
    ) external payable onlyRole(STRATEGIST_ROLE) whenNotPaused nonReentrant {
        IERC20(asset()).transfer(bridge, amount);
        IBridge(bridge).send{value: msg.value}(dstEid, 0, payload, options);
        emit Invested(dstEid, amount);
    }

    function triggerRemoteWithdraw(
        uint32 dstEid, 
        bytes calldata payload, 
        bytes calldata options
    ) external payable onlyRole(STRATEGIST_ROLE) whenNotPaused nonReentrant {
        IBridge(bridge).send{value: msg.value}(dstEid, 1, payload, options);
        emit WithdrawalTriggered(dstEid, 0); 
    }

    function totalAssets() public view override returns (uint256) {
        return super.totalAssets(); 
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
