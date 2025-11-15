import { Link } from "react-router-dom";
import React from "react";
function Navigation({ apiKey, setApiKey, showApiInput, setShowApiInput }) {
    return (
      <nav className="flex items-center justify-between border-b py-3 mb-8">
        <Link to="/" className="text-xl font-bold hover:text-gray-600">
          MiniAave • Lending Simulator
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-sm hover:underline">Home</Link>
          <Link to="/lending" className="text-sm hover:underline">Lending</Link>
          <Link to="/borrowing" className="text-sm hover:underline">Borrowing</Link>
          <button 
            onClick={() => setShowApiInput(!showApiInput)}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
          >
            {apiKey ? "✓ API Connected" : "⚙️ Setup API"}
          </button>
        </div>
      </nav>
    );
  }
  export default Navigation;