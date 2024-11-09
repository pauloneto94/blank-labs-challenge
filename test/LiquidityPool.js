const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseUnits } = require("ethers");

describe("LiquidityPool Contract", function () {
  let BLTM, bltm, USDC, usdc, LiquidityPool, liquidityPool;
  let bltmAddress, usdcAddress, liquidityPoolAddress;
  let owner, addr1, addr2;

  beforeEach(async function () {

    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy BLTM token
    BLTM = await ethers.getContractFactory("BLTMToken");
    bltm = await BLTM.deploy();
    bltmAddress = await bltm.getAddress();
    console.log("BLTM Token Address:", bltmAddress);

    // Deploy mock USDC token
    USDC = await ethers.getContractFactory("MockUSDC");
    usdc = await USDC.deploy();
    usdcAddress = await usdc.getAddress();
    console.log("USDC Token Address:", usdcAddress);

    // Deploy Liquidity Pool contract
    LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPool.deploy(bltm, usdc, 1);
    liquidityPoolAddress = await liquidityPool.getAddress();

    const MINTER_ROLE = await bltm.MINTER_ROLE();
    await bltm.grantRole(MINTER_ROLE, await liquidityPool.getAddress());

    await usdc.mint(addr1.address, parseUnits("1000", 6));
  });

  it("Should allow deposit of USDC and mint BLTM", async function () {
    await usdc.connect(addr1).approve(liquidityPoolAddress, parseUnits("10", 6));
    await liquidityPool.connect(addr1).exchangeUSDCForBLTM(parseUnits("10", 6));

    const bltmBalance = await bltm.balanceOf(addr1.address);
    expect(bltmBalance).to.equal(parseUnits("9.8", 6));
  });

  it("Should allow owner to withdraw USDC", async function () {
    await usdc.connect(addr1).approve(liquidityPoolAddress, parseUnits("100", 6));
    await liquidityPool.connect(addr1).exchangeUSDCForBLTM(parseUnits("100", 6));

    const usdcBalanceBefore = await usdc.balanceOf(owner.address);
    await liquidityPool.withdrawUSDC(parseUnits("98", 6));
    const usdcBalanceAfter = await usdc.balanceOf(owner.address);

    expect(usdcBalanceAfter - usdcBalanceBefore).to.equal(parseUnits("98", 6));
  });

  it("Should allow swapping BLTM back to USDC", async function () {

    await usdc.connect(addr1).approve(liquidityPoolAddress, parseUnits("50", 6));
    await liquidityPool.connect(addr1).exchangeUSDCForBLTM(parseUnits("50", 6));

    await bltm.connect(addr1).approve(liquidityPoolAddress, parseUnits("49", 6));
    await liquidityPool.connect(addr1).exchangeBLTMForUSDC(parseUnits("49", 6));

    const usdcBalance = await usdc.balanceOf(addr1.address);
    expect(usdcBalance).to.equal(parseUnits("999", 6)); // Initial 1000 - 50 + 50
  });

  it("Should only allow owner to update the exchange rate", async function () {
    await expect(
        liquidityPool.connect(addr1).setExchangeRate(2)
      ).to.be.revertedWithCustomError(liquidityPool, "AccessControlUnauthorizedAccount");
    await liquidityPool.connect(owner).setExchangeRate(2);
    expect(await liquidityPool.exchangeRate()).to.equal(2);
  });
});