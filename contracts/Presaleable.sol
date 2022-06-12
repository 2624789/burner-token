// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @dev Contract module which allows children to implement a Presale
 * flag.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPresale` and `whenPresale`, which can be applied to
 * the functions of your contract. Note that they will not be presaleable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Presaleable is Context {
    /**
     * @dev Emitted when `account` stops the presale.
     */
    event PresaleEnd(address account);

    bool private _presale;

    /**
     * @dev Initializes the contract in presale state.
     */
    constructor() {
        _presale = true;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not
     * in presale.
     *
     * Requirements:
     *
     * - The contract must not be in presale.
     */
    modifier whenNotPresale() {
        _requireNotPresale();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is in
     * presale.
     *
     * Requirements:
     *
     * - The contract must be in presale.
     */
    modifier whenPresale() {
        _requirePresale();
        _;
    }

    /**
     * @dev Returns true if the contract is in presale, and false otherwise.
     */
    function presale() public view virtual returns (bool) {
        return _presale;
    }

    /**
     * @dev Throws if the contract is in presale.
     */
    function _requireNotPresale() internal view virtual {
        require(!presale(), "Presaleable: in presale");
    }

    /**
     * @dev Throws if the contract is not in presale.
     */
    function _requirePresale() internal view virtual {
        require(presale(), "Presaleable: not in presale");
    }

    /**
     * @dev Ends presale state.
     *
     * Requirements:
     *
     * - The contract must be in presale state.
     */
    function _endPresale() internal virtual whenPresale {
        _presale = false;
        emit PresaleEnd(_msgSender());
    }
}
