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

    /**
     * @dev End Presale.
     *
     * Requirements:
     *
     * - The caller must be the contract's owner.
     * - The contract must be in presale state.
     */
    function endPresale() public onlyOwner {
        _endPresale();
    }

    /**
     * @dev Allocate.
     *
     * Requirements:
     *
     * - The caller must be the contract's owner.
     * - The contract must be in presale state.
     * - `to` cannot be the zero address.
     * - the owner must have a balance of at least `amount`.
     */
    function allocate(address to, uint256 amount)
        public
        onlyOwner
        whenPresale
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        _burn(owner, amount);
        return true;
    }
}
