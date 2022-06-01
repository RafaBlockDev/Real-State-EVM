//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

contract Apartment is ERC20 {
    uint256 public balance;
    uint256 public totalIncome;

    mapping(address => uint256) withdrawRegister;

    constructor() ERC20("ApartmentCDMX", "ACDMX") {
        super._mint(_msgSender(), 100);
        console.log("Deploying an aparment with this contract: ");
    }

    function withdraw() public {
        require(this.balanceOf(msg.sender) > 0, "Unauthorized");
        require(
            totalIncome > withdrawRegister[msg.sender],
            "0 funds to withdraw"
        );
        uint256 meansToWithdraw = (address(this).balance / 100) *
            this.balanceOf(msg.sender);
        balance = balance - meansToWithdraw;
        withdrawRegister[msg.sender] = totalIncome;
        payable(msg.sender).transfer(meansToWithdraw);
    }

    receive() external payable {
        console.log("Receive");
        balance += msg.value;
    }
}
