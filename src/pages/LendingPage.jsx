import { useNavigate } from "react-router-dom";
import React from "react";
import { SAMPLE_MARKETS } from "../data/markets";
import { useState } from "react";
import AIAdvisor from "../components/AIAdvisor";

function LendingPage({ apiKey, setShowApiInput }) {
    const navigate = useNavigate();
    const [markets] = useState(SAMPLE_MARKETS);
    const [supplied, setSupplied] = useState({ USDC: 0, DAI: 0, ETH: 0 });
    const [selectedAsset, setSelectedAsset] = useState("USDC");
    const [supplyAmount, setSupplyAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
  
    const findMarket = (id) => markets.find((m) => m.id === id) || markets[0];
  
    const handleSupply = () => {
      const amt = Number(supplyAmount || 0);
      if (!amt || amt <= 0) return;
      setSupplied((s) => ({ ...s, [selectedAsset]: (Number(s[selectedAsset]) || 0) + amt }));
      setSupplyAmount("");
    };
  
    const handleWithdraw = () => {
      const amt = Number(withdrawAmount || 0);
      if (!amt || amt <= 0) return;
      const current = Number(supplied[selectedAsset]) || 0;
      if (amt > current) {
        alert("Cannot withdraw more than supplied!");
        return;
      }
      setSupplied((s) => ({ ...s, [selectedAsset]: current - amt }));
      setWithdrawAmount("");
    };
  
    const totalSuppliedUSD = Object.keys(supplied).reduce((acc, asset) => {
      const market = findMarket(asset);
      return acc + (Number(supplied[asset]) || 0) * market.price;
    }, 0);
  
    const projectedYearlyEarnings = Object.keys(supplied).reduce((acc, asset) => {
      const market = findMarket(asset);
      const suppliedAmount = Number(supplied[asset]) || 0;
      return acc + (suppliedAmount * market.price * market.supplyAPY / 100);
    }, 0);
  
    const suppliedAssets = Object.entries(supplied)
      .filter(([_, amt]) => amt > 0)
      .map(([asset, amt]) => `${amt} ${asset}`)
      .join(", ") || "None";
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">💰 Lender Dashboard</h2>
          <button 
            onClick={() => navigate('/borrowing')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Switch to Borrowing →
          </button>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Available Markets</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {markets.map((m) => (
                  <div key={m.id} className="p-3 border rounded">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-600">Supply APY: {m.supplyAPY}%</div>
                    <div className="text-xs text-gray-600">Price: ${m.price}</div>
                  </div>
                ))}
              </div>
            </section>
  
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-2">Supply Assets</h4>
                <label className="block text-xs mb-1">Asset</label>
                <select 
                  className="w-full p-2 border mb-3" 
                  value={selectedAsset} 
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  {markets.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                </select>
  
                <label className="block text-xs mb-1">Amount</label>
                <input 
                  className="w-full p-2 border mb-3" 
                  value={supplyAmount} 
                  onChange={(e) => setSupplyAmount(e.target.value)} 
                  placeholder="0.0" 
                />
  
                <button 
                  className="w-full p-2 bg-black text-white rounded mb-2" 
                  onClick={handleSupply}
                >
                  Supply to Pool
                </button>
  
                <div className="mt-3 text-xs text-gray-600">
                  Currently Supplied: {supplied[selectedAsset] || 0} {selectedAsset}
                </div>
              </div>
  
              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-2">Withdraw Assets</h4>
                <label className="block text-xs mb-1">Asset</label>
                <select 
                  className="w-full p-2 border mb-3" 
                  value={selectedAsset} 
                  onChange={(e) => setSelectedAsset(e.target.value)}
                >
                  {markets.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                </select>
  
                <label className="block text-xs mb-1">Amount</label>
                <input 
                  className="w-full p-2 border mb-3" 
                  value={withdrawAmount} 
                  onChange={(e) => setWithdrawAmount(e.target.value)} 
                  placeholder="0.0" 
                />
  
                <button 
                  className="w-full p-2 bg-black text-white rounded mb-2" 
                  onClick={handleWithdraw}
                >
                  Withdraw from Pool
                </button>
  
                <div className="mt-3 text-xs text-gray-600">
                  Available: {supplied[selectedAsset] || 0} {selectedAsset}
                </div>
              </div>
            </section>
  
            <section className="p-4 border rounded">
              <h4 className="font-semibold mb-3">Your Lending Position</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600">Total Supplied (USD)</div>
                  <div className="text-2xl font-bold">${totalSuppliedUSD.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Projected Yearly Earnings</div>
                  <div className="text-2xl font-bold text-green-600">${projectedYearlyEarnings.toFixed(2)}</div>
                </div>
              </div>
  
              <div className="space-y-2 text-sm">
                <h5 className="font-semibold">Earnings Breakdown:</h5>
                {markets.map((m) => {
                  const suppliedAmt = Number(supplied[m.id]) || 0;
                  const earnings = suppliedAmt * m.price * m.supplyAPY / 100;
                  if (suppliedAmt <= 0) return null;
                  return (
                    <div key={m.id} className="flex justify-between text-gray-700">
                      <span>{m.id}: {suppliedAmt} units</span>
                      <span className="text-green-600">+${earnings.toFixed(2)}/year</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
  
          <AIAdvisor 
            apiKey={apiKey}
            setShowApiInput={setShowApiInput}
            role="lender"
            positionData={{
              totalSupplied: totalSuppliedUSD,
              projectedEarnings: projectedYearlyEarnings,
              assets: suppliedAssets
            }}
          />
        </div>
      </div>
    );
  }
  export default LendingPage;