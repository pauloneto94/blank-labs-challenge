import { ethers, Signer, formatUnits, parseUnits } from "ethers";
import BLTMTokenABI from "../../artifacts/contracts/BLTMToken.sol/BLTMToken.json";
import LiquidityPoolABI from "../../artifacts/contracts/LiquidityPool.sol/LiquidityPool.json";

const USDCAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";
const BLTMTokenAddress = "0xaCF8B3e796bc21901a35318a1c7FbcCC783CF56E";
const LiquidityPoolAddress = "0xAda4a6e474eF80E4e365566eB8b0088B1d1368A6";

const usdcAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

interface Transaction {
  date: Date;
  action: "Minted" | "Burned";
  amount: string;
}

// interface TransferEvent extends EventLog {
//   args: {
//     from: string;
//     to: string;
//     value: ethers.BigNumberish;
//   };
// }

export const getBLTMBalance = async (signer: Signer): Promise<string> => {
  const contract = new ethers.Contract(BLTMTokenAddress, BLTMTokenABI.abi, signer);
  const balance = await contract.balanceOf(await signer.getAddress());
  const decimal = await contract.decimals();
  return formatUnits(balance, decimal);
};

export const getExchangeRate = async (provider: ethers.Provider): Promise<number> => {
  const contract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI.abi, provider);
  const rate = await contract.exchangeRate();
  return rate;
};

export const setExchangeRate = async (amount: string, signer: Signer): Promise<void> => {
  const contract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI.abi, signer);
  const tx = await contract.setExchangeRate(parseUnits(amount, 0));
  await tx.wait();
}

export const depositUSDC = async (amount: string, signer: Signer): Promise<void> => {
  const usdcContract = new ethers.Contract(USDCAddress, usdcAbi, signer)
  const contract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI.abi, signer);
  const balance = await usdcContract.balanceOf(await signer.getAddress());
  console.log(parseUnits(amount, 6), balance)

  const approveTx = await usdcContract.approve(LiquidityPoolAddress, parseUnits(amount, 6));
  await approveTx.wait();
  console.log("USDC approved!");

  const allowance = await usdcContract.allowance(await signer.getAddress(), LiquidityPoolAddress);
  console.log("Allowance for LiquidityPool contract:", allowance.toString());

  const tx = await contract.exchangeUSDCForBLTM(parseUnits(amount, 6));
  await tx.wait();
};

export const withdrawERC20 = async (amount: string, signer: Signer): Promise<void> => {
  const contract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI.abi, signer);
  const tx = await contract.exchangeBLTMForUSDC(parseUnits(amount, 6));
  await tx.wait();
};

export const getTransactions = async (signer: Signer): Promise<Transaction[]> => {
  console.log(signer)
  // const contract = new ethers.Contract(BLTMTokenAddress, BLTMTokenABI.abi, signer);

  // const filter = contract.filters.Transfer();
  // const events = await contract.queryFilter(filter);

  // const mintAndBurnTransactions: Transaction[] = await Promise.all(
  //   events
  //     .filter((event): event is TransferEvent =>
  //       Boolean(event.args && (event.args.from === ethers.constants.AddressZero || event.args.to === ethers.constants.AddressZero))
  //     )
  //     .map(async (event) => ({
  //       date: new Date((await provider.getBlock(event.blockNumber)).timestamp * 1000),
  //       action: event.args.from === ethers.constants.AddressZero ? "Minted" : "Burned",
  //       amount: ethers.utils.formatUnits(event.args.value, 18),
  //     }))
  // );

  return [] //mintAndBurnTransactions;

  // const combinedEvents = [
  //   ...await Promise.all(
  //     mintedEvents.map(async (event) => ({
  //       date: await getBlockTimestamp(event.blockNumber, signer),
  //       action: "Minted",
  //       amount: formatEther(event.args.amount),
  //     }))
  //   ),
  //   ...await Promise.all(
  //     burnedEvents.map(async (event) => ({
  //       date: await getBlockTimestamp(event.blockNumber, signer),
  //       action: "Burned",
  //       amount: formatEther(event.args.amount),
  //     }))
  //   ),
  // ];

  // return combinedEvents
}

// const getBlockTimestamp = async (blockNumber: number, signer: Signer) => {
//   if (!signer.provider) {
//     throw new Error("Signer does not have a provider attached");
//   }
//   const block = await signer.provider.getBlock(blockNumber);
//   return new Date(block.timestamp * 1000).toLocaleString(); // Convert to human-readable date
// };