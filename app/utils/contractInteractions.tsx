import { ethers, Signer, formatUnits } from "ethers";
import BLTMTokenABI from "../../artifacts/contracts/BLTMToken.sol/BLTMToken.json";

const BLTMTokenAddress = "0x1de7bfb05F6a6E6B1107fE49E4CA6A463a3A5e7A";

export const getBLTMBalance = async (signer: Signer): Promise<string> => {
  const contract = new ethers.Contract(BLTMTokenAddress, BLTMTokenABI.abi, signer);
  const balance = await contract.balanceOf(await signer.getAddress());
  return formatUnits(balance, 6);
};