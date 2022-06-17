// contracts/Burner.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Presaleable.sol";

contract Burner is ERC20, Ownable, Presaleable {
    struct BurningRate {
        uint256 numerator;
        uint256 denominator;
        uint256 amountLeft;
    }

    uint256 private _initialSupply;
    BurningRate _presaleBR = BurningRate(
        1,
        1,
        15000000000 * 10**decimals()
    );
    BurningRate _notPresaleBR = BurningRate(
        9998,
        10000,
        1000000 * 10**decimals()
    );

    constructor(uint256 initialSupply_) ERC20("Burner", "BRNR") {
        _initialSupply = initialSupply_ * 10**decimals();
        _mint(msg.sender, _initialSupply);
    }

    /**
     * @dev Returns the initial supply of the token.
     */
    function initialSupply() public view returns (uint256) {
        return _initialSupply;
    }

    /**
     * @dev Returns the current burning rate of the token.
     */
    function burningRate() public view returns (uint256) {
        if (presale() == true) {
            return 100000 * _presaleBR.numerator / _presaleBR.denominator;
        } else {
            return 100000 * _notPresaleBR.numerator / _notPresaleBR.denominator;
        }
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
     * - `to` cannot be the zero address.
     * - the owner must have a balance of at least `amount`.
     */
    function allocate(address to, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        address owner = _msgSender();
        uint256 amountToBurn = _getAmountToBurn(amount);
        uint256 amountLeft = balanceOf(owner) - amountToBurn;

        if(presale() == true) {
            require(
                amountLeft >= _presaleBR.amountLeft,
                "Allocate: exceeds presale amount limit"
            );
        } else {
            require(
                amountLeft >= _notPresaleBR.amountLeft,
                "Allocate: exceeds sale amount limit"
            );
        }

        _transfer(owner, to, amount);
        _burn(owner, amountToBurn);
        return true;
    }

    /**
     * @dev Get amount to burn.
     *
     */
    // TODO: Handle possible overflows (current values are fine).
    function _getAmountToBurn(uint256 amount)
        private
        view
        returns(uint256)
    {
        if (presale() == true) {
            return amount * _presaleBR.numerator / _presaleBR.denominator;
        } else {
            return amount * _notPresaleBR.numerator / _notPresaleBR.denominator;
        }
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     * - The contract must not be in presale state.
     */
    function transfer(address to, uint256 amount)
        public
        override
        whenNotPresale
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }
}
