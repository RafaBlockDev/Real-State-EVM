import { expect } from "chai";
 import { BigNumber } from "ethers";
 import { ethers } from "hardhat";
import { execPath } from "process";
 let owner, Rafa, Joshua, Moka;

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

       [owner, Rafa] = await ethers.getSigners();

       await apartament.deployed();
       await apartament.transfer(Rafa.address, 20);
       expect(await apartament.balanceOf(Rafa.address)).to.equal(20);
       expect(await apartament.balanceOf(owner.address)).to.equal(80);
   })

   it("It should be possible to pay the rent and deposit it in ether in the apartment contract", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Rafa, Joshua] = await ethers.getSigners();

    await apartment.deployed();

    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1")
    })

    expect(await apartment.balance()).to.equal(ethers.utils.parseEther("1"));
  })

  it("Owner should be able to withdraw resources paid as rent", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Rafa, Joshua] = await ethers.getSigners();

    await apartment.deployed();
    await apartment.transfer(Rafa.address, 20);

    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1")
    });

    const ownerBalanceBeforeWithdrawal = await owner.getBalance();
    await apartment.withdraw();

    expect(await (await owner.getBalance()).gt(ownerBalanceBeforeWithdrawal)).to.be.true;
  })

  it("Shareholder be able to withdraw resources paid as rent", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Rafa, Joshua] = await ethers.getSigners();

    await apartment.deployed();
    await apartment.transfer(Rafa.address, 20);

    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1")
    });

    const rafaBalanceOfWithdrawal = await Rafa.getBalance();
    await apartment.connect(Rafa).withdraw();
    expect(await (await Rafa.getBalance()).gt(rafaBalanceOfWithdrawal)).to.be.true;
  })

  it("Attempt to withdraw by non shareholder be reverted", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Rafa, Joshua] = await ethers.getSigners();

    await apartment.deployed();
    await apartment.transfer(Rafa.address, 20);

    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1")
    });

    await expect(apartment.connect(Joshua).withdraw()).to.be.revertedWith("Unauthorized");
  })

  it("Apartment shareholder be able to withdraw resources proportional to his share", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Rafa, Joshua] = await ethers.getSigners();

    await apartment.deployed();
    await apartment.transfer(Rafa.address, 20);

    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1")
    });

    const rafaBalanceBeforeWithdrawal = await Rafa.getBalance();

    await apartment.connect(Rafa).withdraw();
    expect(await (await apartment.balance()).eq(ethers.utils.parseEther("0.8"))).to.be.true;
    expect(await (await apartment.balance()).gt(ethers.utils.parseEther("0"))).to.be.true;
    expect(await (await Rafa.getBalance()).gt(rafaBalanceBeforeWithdrawal)).to.be.true;
  })

  it("It should not be possible to withdraw more than one should", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Rafa, Joshua] = await ethers.getSigners();

    await apartment.deployed();
    await apartment.transfer(Rafa.address, 20);
  
    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1")
    })

    await apartment.connect(Rafa).withdraw();
    await expect(apartment.connect(Rafa).withdraw()).to.be.revertedWith("0 funds to withdraw");
  });

  it("It should be possible to withdraw multiple times provided there were in between", async () => {
    const Apartment = await ethers.getContractFactory("Apartment");
    const apartment = await Apartment.deploy();

    [owner, Rafa, Joshua] = await ethers.getSigners();

    await apartment.deployed();
    await apartment.transfer(Rafa.address, 20);

    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1")
    })

    await apartment.connect(Rafa).withdraw();
    await Joshua.sendTransaction({
      to: apartment.address,
      value: ethers.utils.parseEther("1");
    })

    await expect(apartment.connect(Rafa).withdraw()).not.to.be.revertedWith("0 funds to withdraw");
  })
 }); 