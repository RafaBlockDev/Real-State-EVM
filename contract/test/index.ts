import { expect } from "chai";
 import { BigNumber } from "ethers";
 import { ethers } from "hardhat";
 let owner, Alice, Bob, Joe;

 describe("Apartment", function () {


   it("Contract creator should have 100 shares of apartament",async () => {

     const Apartment = await ethers.getContractFactory("Apartment");
     const apartment = await Apartment.deploy();

     [owner] = await ethers.getSigners();

     await apartment.deployed();
     let ownerBalance = await apartment.balanceOf(owner.address);

     expect(ownerBalance).to.equal(100);
   })

   it("It should be possible to transfer some shares to another user", async () => {
       const Apartment = await ethers.getContractFactory("Apartment");
       const apartament = await Apartment.deploy();

       [owner, Alice] = await ethers.getSigners();

       await apartament.deployed();
       await apartament.transfer(Alice.address, 20);
       expect(await apartament.balanceOf(Alice.address)).to.equal(20);
       expect(await apartament.balanceOf(owner.address)).to.equal(80);
   })

 }); 