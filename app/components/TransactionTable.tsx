import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

// Define the interface for a transaction row
interface Transaction {
  date: string;
  action: string;
  amount: string;
}

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortedByDate, setSortedByDate] = useState<boolean>(true); // Sort state
  const [filterAction, setFilterAction] = useState<string>(""); // Filter state for mint/burn

  const fetchTransactions = async (address: string) => {
    // const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL); // Replace with your provider
    // const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Your contract address
    // const contractABI = [
    //   "event Minted(address indexed user, uint256 amount)",
    //   "event Burned(address indexed user, uint256 amount)",
    // ];
    // const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // // Fetch Mint and Burn events
    // const mintedEvents = await contract.queryFilter(
    //   contract.filters.Minted(address)
    // );
    // const burnedEvents = await contract.queryFilter(
    //   contract.filters.Burned(address)
    // );

    // // Format and combine both minted and burned events
    // const combinedEvents = [
    //   ...mintedEvents.map((event) => ({
    //     date: new Date(event.blockTimestamp * 1000).toLocaleString(),
    //     action: "Minted",
    //     amount: ethers.utils.formatEther(event.args.amount),
    //   })),
    //   ...burnedEvents.map((event) => ({
    //     date: new Date(event.blockTimestamp * 1000).toLocaleString(),
    //     action: "Burned",
    //     amount: ethers.utils.formatEther(event.args.amount),
    //   })),
    // ];

    // // Set the transactions state
    // setTransactions(combinedEvents);
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
      
      {/* Filter Buttons */}
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

      {/* Sort Button */}
      <button
        onClick={handleSort}
        className="bg-gray-500 text-white py-1 px-4 rounded mb-4"
      >
        Sort by Date
      </button>

      {/* Transaction Table */}
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

export default TransactionTable;