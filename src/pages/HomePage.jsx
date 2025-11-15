import { useNavigate } from "react-router-dom";
import React from "react";
function HomePage() {
    const navigate = useNavigate();
  
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to MiniAave</h1>
          <p className="text-gray-600 text-lg">Choose your role to get started</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lending Card */}
          <div 
            onClick={() => navigate('/lending')}
            className="p-8 border-2 rounded-lg hover:border-black hover:shadow-lg transition-all cursor-pointer bg-white"
          >
            <div className="text-5xl mb-4 text-center">💰</div>
            <h2 className="text-2xl font-bold mb-3 text-center">Lender</h2>
            <p className="text-gray-600 mb-4 text-center">
              Supply your assets to the lending pool and earn interest
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Earn competitive APY on your crypto</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Withdraw anytime with no lock-up period</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>View real-time earnings projections</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>AI-powered yield optimization tips</span>
              </div>
            </div>
            <button className="w-full mt-6 p-3 bg-black text-white rounded font-semibold hover:bg-gray-800">
              Start Lending →
            </button>
          </div>
  
          {/* Borrowing Card */}
          <div 
            onClick={() => navigate('/borrowing')}
            className="p-8 border-2 rounded-lg hover:border-black hover:shadow-lg transition-all cursor-pointer bg-white"
          >
            <div className="text-5xl mb-4 text-center">🏦</div>
            <h2 className="text-2xl font-bold mb-3 text-center">Borrower</h2>
            <p className="text-gray-600 mb-4 text-center">
              Deposit collateral and borrow assets for your needs
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>Borrow against your crypto collateral</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>Real-time health factor monitoring</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>Flexible repayment options</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>AI-powered risk management advice</span>
              </div>
            </div>
            <button className="w-full mt-6 p-3 bg-black text-white rounded font-semibold hover:bg-gray-800">
              Start Borrowing →
            </button>
          </div>
        </div>
  
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">For Lenders:</h4>
              <ol className="space-y-1 text-gray-600">
                <li>1. Supply assets to the pool</li>
                <li>2. Earn interest automatically</li>
                <li>3. Withdraw anytime you want</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Borrowers:</h4>
              <ol className="space-y-1 text-gray-600">
                <li>1. Deposit collateral assets</li>
                <li>2. Borrow up to your limit</li>
                <li>3. Repay when ready</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
  export default HomePage;