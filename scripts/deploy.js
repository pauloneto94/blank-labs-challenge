const hre = require("hardhat");

async function main() {

  const BLTMToken = await hre.ethers.deployContract("BLTMToken");
  await BLTMToken.waitForDeployment();
  console.log("BLTMToken deployed to:", BLTMToken.target);

  const USDCAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";
  const exchangeRate = 1;

  const LiquidityPool = await hre.ethers.deployContract("LiquidityPool", [
    USDCAddress, BLTMToken.target, exchangeRate
  ]);
  await LiquidityPool.waitForDeployment();
  console.log("BLTMToken deployed to:", LiquidityPool.target);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });