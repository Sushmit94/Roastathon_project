import { Link } from "react-router-dom";
import React, { useState } from "react";

function Navigation({ apiKey, setApiKey, showApiInput, setShowApiInput }) {
  const [wallet, setWallet] = useState(null);
  const getMetaMaskProvider = () => {
    if (window.ethereum?.providers) {
      return window.ethereum.providers.find((p) => p.isMetaMask);
    }
    return window.ethereum;
  };

  const connectWallet = async () => {
    try {
      const provider = getMetaMaskProvider();

      if (!provider) {
        alert("MetaMask not detected! Install MetaMask extension.");
        return;
      }

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      setWallet(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const shortWallet = wallet
    ? wallet.slice(0, 6) + "..." + wallet.slice(-4)
    : null;

  return (
    <nav className="
        w-full flex items-center justify-between
        py-4 px-6 md:px-10
        bg-black border-b border-gray-800 text-gray-200
      "
    >

      {/* LEFT — NAME */}
      <Link to="/" className="text-2xl font-bold hover:text-white transition">
        MiniAave
      </Link>

      {/* CENTER — LINKS */}
      <div className="flex gap-15 text-sm">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/lending" className="hover:text-white transition">Lending</Link>
        <Link to="/borrowing" className="hover:text-white transition">Borrowing</Link>
      </div>

      {/* RIGHT — API & WALLET BUTTONS */}
      <div className="flex gap-4 items-center">

        {/* API Button */}
        <button
          onClick={() => setShowApiInput(!showApiInput)}
          className={`
            text-xs px-3 py-1 rounded border transition
            ${
              apiKey
                ? "border-green-500 text-green-400 hover:bg-green-500/10"
                : "border-gray-500 text-gray-300 hover:bg-white/10"
            }
          `}
        >
          {apiKey ? "✓ API Connected" : "⚙️ Setup API"}
        </button>

        {/* MetaMask Button */}
        <button
          onClick={connectWallet}
          className="
            text-xs px-3 py-1 rounded border border-purple-500
            text-purple-300 hover:bg-purple-500/10 transition
          "
        >
          {wallet ? shortWallet : "🔗 Connect MetaMask"}
        </button>

      </div>
    </nav>
  );
}

export default Navigation;
