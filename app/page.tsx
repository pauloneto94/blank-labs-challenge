'use client'

import { useState, useEffect } from "react";
import { ethers, Signer } from "ethers";
import WalletConnector from "./components/WalletConnector";
import { getBLTMBalance } from "./utils/contractInteractions";

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
    }
  }, [signer]);

  const fetchBalance = async () => {
    if (!signer) return;
    const bal = await getBLTMBalance(signer);
    setBalance(bal);
  };


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>BLTM Liquidity Pool</h1>
      <WalletConnector setSigner={setSigner} setWalletAddress={setWalletAddress} />
      {signer && (
        <>
          <p>Wallet Address: {walletAddress}</p>
          <p>BLTM Balance: {balance}</p>
          <p>Exchange Rate (USDC - BLTM): {exchangeRate}</p>

          {/* <button onClick={() => handleDeposit("10")}>Deposit 10 USDC</button>
          <button onClick={() => handleWithdraw("10")}>Withdraw 10 BLTM</button> */}

          <h2>Transaction History</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.date}</td>
                  <td>{tx.action}</td>
                  <td>{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
