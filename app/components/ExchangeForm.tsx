import { useState } from "react";

interface ExchangeFormProps {
  onExchange: (amount: string, token: "USDC" | "BLTM") => void;
}

export default function ExchangeForm({ onExchange }: ExchangeFormProps) {
  const [amount, setAmount] = useState<string>("0");
  const [token, setToken] = useState<"USDC" | "BLTM">("USDC");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      onExchange(amount, token);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Token Swap</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Token</label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value as "USDC" | "BLTM")}
            className="w-full p-2 border rounded"
          >
            <option value="USDC">USDC</option>
            <option value="BLTM">BLTM</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
        >
          Exchange
        </button>
      </form>
    </div>
  );
}