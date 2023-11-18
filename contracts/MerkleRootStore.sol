// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MerkleRootStore {
    bytes32 public merkleRoot;

    function storeMerkleRoot(bytes32 _merkleRoot) public {
        merkleRoot = _merkleRoot;
    }

    function getMerkleRoot() public view returns (bytes32) {
    return merkleRoot;
}
}