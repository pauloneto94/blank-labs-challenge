const hre = require("hardhat");

async function main() {

  const BLTMToken = await hre.ethers.deployContract("BLTMToken");
  await BLTMToken.waitForDeployment();
  console.log("BLTMToken deployed to:", BLTMToken.target);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });