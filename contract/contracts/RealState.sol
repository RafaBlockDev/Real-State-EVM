//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

contract Apartment is ERC20 {
    constructor() ERC20("Apartment", "APRTM") {
        super._mint(_msgSender(), 500);
        console.log("Deploying smart contract of Apartment: ");
    }
}
