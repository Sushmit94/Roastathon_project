import React, { useEffect, useState } from "react";

const SAMPLE_MARKETS = [
  { id: "USDC", name: "USDC", supplyAPY: 2.1, borrowAPY: 3.5, collateralFactor: 0.75, price: 1 },
  { id: "DAI", name: "DAI", supplyAPY: 1.8, borrowAPY: 3.2, collateralFactor: 0.72, price: 1 },
  { id: "ETH", name: "ETH", supplyAPY: 0.5, borrowAPY: 1.2, collateralFactor: 0.6, price: 1600 },
];

export default function App() {
  const [markets] = useState(SAMPLE_MARKETS);
  const [supplied, setSupplied] = useState({ USDC: 0, DAI: 0, ETH: 0 });
  const [borrowed, setBorrowed] = useState({ USDC: 0, DAI: 0, ETH: 0 });

  const [selectedSupplyAsset, setSelectedSupplyAsset] = useState("USDC");
  const [supplyAmount, setSupplyAmount] = useState("");
  const [selectedBorrowAsset, setSelectedBorrowAsset] = useState("USDC");
  const [borrowAmount, setBorrowAmount] = useState("");

  const [totalCollateralUSD, setTotalCollateralUSD] = useState(0);
  const [health, setHealth] = useState("Safe");
  const [liquidationProb, setLiquidationProb] = useState(0);

  const [apiKey, setApiKey] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showApiInput, setShowApiInput] = useState(false);

  const findMarket = (id) => markets.find((m) => m.id === id) || markets[0];

  const handleSupply = () => {
    const amt = Number(supplyAmount || 0);
    if (!amt || amt <= 0) return;
    setSupplied((s) => ({ ...s, [selectedSupplyAsset]: (Number(s[selectedSupplyAsset]) || 0) + amt }));
    const market = findMarket(selectedSupplyAsset);
    setTotalCollateralUSD((c) => Number((c + amt * market.price).toFixed(2)));
    setSupplyAmount("");
  };

  const handleBorrow = () => {
    const amt = Number(borrowAmount || 0);
    if (!amt || amt <= 0) return;

    const collateralValue = totalCollateralUSD;
    const avgCF = markets.reduce((acc, m) => acc + m.collateralFactor, 0) / markets.length;
    const allowed = collateralValue * avgCF;
    const totalBorrowedUSD = Object.keys(borrowed).reduce((acc, k) => acc + Number(borrowed[k] || 0), 0);

    if (totalBorrowedUSD + amt > allowed) {
      alert("Borrow would exceed allowed collateral-based limit. Reduce amount or add collateral.");
      return;
    }

    setBorrowed((b) => ({ ...b, [selectedBorrowAsset]: (Number(b[selectedBorrowAsset]) || 0) + amt }));
    setBorrowAmount("");
  };

  useEffect(() => {
    const totalBorrowedUSD = Object.keys(borrowed).reduce((acc, k) => acc + Number(borrowed[k] || 0), 0);
    const collateralValue = totalCollateralUSD;
    if (collateralValue <= 0 && totalBorrowedUSD > 0) {
      setHealth("Critical");
      setLiquidationProb(95);
      return;
    }

    const ratio = collateralValue > 0 ? (totalBorrowedUSD / collateralValue) * 100 : 0;
    if (ratio <= 30) {
      setHealth("Safe");
      setLiquidationProb(5 + Math.round(ratio));
    } else if (ratio > 30 && ratio <= 60) {
      setHealth("Moderate");
      setLiquidationProb(20 + Math.round(ratio * 0.6));
    } else {
      setHealth("Risky");
      setLiquidationProb(50 + Math.round(ratio * 0.7));
    }
  }, [totalCollateralUSD, borrowed]);

  // AI ANALYSIS using Groq API (fastest and free)
  const handleAIAnalysis = async () => {
    if (!apiKey.trim()) {
      setAiOutput("⚠️ Please enter your Groq API key first.\n\nGet FREE API key from: https://console.groq.com/keys\n\n(Takes 30 seconds to sign up!)");
      setShowApiInput(true);
      return;
    }

    setAiLoading(true);
    setAiOutput("🤖 AI is analyzing your DeFi position...");

    const totalBorrowedUSD = Object.keys(borrowed).reduce((acc, k) => acc + Number(borrowed[k] || 0), 0);
    
    // Build detailed position data
    const suppliedAssets = Object.entries(supplied)
      .filter(([_, amt]) => amt > 0)
      .map(([asset, amt]) => `${amt} ${asset}`)
      .join(", ") || "None";
    
    const borrowedAssets = Object.entries(borrowed)
      .filter(([_, amt]) => amt > 0)
      .map(([asset, amt]) => `${amt} ${asset}`)
      .join(", ") || "None";

    const utilizationRatio = totalCollateralUSD > 0 
      ? ((totalBorrowedUSD / totalCollateralUSD) * 100).toFixed(2) 
      : 0;

    const prompt = `You are a DeFi risk analyst. Analyze this lending position and provide actionable advice.

POSITION DETAILS:
- Collateral Supplied: ${suppliedAssets}
- Total Collateral Value: $${totalCollateralUSD}
- Assets Borrowed: ${borrowedAssets}
- Total Borrowed: $${totalBorrowedUSD}
- Collateral Utilization: ${utilizationRatio}%
- Health Status: ${health}
- Liquidation Risk: ${liquidationProb}%

USER QUESTION: ${aiInput || "Should I adjust my position?"}

Provide a brief analysis (3-4 sentences) covering:
1. Current risk level assessment
2. Specific actionable recommendations
3. Warning about any immediate concerns

Keep it simple and actionable for beginners.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Fast and free model
          messages: [
            {
              role: "system",
              content: "You are a helpful DeFi risk advisor. Provide clear, actionable advice in simple terms."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0]?.message?.content || "No analysis generated.";
      
      setAiOutput(`🤖 AI Risk Analysis:\n\n${analysis}`);
    } catch (error) {
      console.error("AI Error:", error);
      setAiOutput(`❌ Error: ${error.message}\n\nTroubleshooting:\n1. Check your API key is correct\n2. Ensure you have Groq credits\n3. Get a free key at: https://console.groq.com/keys`);
    } finally {
      setAiLoading(false);
    }
  };

  const totalBorrowedUSD = Object.keys(borrowed).reduce((acc, k) => acc + Number(borrowed[k] || 0), 0);

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans">
      <nav className="flex items-center justify-between border-b py-3 mb-8">
        <div className="text-xl font-bold">MiniAave • Lending Simulator</div>
        <button 
          onClick={() => setShowApiInput(!showApiInput)}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
        >
          {apiKey ? "✓ API Connected" : "⚙️ Setup API"}
        </button>
      </nav>

      {showApiInput && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold mb-2">🔑 Groq API Key (Free)</h4>
          <p className="text-xs text-gray-600 mb-2">
            Get your free API key from: <a href="https://console.groq.com/keys" target="_blank" className="text-blue-600 underline">console.groq.com/keys</a>
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 p-2 border rounded"
            />
            <button 
              onClick={() => setShowApiInput(false)}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Markets</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {markets.map((m) => (
                <div key={m.id} className="p-3 border rounded">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-600">Supply APY: {m.supplyAPY}%</div>
                  <div className="text-xs text-gray-600">Borrow APY: {m.borrowAPY}%</div>
                  <div className="text-xs text-gray-600">Collateral Factor: {Math.round(m.collateralFactor * 100)}%</div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Supply (Lend)</h4>
              <label className="block text-xs mb-1">Asset</label>
              <select className="w-full p-2 border mb-3" value={selectedSupplyAsset} onChange={(e)=>setSelectedSupplyAsset(e.target.value)}>
                {markets.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
              </select>

              <label className="block text-xs mb-1">Amount</label>
              <input className="w-full p-2 border mb-3" value={supplyAmount} onChange={(e)=>setSupplyAmount(e.target.value)} placeholder="0.0" />

              <div className="flex gap-2">
                <button className="flex-1 p-2 bg-black text-white rounded" onClick={handleSupply}>Deposit to Pool</button>
                <button className="flex-1 p-2 border rounded" onClick={()=>{setSupplyAmount("")}}>Reset</button>
              </div>

              <div className="mt-3 text-xs text-gray-600">Supplied: {supplied[selectedSupplyAsset] || 0} {selectedSupplyAsset}</div>
            </div>

            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Borrow</h4>
              <label className="block text-xs mb-1">Borrow Asset</label>
              <select className="w-full p-2 border mb-3" value={selectedBorrowAsset} onChange={(e)=>setSelectedBorrowAsset(e.target.value)}>
                {markets.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
              </select>

              <label className="block text-xs mb-1">Amount (USD equivalent)</label>
              <input className="w-full p-2 border mb-3" value={borrowAmount} onChange={(e)=>setBorrowAmount(e.target.value)} placeholder="0.0" />

              <div className="flex gap-2">
                <button className="flex-1 p-2 bg-black text-white rounded" onClick={handleBorrow}>Borrow</button>
                <button className="flex-1 p-2 border rounded" onClick={()=>setBorrowAmount("")}>Reset</button>
              </div>

              <div className="mt-3 text-xs text-gray-600">Borrowed total: {totalBorrowedUSD} USD</div>
            </div>
          </section>

          <section className="mt-6 p-4 border rounded">
            <h4 className="font-semibold mb-2">Your Position Snapshot</h4>
            <div className="text-sm text-gray-700">Collateral (USD): <strong>{totalCollateralUSD}</strong></div>
            <div className="text-sm text-gray-700">Total Borrowed (USD): <strong>{totalBorrowedUSD}</strong></div>
            <div className="mt-3">
              <div className="text-xs mb-1">Health: <strong>{health}</strong></div>
              <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
                <div style={{ width: `${liquidationProb}%` }} className={`h-3 ${health === 'Safe' ? 'bg-green-600' : health==='Moderate' ? 'bg-yellow-400' : 'bg-red-500'} transition-all`}></div>
              </div>
              <div className="text-xs mt-1">Liquidation Probability: <strong>{liquidationProb}%</strong></div>
            </div>
          </section>
        </div>

        <aside className="p-4 border rounded">
          <h4 className="font-semibold mb-3">🤖 AI Risk Advisor (Groq)</h4>
          <p className="text-xs text-gray-600 mb-3">Ask the AI for advice about your current position.</p>

          <textarea 
            value={aiInput} 
            onChange={(e)=>setAiInput(e.target.value)} 
            className="w-full p-2 border mb-3 rounded" 
            rows={4} 
            placeholder="e.g. Should I reduce my borrow? Is my ETH position safe?"
          />
          
          <button 
            className="w-full p-2 bg-black text-white mb-3 rounded disabled:bg-gray-400" 
            onClick={handleAIAnalysis} 
            disabled={aiLoading}
          >
            {aiLoading ? '🔄 Analyzing…' : '🚀 Analyze Position'}
          </button>

          <div className="p-3 border rounded min-h-[120px] text-sm whitespace-pre-wrap bg-gray-50">
            {aiOutput || '💡 AI analysis will appear here after you click "Analyze Position".'}
          </div>

          <div className="mt-4 text-xs text-gray-500 space-y-1">
            <div>✨ Powered by Groq (Super Fast AI)</div>
            <div>🔒 Your API key stays in your browser</div>
            <div>🆓 Free tier: 30 requests/min</div>
          </div>
        </aside>
      </div>

      <footer className="mt-10 text-center text-xs text-gray-500">Demo: Educational only — not financial advice.</footer>
    </div>
  );
}