const { ethers } = require("hardhat");
import { formatUnits } from "ethers";

async function main() {
    console.log('Getting the fun token contract...');
    const contractAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F';
    const bltmToken = await ethers.getContractAt('BLTMToken', contractAddress);
    
    console.log('Querying token name...');
    const name = await bltmToken.name();
    console.log(`Token Name: ${name}\n`);

    console.log('Getting the balance of contract owner...');
    const signers = await ethers.getSigners();
    const ownerAddress = signers[0].address;
    let ownerBalance = await bltmToken.balanceOf(ownerAddress);
    let decimals = await bltmToken.decimals();
    console.log(`Contract owner at ${ownerAddress} has a balance of ${formatUnits(ownerBalance, decimals)}\n`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });