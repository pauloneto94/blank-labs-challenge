const { ethers } = require("hardhat");
import { formatUnits } from "ethers";

async function main() {
    console.log('Getting the fun token contract...');
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const bltmToken = await ethers.getContractAt('BLTMToken', contractAddress);

    const USDCAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";
    const usdcContract = await ethers.getContractAt('USDC', USDCAddress);
    
    // console.log('Querying token name...');
    // const name = await bltmToken.name();
    // console.log(`Token Name: ${name}\n`);

    // console.log('Getting the balance of contract owner...');
    // const signers = await ethers.getSigners();
    // const ownerAddress = signers[0].address;
    // let ownerBalance = await bltmToken.balanceOf(ownerAddress);
    // let decimals = await bltmToken.decimals();
    // console.log(`Contract owner at ${ownerAddress} has a balance of ${formatUnits(ownerBalance, decimals)}\n`);

    // console.log('Getting the LiquidityPool contract...');
    // const liquiditPoolAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    // const liquidityPoolContract = await ethers.getContractAt('LiquidityPool', liquiditPoolAddress);

    const allowance = await usdcContract.allowance("0x6D44B36d27B8D30251D52faBEcecBCEBFeC2C911", liquiditPoolAddress);
    console.log("Allowance:", allowance.toString());

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });