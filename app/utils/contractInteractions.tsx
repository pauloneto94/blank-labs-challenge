import { ethers, Signer, formatUnits, parseUnits, formatEther, EventLog } from "ethers";
import BLTMTokenABI from "../../artifacts/contracts/BLTMToken.sol/BLTMToken.json";
import LiquidityPoolABI from "../../artifacts/contracts/LiquidityPool.sol/LiquidityPool.json";
import { list } from "postcss";

const USDCAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";
const BLTMTokenAddress = "0x66010f1733EAF377acd38c3F4d3Fd130556fE14b";
const LiquidityPoolAddress = "0xf10eDC0A8aB40a7E63465E50A5a8b3735715727E";

const usdcAbi = [
  // balanceOf function
  "function balanceOf(address owner) view returns (uint256)",
  // allowance function
  "function allowance(address owner, address spender) view returns (uint256)",
  // approve function
  "function approve(address spender, uint256 amount) returns (bool)"
];

interface MintedEventLog extends EventLog {
  args: {
    user: string;
    amount: number;
  };
}

interface BurnedEventLog extends EventLog {
  args: {
    user: string;
    amount: number;
  };
}

export const getBLTMBalance = async (signer: Signer): Promise<string> => {
  const contract = new ethers.Contract(BLTMTokenAddress, BLTMTokenABI.abi, signer);
  const balance = await contract.balanceOf(await signer.getAddress());
  return formatUnits(balance, 6);
};

export const getExchangeRate = async (provider: ethers.Provider): Promise<number> => {
  const contract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI.abi, provider);
  const rate = await contract.exchangeRate();
  return rate;
};

export const depositUSDC = async (amount: string, signer: Signer): Promise<void> => {
  const usdcContract = new ethers.Contract(USDCAddress, usdcAbi, signer)
  const contract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI.abi, signer);

  const approveTx = await usdcContract.approve(LiquidityPoolAddress, parseUnits("1", 6), { gasLimit: 300000});
  await approveTx.wait();
  console.log("USDC approved!");

  const tx = await contract.exchangeUSDCForBLTM(parseUnits("1", 6));
  await tx.wait();
};

export const withdrawERC20 = async (amount: string, signer: Signer): Promise<void> => {
  const contract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI.abi, signer);
  const tx = await contract.exchangeBLTMForUSDC(parseUnits(amount, 6));
  await tx.wait();
};

export const getTransactions = async (signer: Signer): Promise<any> => {
  const contract = new ethers.Contract(BLTMTokenAddress, BLTMTokenABI.abi, signer);

  const mintedEvents = await contract.queryFilter(
    contract.filters.Minted(await signer.getAddress())
  ) as MintedEventLog[];
  const burnedEvents = await contract.queryFilter(
    contract.filters.Burned(await signer.getAddress())
  ) as BurnedEventLog[];

  const combinedEvents = [
    ...await Promise.all(
      mintedEvents.map(async (event) => ({
        date: await getBlockTimestamp(event.blockNumber, signer),
        action: "Minted",
        amount: formatEther(event.args.amount),
      }))
    ),
    ...await Promise.all(
      burnedEvents.map(async (event) => ({
        date: await getBlockTimestamp(event.blockNumber, signer),
        action: "Burned",
        amount: formatEther(event.args.amount),
      }))
    ),
  ];

  return combinedEvents
}

const getBlockTimestamp = async (blockNumber: number, signer: Signer) => {
  if (!signer.provider) {
    throw new Error("Signer does not have a provider attached");
  }
  const block = await signer.provider.getBlock(blockNumber);
  return new Date(block.timestamp * 1000).toLocaleString(); // Convert to human-readable date
};