// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {CrossChainBridge} from "../src/bridge/CrossChainBridge.sol";
import {OApp} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {Origin, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";

// Define structs from ILayerZeroEndpointV2 to avoid import messes in mock if needed
// But we can just import from the interface if path is correct
import {MessagingParams, MessagingReceipt, ILayerZeroEndpointV2} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

contract MockEndpoint {
    address public delegate;
    
    function setDelegate(address _delegate) external {
        delegate = _delegate;
    }

    function quote(MessagingParams calldata _params, address _sender) external view returns (MessagingFee memory) {
        return MessagingFee(0, 0);
    }

    function send(
        MessagingParams calldata _params,
        address _refundAddress
    ) external payable returns (MessagingReceipt memory) {
        return MessagingReceipt(bytes32(0), 0, MessagingFee(0, 0));
    }
    
    function nativeToken() external view returns (address) {
        return address(0);
    }
}

contract CrossChainBridgeTest is Test {
    CrossChainBridge public bridge;
    MockEndpoint public endpoint;
    address public owner = address(1);

    function setUp() public {
        endpoint = new MockEndpoint();
        vm.startPrank(owner);
        bridge = new CrossChainBridge(address(endpoint), owner);
        
        // Set peers
        bytes32 peer = bytes32(uint256(uint160(address(2)))); // Mock peer address
        bridge.setPeer(1, peer); // For receive test
        bridge.setPeer(2, peer); // For send test
        
        vm.deal(owner, 100 ether); // Fund owner
        vm.stopPrank();
    }

    function testSend() public {
        vm.startPrank(owner);
        string memory message = "Hello LayerZero";
        bytes memory options = abi.encodePacked(uint16(1), uint256(200000)); // Standard gas option
        
        bridge.send{value: 0.1 ether}(
            2, // dstEid
            message,
            options
        );
        vm.stopPrank();
    }

    function testReceive() public {
        string memory message = "Welcome to CrossChain";
        bytes memory payload = abi.encode(message);
        
        Origin memory origin = Origin(1, bytes32(uint256(uint160(address(2)))), 1); // srcEid 1, sender address(2)
        
        // Impersonate endpoint to call lzReceive
        vm.startPrank(address(endpoint));
        bridge.lzReceive(
            origin,
            bytes32(0),
            payload,
            address(0),
            ""
        );
        vm.stopPrank();
        
        assertEq(bridge.data(), message);
    }
}
