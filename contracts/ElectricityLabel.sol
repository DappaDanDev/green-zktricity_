// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";

contract ElectricityLabel {
    using Math for uint;

    enum ElectricityType { GREEN, GRAY }
    enum MethodType { CONSUMED, GENERATED }

    struct Electricity {
        uint amount;
        ElectricityType electricityType;
        MethodType method;
    }

    mapping(address => Electricity[]) public electricityRecords;

    modifier onlyAddress(address _address) {
        require(msg.sender == _address, "Caller is not the specified address");
        _;
    }

    function recordElectricity(address _address, uint _amount, ElectricityType _electricityType, MethodType _method) public onlyAddress(_address) {
        Electricity memory newRecord = Electricity({
            amount: _amount,
            electricityType: _electricityType,
            method: _method
        });

        electricityRecords[_address].push(newRecord);
    }

    function getElectricityRecords(address _address) public view onlyAddress(_address) returns (Electricity[] memory) {
        return electricityRecords[_address];
    }

    function electricityTypeToString(ElectricityType _type) public pure returns (string memory) {
        if (ElectricityType.GREEN == _type) return "GREEN";
        if (ElectricityType.GRAY == _type) return "GRAY";
        revert("Invalid electricity type");
    }

    function methodTypeToString(MethodType _method) public pure returns (string memory) {
        if (MethodType.CONSUMED == _method) return "CONSUMED";
        if (MethodType.GENERATED == _method) return "GENERATED";
        revert("Invalid method type");
    }
}