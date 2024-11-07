import { useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers, Signer } from "ethers";

interface WalletConnectorProps {
  setSigner: (signer: Signer) => void;
  setWalletAddress: (address: string) => void;
}

export default function WalletConnector({ setSigner, setWalletAddress }: WalletConnectorProps) {
  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: {}
    });
    const instance = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(instance);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();

    setSigner(signer);
    setWalletAddress(walletAddress);
  };

  return (
    <button onClick={connectWallet}>
      Connect Wallet
    </button>
  );
}