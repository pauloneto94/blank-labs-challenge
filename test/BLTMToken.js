const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BLTM Token Contract", function () {
  let BLTM, bltm, owner, addr1, addr2;

  beforeEach(async function () {
    BLTM = await ethers.getContractFactory("BLTMToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    bltm = await BLTM.deploy();
  });

  it("Should assign minter and pauser roles to the deployer", async function () {
    const MINTER_ROLE = await bltm.MINTER_ROLE();
    const PAUSER_ROLE = await bltm.PAUSER_ROLE();
    expect(await bltm.hasRole(MINTER_ROLE, owner.address)).to.be.true;
    expect(await bltm.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
  });

  it("Should allow minter to mint tokens", async function () {
    await bltm.connect(owner).mint(addr1.address, 1000);
    expect(await bltm.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should not allow non-minter to mint tokens", async function () {
    await expect(bltm.connect(addr1).mint(addr2.address, 1000))
        .to.be.revertedWithCustomError(bltm, "AccessControlUnauthorizedAccount");
  });

  it("Should only allow burning of tokens by minter", async function () {

    await bltm.connect(owner).mint(addr1.address, 1000);

    await expect(bltm.connect(addr1).burn(500))
      .to.be.revertedWithCustomError(bltm, "AccessControlUnauthorizedAccount");

    await bltm.connect(owner).burn(500);
  });

  it("Should allow pauser to pause and unpause minting and burning", async function () {
    await bltm.connect(owner).pause();

    await expect(bltm.connect(owner).mint(addr1.address, 1000))
      .to.be.reverted;

    await expect(bltm.connect(owner).burn(500))
      .to.be.reverted;

    await bltm.connect(owner).unpause();

    await bltm.connect(owner).mint(addr1.address, 1000);
  });

  it("Should allow unpausing by pauser", async function () {
    await bltm.connect(owner).pause();
    await bltm.connect(owner).unpause();
    await bltm.connect(owner).mint(addr1.address, 1000);
    expect(await bltm.balanceOf(addr1.address)).to.equal(1000);
  });
});