'use client'

import { useState, useEffect } from "react";
import { ethers, Signer } from "ethers";
import WalletConnector from "./components/WalletConnector";
import { getBLTMBalance, getExchangeRate, depositUSDC, withdrawERC20 } from "./utils/contractInteractions";
import Header from "./components/Header";
import ExchangeForm from "./components/ExchangeForm";
import AdminPanel from "./components/AdminPanel";
import TransactionTable from "./components/TransactionTable";

interface Transaction {
  date: string;
  action: string;
  amount: string;
}

export default function Home() {

  const [signer, setSigner] = useState<Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (signer) {
      fetchBalance();
      fetchExchangeRate();
    }
  }, [signer]);

  const fetchBalance = async () => {
    if (!signer) return;
    const bal = await getBLTMBalance(signer);
    setBalance(bal);
  };

  const fetchExchangeRate = async () => {
    if (!signer) return;
    const provider = signer.provider as ethers.Provider;
    const rate = await getExchangeRate(provider);
    setExchangeRate(rate);
  };

  const handleDeposit = async (amount: string) => {
    if (!signer) return;
    await depositUSDC(amount, signer);
    fetchBalance();
    addTransaction("Deposit", amount);
  };

  // const handleWithdraw = async (amount: string) => {
  //   if (!signer) return;
  //   await withdrawERC20(amount, signer);
  //   fetchBalance();
  //   addTransaction("Withdraw", amount);
  // };

  const addTransaction = (action: string, amount: string) => {
    setTransactions([...transactions, {
      date: new Date().toLocaleString(),
      action,
      amount,
    }]);
  };

  const handleExchange = (amount: string, token: "USDC" | "BLTM") => {
    alert(`Exchanging ${amount} ${token}`);
  };

  const handleSetExchangeRate = (newRate: number) => {
    setExchangeRate(newRate);
    alert(`Exchange rate updated to ${newRate}`);
  };

  const handleWithdraw = (amount: number) => {
    alert(`Withdrawing ${amount} USDC`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-3xl font-semibold mb-4">Liquidity Pool</h1>
            <WalletConnector setSigner={setSigner} setWalletAddress={setWalletAddress} />
            <p className="text-lg mb-6">Current Exchange Rate: {exchangeRate}</p>
            <p>Wallet Address: {walletAddress}</p>
            <p>BLTM Balance: {balance}</p>
          </div>
          <ExchangeForm onExchange={handleExchange} />
          <AdminPanel
            onSetExchangeRate={handleSetExchangeRate}
            onWithdraw={handleWithdraw}
          />
          <TransactionTable/>
        </div>
      </main>
    </div>
  );
}
