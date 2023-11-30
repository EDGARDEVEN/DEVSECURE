// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityContract {
    mapping(address => string) public identities;

    function setIdentity(string memory identity) public {
        identities[msg.sender] = identity;
    }

    function getIdentity() public view returns (string memory) {
        return identities[msg.sender];
    }
}
