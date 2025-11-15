import { useNavigate } from "react-router-dom";
import React from "react";
import { SAMPLE_MARKETS } from "../data/markets";
import { useState } from "react";
import AIAdvisor from "../components/AIAdvisor";

function BorrowingPage({ apiKey, setShowApiInput }) {
    const navigate = useNavigate();
    const [markets] = useState(SAMPLE_MARKETS);
    const [collateral, setCollateral] = useState({ USDC: 0, DAI: 0, ETH: 0 });
    const [borrowed, setBorrowed] = useState({ USDC: 0, DAI: 0, ETH: 0 });
    const [poolLiquidity] = useState({ USDC: 10000, DAI: 10000, ETH: 100 });
    
    const [selectedCollateralAsset, setSelectedCollateralAsset] = useState("USDC");
    const [collateralAmount, setCollateralAmount] = useState("");
    
    const [selectedBorrowAsset, setSelectedBorrowAsset] = useState("USDC");
    const [borrowAmount, setBorrowAmount] = useState("");
    
    const [repayAsset, setRepayAsset] = useState("USDC");
    const [repayAmount, setRepayAmount] = useState("");
  
    const [collateralEnabled, setCollateralEnabled] = useState({ USDC: true, DAI: true, ETH: true });
  
    const findMarket = (id) => markets.find((m) => m.id === id) || markets[0];
  
    const totalCollateralUSD = Object.keys(collateral).reduce((acc, asset) => {
      if (!collateralEnabled[asset]) return acc;
      const market = findMarket(asset);
      return acc + (Number(collateral[asset]) || 0) * market.price;
    }, 0);
  
    const totalBorrowedUSD = Object.keys(borrowed).reduce((acc, asset) => {
      const market = findMarket(asset);
      return acc + (Number(borrowed[asset]) || 0) * market.price;
    }, 0);
  
    const avgCollateralFactor = markets.reduce((acc, m) => acc + m.collateralFactor, 0) / markets.length;
    const borrowLimit = totalCollateralUSD * avgCollateralFactor;
  
    const utilizationRatio = totalCollateralUSD > 0 ? (totalBorrowedUSD / totalCollateralUSD) * 100 : 0;
    
    let health = "Safe";
    let liquidationRisk = 0;
    
    if (totalCollateralUSD <= 0 && totalBorrowedUSD > 0) {
      health = "Critical";
      liquidationRisk = 95;
    } else if (utilizationRatio <= 30) {
      health = "Safe";
      liquidationRisk = 5 + Math.round(utilizationRatio);
    } else if (utilizationRatio <= 60) {
      health = "Moderate";
      liquidationRisk = 20 + Math.round(utilizationRatio * 0.6);
    } else {
      health = "Risky";
      liquidationRisk = 50 + Math.round(utilizationRatio * 0.7);
    }
  
    const handleDepositCollateral = () => {
      const amt = Number(collateralAmount || 0);
      if (!amt || amt <= 0) return;
      setCollateral((c) => ({ ...c, [selectedCollateralAsset]: (Number(c[selectedCollateralAsset]) || 0) + amt }));
      setCollateralAmount("");
    };
  
    const handleBorrow = () => {
      const amt = Number(borrowAmount || 0);
      if (!amt || amt <= 0) return;
  
      const market = findMarket(selectedBorrowAsset);
      const borrowValueUSD = amt * market.price;
  
      // Check borrow limit
      if (totalBorrowedUSD + borrowValueUSD > borrowLimit) {
        alert("Borrow would exceed your collateral limit. Add more collateral or reduce amount.");
        return;
      }
  
      // Check pool liquidity (75% cap)
      const availableLiquidity = poolLiquidity[selectedBorrowAsset] * 0.75;
      const currentBorrowed = Number(borrowed[selectedBorrowAsset]) || 0;
      
      if (currentBorrowed + amt > availableLiquidity) {
        alert(`Pool liquidity cap reached! Maximum available: ${(availableLiquidity - currentBorrowed).toFixed(2)} ${selectedBorrowAsset}`);
        return;
      }
  
      setBorrowed((b) => ({ ...b, [selectedBorrowAsset]: currentBorrowed + amt }));
      setBorrowAmount("");
    };
  
    const handleRepay = () => {
      const amt = Number(repayAmount || 0);
      if (!amt || amt <= 0) return;
      
      const currentBorrowed = Number(borrowed[repayAsset]) || 0;
      if (amt > currentBorrowed) {
        alert("Cannot repay more than borrowed!");
        return;
      }
      
      setBorrowed((b) => ({ ...b, [repayAsset]: currentBorrowed - amt }));
      setRepayAmount("");
    };
  
    return (
      <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">

        {/* ---------- GLOBAL BACKGROUND ---------- */}
        <div className="absolute inset-0 -z-10">
          {/* Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          {/* Radial Glow */}
          <div className="absolute left-1/2 top-[-20%] -translate-x-1/2 h-[1100px] w-[1100px] rounded-full 
          bg-[radial-gradient(circle_450px_at_50%_350px,#ffffff22,#000000)]"></div>

          {/* Purple Glow */}
          <div className="absolute top-20 left-40 h-[400px] w-[400px] rounded-full blur-[150px] opacity-40 bg-purple-700"></div>

          {/* Blue Glow */}
          <div className="absolute bottom-10 right-10 h-[350px] w-[350px] rounded-full blur-[180px] opacity-40 bg-indigo-600"></div>
        </div>

        {/* ---------- PAGE CONTENT ---------- */}
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Borrower Dashboard</h2>
            <button 
              onClick={() => navigate('/lending')}
              className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded hover:border-blue-400 hover:shadow-[0_0_25px_rgba(96,165,250,0.4)] transition-all"
            >
              Switch to Lending →
            </button>
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2">
              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Available Markets</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {markets.map((m) => (
                    <div key={m.id} className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-400">Borrow APY: {m.borrowAPY}%</div>
                      <div className="text-xs text-gray-400">Collateral Factor: {Math.round(m.collateralFactor * 100)}%</div>
                      <div className="text-xs text-gray-400">Available: {poolLiquidity[m.id] * 0.75}</div>
                    </div>
                  ))}
                </div>
              </section>
    
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                  <h4 className="font-semibold mb-2">Deposit Collateral</h4>
                  <label className="block text-xs mb-1 text-gray-300">Asset</label>
                  <select 
                    className="w-full p-2 bg-white/10 border border-white/20 rounded mb-3 text-white" 
                    value={selectedCollateralAsset} 
                    onChange={(e) => setSelectedCollateralAsset(e.target.value)}
                  >
                    {markets.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                  </select>
    
                  <label className="block text-xs mb-1 text-gray-300">Amount</label>
                  <input 
                    className="w-full p-2 bg-white/10 border border-white/20 rounded mb-3 text-white" 
                    value={collateralAmount} 
                    onChange={(e) => setCollateralAmount(e.target.value)} 
                    placeholder="0.0" 
                  />
    
                  <button 
                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all" 
                    onClick={handleDepositCollateral}
                  >
                    Deposit
                  </button>
    
                  <div className="mt-3 text-xs">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input 
                        type="checkbox" 
                        checked={collateralEnabled[selectedCollateralAsset]}
                        onChange={(e) => setCollateralEnabled(prev => ({...prev, [selectedCollateralAsset]: e.target.checked}))}
                      />
                      <span>Enable as collateral</span>
                    </label>
                  </div>
                </div>
    
                <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                  <h4 className="font-semibold mb-2">Borrow</h4>
                  <label className="block text-xs mb-1 text-gray-300">Asset</label>
                  <select 
                    className="w-full p-2 bg-white/10 border border-white/20 rounded mb-3 text-white" 
                    value={selectedBorrowAsset} 
                    onChange={(e) => setSelectedBorrowAsset(e.target.value)}
                  >
                    {markets.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                  </select>
    
                  <label className="block text-xs mb-1 text-gray-300">Amount</label>
                  <input 
                    className="w-full p-2 bg-white/10 border border-white/20 rounded mb-3 text-white" 
                    value={borrowAmount} 
                    onChange={(e) => setBorrowAmount(e.target.value)} 
                    placeholder="0.0" 
                  />
    
                  <button 
                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all" 
                    onClick={handleBorrow}
                  >
                    Borrow
                  </button>
    
                  <div className="mt-3 text-xs text-gray-400">
                    Borrowed: {borrowed[selectedBorrowAsset] || 0}
                  </div>
                </div>
    
                <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                  <h4 className="font-semibold mb-2">Repay</h4>
                  <label className="block text-xs mb-1 text-gray-300">Asset</label>
                  <select 
                    className="w-full p-2 bg-white/10 border border-white/20 rounded mb-3 text-white" 
                    value={repayAsset} 
                    onChange={(e) => setRepayAsset(e.target.value)}
                  >
                    {markets.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                  </select>
    
                  <label className="block text-xs mb-1 text-gray-300">Amount</label>
                  <input 
                    className="w-full p-2 bg-white/10 border border-white/20 rounded mb-3 text-white" 
                    value={repayAmount} 
                    onChange={(e) => setRepayAmount(e.target.value)} 
                    placeholder="0.0" 
                  />
    
                  <button 
                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all" 
                    onClick={handleRepay}
                  >
                    Repay Debt
                  </button>
    
                  <div className="mt-3 text-xs text-gray-400">
                    Debt: {borrowed[repayAsset] || 0}
                  </div>
                </div>
              </section>
    
              <section className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mb-6">
                <h4 className="font-semibold mb-3">Your Borrowing Position</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Total Collateral</div>
                    <div className="text-xl font-bold">${totalCollateralUSD.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Total Borrowed</div>
                    <div className="text-xl font-bold">${totalBorrowedUSD.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Borrow Limit</div>
                    <div className="text-xl font-bold text-blue-400">${borrowLimit.toFixed(2)}</div>
                  </div>
                </div>
    
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1 text-gray-300">
                    <span>Borrow Limit Used: {totalCollateralUSD > 0 ? ((totalBorrowedUSD / borrowLimit) * 100).toFixed(1) : 0}%</span>
                    <span>${(borrowLimit - totalBorrowedUSD).toFixed(2)} available</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
                    <div 
                      style={{ width: `${totalCollateralUSD > 0 ? Math.min((totalBorrowedUSD / borrowLimit) * 100, 100) : 0}%` }} 
                      className="h-2 bg-blue-500 transition-all"
                    ></div>
                  </div>
                </div>
    
                <div>
                  <div className="text-xs mb-1 text-gray-300">Health Factor: <strong className="text-white">{health}</strong></div>
                  <div className="w-full h-3 bg-white/10 rounded overflow-hidden">
                    <div 
                      style={{ width: `${liquidationRisk}%` }} 
                      className={`h-3 transition-all ${health === 'Safe' ? 'bg-green-500' : health === 'Moderate' ? 'bg-yellow-400' : 'bg-red-500'}`}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-gray-300">Liquidation Risk: <strong className="text-white">{liquidationRisk}%</strong></div>
                </div>
              </section>
    
              <section className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <h4 className="font-semibold mb-2">Collateral Management</h4>
                <div className="space-y-2 text-sm">
                  {markets.map((m) => {
                    const collateralAmt = Number(collateral[m.id]) || 0;
                    if (collateralAmt <= 0) return null;
                    return (
                      <div key={m.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div>
                          <span className="font-medium">{m.id}: {collateralAmt} units</span>
                          <span className="text-xs text-gray-400 ml-2">(${(collateralAmt * m.price).toFixed(2)})</span>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-300">
                          <input 
                            type="checkbox" 
                            checked={collateralEnabled[m.id]}
                            onChange={(e) => setCollateralEnabled(prev => ({...prev, [m.id]: e.target.checked}))}
                          />
                          <span>{collateralEnabled[m.id] ? "Enabled" : "Disabled"}</span>
                        </label>
                      </div>
                    );
                  })}
                  {Object.values(collateral).every(v => v === 0) && (
                    <div className="text-gray-500 text-center py-4">No collateral deposited yet</div>
                  )}
                </div>
              </section>
            </div>
    
            <AIAdvisor 
              apiKey={apiKey}
              setShowApiInput={setShowApiInput}
              role="borrower"
              positionData={{
                totalCollateral: totalCollateralUSD,
                totalBorrowed: totalBorrowedUSD,
                health: health,
                liquidationRisk: liquidationRisk
              }}
            />
          </div>
        </div>
      </div>
    );
  }
  export default BorrowingPage;