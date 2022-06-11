// contracts/Burner.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Presaleable.sol";

contract Burner is ERC20, Ownable, Presaleable {
    constructor(uint256 initialSupply) ERC20("Burner", "BRNR") {
        _mint(msg.sender, initialSupply * (10**decimals()));
    }
}
