import { useState } from "react";

interface AdminPanelProps {
  onSetExchangeRate: (rate: number) => void;
  onWithdraw: (amount: number) => void;
}

export default function AdminPanel({ onSetExchangeRate, onWithdraw }: AdminPanelProps) {
  const [rate, setRate] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

  return (
    <div className="bg-white p-6 rounded shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Set Exchange Rate</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={() => onSetExchangeRate(rate)}
          className="bg-blue-600 text-white py-2 px-4 rounded mt-2 hover:bg-blue-500"
        >
          Update Rate
        </button>
      </div>
      <div>
        <label className="block text-gray-700">Withdraw USDC</label>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={() => onWithdraw(withdrawAmount)}
          className="bg-blue-600 text-white py-2 px-4 rounded mt-2 hover:bg-blue-500"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}