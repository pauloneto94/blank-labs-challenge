import React, { useState, useEffect } from "react";
import { Signer } from "ethers";
import { getTransactions } from "../utils/contractInteractions";

interface Transaction {
  date: string;
  action: string;
  amount: string;
}

interface TransactionTableProps {
    signer: Signer;
  }

export default function TransactionTable({signer}: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortedByDate, setSortedByDate] = useState<boolean>(true);
  const [filterAction, setFilterAction] = useState<string>("");

  useEffect(() => {
    if (signer) {
      fetchTransactions(signer);
    }
  }, [signer]);

  const fetchTransactions = async (signer: Signer) => {
    getTransactions(signer).then(response => setTransactions(response))
  };

  const handleSort = () => {
    setSortedByDate(!sortedByDate);
    setTransactions((prevTransactions) => {
      return prevTransactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortedByDate ? dateA - dateB : dateB - dateA;
      });
    });
  };

  const handleFilter = (action: string) => {
    setFilterAction(action);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    filterAction ? transaction.action === filterAction : true
  );

  return (
    <div className="mt-6 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Minted and Burned Tokens</h2>
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          onClick={() => handleFilter("Minted")}
        >
          Minted
        </button>
        <button
          className="bg-red-500 text-white py-1 px-4 rounded"
          onClick={() => handleFilter("Burned")}
        >
          Burned
        </button>
      </div>

      <button
        onClick={handleSort}
        className="bg-gray-500 text-white py-1 px-4 rounded mb-4"
      >
        Sort by Date
      </button>

      <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Action</th>
            <th className="px-4 py-2 border-b">Amount (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{tx.date}</td>
                <td className="px-4 py-2 border-b">{tx.action}</td>
                <td className="px-4 py-2 border-b">{tx.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center border-b">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};