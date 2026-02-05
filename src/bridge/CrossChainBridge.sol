// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract CrossChainBridge is OApp {
    
    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(_owner) {}

    string public data;

    event MessageSent(uint32 dstEid, string message);
    event MessageReceived(uint32 srcEid, bytes32 sender, string message);

    /**
     * @notice Sends a message to a destination chain.
     * @param _dstEid The destination endpoint ID.
     * @param _message The message string to send.
     * @param _options Additional execution options (gas settings).
     */
    function send(
        uint32 _dstEid,
        string memory _message,
        bytes memory _options
    ) external payable returns (MessagingReceipt memory receipt) {
        bytes memory _payload = abi.encode(_message);
        
        receipt = _lzSend(
            _dstEid,
            _payload,
            _options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );

        emit MessageSent(_dstEid, _message);
    }

    /**
     * @notice Internal function to handle incoming messages.
     * @dev Overrides OApp._lzReceive.
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        data = abi.decode(_message, (string));
        
        // Pseudo-code for handling diverse message types:
        // (uint8 msgType, bytes memory payload) = abi.decode(_message, (uint8, bytes));
        // if (msgType == 1) { // 1 = Add Liquidity
        //    (address t0, address t1, uint24 fee, int24 tl, int24 tu, uint amount0, uint amount1) = abi.decode(payload, ...);
        //    adapter.openPosition(t0, t1, fee, tl, tu, amount0, amount1);
        // }
        
        emit MessageReceived(_origin.srcEid, _origin.sender, data);
    }
}
