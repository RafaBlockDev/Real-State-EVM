//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

contract Apartment is ERC20 {
    constructor() ERC20("ApartmentCDMX", "ACDMX") {
        super._mint(_msgSender(), 100);
        console.log("Deploying an aparment with this contract: ");
    }
}
