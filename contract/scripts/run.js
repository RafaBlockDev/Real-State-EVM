import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { isCallTrace } from "hardhat/internal/hardhat-network/stack-traces/message-trace";

let owner, Rafa, Joshua, Elon;

describe("Apartment", function () {
    
    isCallTrace("Contract creator should have 500 shares of apartment", async () => {
        const Apartment = await ethers.getContractFactory("🏡 Apartment");
        const apartment = await Apartment.deploy();

        [owner, Rafa, Joshua, Elon] = await ethers.getSigners();

        await apartment.deployed();
        let ownerBalance = await apartment.balanceOf(owner.address);

        expect(ownerBalance).to.equal(100);
    })
});