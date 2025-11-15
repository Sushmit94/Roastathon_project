import { useNavigate } from "react-router-dom";
import React from "react";

function HomePage() {
  const navigate = useNavigate();

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
      <div className="max-w-4xl mx-auto px-6 py-5 relative mb-20">
  <div className="w-full flex flex-col items-center justify-center text-center mb-25 py-4 ">

  {/* MAIN TITLE */}
  <h1 className="text-[4rem] md:text-[5rem] font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
     DeFi Lending and Borrowing<br />Assisted by AI
  </h1>

  {/* SUBTITLE */}
  <p className="mt-6 text-gray-400 text-xl max-w-2xl leading-relaxed">
    Model lending, borrowing, and liquidation scenarios with clear, transparent, 
    and structured insights—powered by MiniAave.
  </p>

  {/* FEATURE PILLS */}
  <div className="flex flex-wrap justify-center gap-4 mt-10">
    <div className="px-6 py-2 rounded-full border border-gray-700 bg-black/40 backdrop-blur-sm text-gray-300 text-sm">
      Lending Simulation
    </div>

    <div className="px-6 py-2 rounded-full border border-gray-700 bg-black/40 backdrop-blur-sm text-gray-300 text-sm">
      Borrowing Analysis
    </div>

    <div className="px-6 py-2 rounded-full border border-gray-700 bg-black/40 backdrop-blur-sm text-gray-300 text-sm">
      Risk Modeling
    </div>
  </div>

</div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LENDER CARD */}
          <div
            onClick={() => navigate("/lending")}
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-400 
                      hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] 
                      transition-all cursor-pointer"
          >
            <div className="text-6xl mb-4 text-center">💰</div>
            <h2 className="text-2xl font-bold mb-2 text-center">Lender</h2>
            <p className="text-gray-300 text-center mb-4">
              Supply your assets to the lending pool and earn interest
            </p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Earn competitive APY on your crypto</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Withdraw anytime with no lock-up period</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>View real-time earnings projections</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>AI-powered yield optimization tips</span>
              </div>
            </div>

            <button className="w-full mt-6 p-3 bg-indigo-600 hover:bg-indigo-700 rounded font-semibold">
              Start Lending →
            </button>
          </div>

          {/* BORROWER CARD */}
          <div
            onClick={() => navigate("/borrowing")}
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-400 
                      hover:shadow-[0_0_25px_rgba(96,165,250,0.4)]
                      transition-all cursor-pointer"
          >
            <div className="text-6xl mb-4 text-center">🏦</div>
            <h2 className="text-2xl font-bold mb-2 text-center">Borrower</h2>
            <p className="text-gray-300 text-center mb-4">
              Deposit collateral and borrow assets for your needs
            </p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Borrow against your crypto collateral</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Real-time health factor monitoring</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Flexible repayment options</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>AI-powered risk management advice</span>
              </div>
            </div>

            <button className="w-full mt-6 p-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold">
              Start Borrowing →
            </button>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-16 p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h3 className="text-center font-semibold mb-6 text-xl text-indigo-300">
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-300">
            <div>
              <h4 className="font-semibold mb-2 text-white">For Lenders:</h4>
              <ol className="space-y-1">
                <li>1. Supply assets to the pool</li>
                <li>2. Earn interest automatically</li>
                <li>3. Withdraw anytime you want</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-white">For Borrowers:</h4>
              <ol className="space-y-1">
                <li>1. Deposit collateral assets</li>
                <li>2. Borrow up to your limit</li>
                <li>3. Repay when ready</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
