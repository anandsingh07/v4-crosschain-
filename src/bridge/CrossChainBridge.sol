// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IAdapter {
    function openPosition(address, address, uint24, int24, int24, uint256, uint256) external;
    function closePosition(uint256, uint128, uint256, uint256) external;
}

contract CrossChainBridge is OApp, AccessControl {
    
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    enum MessageType { INVEST, WITHDRAW, DATA }

    address public adapter;
    string public latestData;

    event MessageSent(uint32 dstEid, MessageType msgType);
    event MessageReceived(uint32 srcEid, MessageType msgType);

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(_owner) {
        _grantRole(DEFAULT_ADMIN_ROLE, _owner);
        _grantRole(MANAGER_ROLE, _owner);
    }

    function setAdapter(address _adapter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        adapter = _adapter;
    }

    function send(
        uint32 _dstEid,
        MessageType _msgType,
        bytes calldata _payload,
        bytes calldata _options
    ) external payable onlyRole(MANAGER_ROLE) returns (MessagingReceipt memory receipt) {
        bytes memory lzPayload = abi.encode(_msgType, _payload);
        
        receipt = _lzSend(
            _dstEid,
            lzPayload,
            _options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );

        emit MessageSent(_dstEid, _msgType);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        (MessageType msgType, bytes memory payload) = abi.decode(_message, (MessageType, bytes));
        
        if (msgType == MessageType.INVEST) {
            (address t0, address t1, uint24 fee, int24 tl, int24 tu, uint256 a0, uint256 a1) = abi.decode(payload, (address, address, uint24, int24, int24, uint256, uint256));
            if (adapter != address(0)) {
                IAdapter(adapter).openPosition(t0, t1, fee, tl, tu, a0, a1);
            }
        } else if (msgType == MessageType.WITHDRAW) {
            (uint256 tokenId, uint128 points, uint256 a0Min, uint256 a1Min) = abi.decode(payload, (uint256, uint128, uint256, uint256));
            if (adapter != address(0)) {
                IAdapter(adapter).closePosition(tokenId, points, a0Min, a1Min);
            }
        } else {
            latestData = abi.decode(payload, (string));
        }
        
        emit MessageReceived(_origin.srcEid, msgType);
    }
}
