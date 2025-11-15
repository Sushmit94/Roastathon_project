import React, { useState } from "react";
function AIAdvisor({ apiKey, setShowApiInput, role, positionData }) {
    const [aiInput, setAiInput] = useState("");
    const [aiOutput, setAiOutput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
  
    const handleAIAnalysis = async () => {
      if (!apiKey.trim()) {
        setAiOutput("⚠️ Please enter your Groq API key first.\n\nGet FREE API key from: https://console.groq.com/keys\n\n(Takes 30 seconds to sign up!)");
        setShowApiInput(true);
        return;
      }
  
      setAiLoading(true);
      setAiOutput(`🤖 AI is analyzing your ${role} position...`);
  
      let prompt = "";
      if (role === "lender") {
        const totalSupplied = positionData.totalSupplied || 0;
        const projectedEarnings = positionData.projectedEarnings || 0;
        
        prompt = `You are a DeFi yield optimization advisor. Analyze this lending position.
  
  LENDER POSITION:
  - Total Supplied: $${totalSupplied}
  - Projected Yearly Earnings: $${projectedEarnings}
  - Assets: ${positionData.assets || "None"}
  
  USER QUESTION: ${aiInput || "How can I optimize my lending strategy?"}
  
  Provide brief advice (3-4 sentences) for a lender focusing on:
  1. Yield optimization opportunities
  2. Diversification suggestions
  3. Risk considerations
  
  Keep it actionable and beginner-friendly.`;
      } else {
        const totalCollateral = positionData.totalCollateral || 0;
        const totalBorrowed = positionData.totalBorrowed || 0;
        const health = positionData.health || "N/A";
        const liquidationRisk = positionData.liquidationRisk || 0;
        
        prompt = `You are a DeFi risk management advisor. Analyze this borrowing position.
  
  BORROWER POSITION:
  - Total Collateral: $${totalCollateral}
  - Total Borrowed: $${totalBorrowed}
  - Health Status: ${health}
  - Liquidation Risk: ${liquidationRisk}%
  
  USER QUESTION: ${aiInput || "Is my position safe?"}
  
  Provide brief advice (3-4 sentences) for a borrower focusing on:
  1. Current risk assessment
  2. Actionable recommendations
  3. Immediate concerns if any
  
  Keep it simple and actionable.`;
      }
  
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are a helpful DeFi ${role} advisor. Provide clear, actionable advice in simple terms.`
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
        
        setAiOutput(`🤖 AI ${role === "lender" ? "Yield" : "Risk"} Analysis:\n\n${analysis}`);
      } catch (error) {
        console.error("AI Error:", error);
        setAiOutput(`❌ Error: ${error.message}\n\nTroubleshooting:\n1. Check your API key is correct\n2. Ensure you have Groq credits\n3. Get a free key at: https://console.groq.com/keys`);
      } finally {
        setAiLoading(false);
      }
    };
  
    return (
      <aside className="p-4 border rounded">
        <h4 className="font-semibold mb-3">🤖 AI {role === "lender" ? "Yield" : "Risk"} Advisor</h4>
        <p className="text-xs text-gray-600 mb-3">
          Ask the AI for {role === "lender" ? "yield optimization" : "risk management"} advice.
        </p>
  
        <textarea 
          value={aiInput} 
          onChange={(e) => setAiInput(e.target.value)} 
          className="w-full p-2 border mb-3 rounded" 
          rows={4} 
          placeholder={role === "lender" 
            ? "e.g. Which asset should I supply more?" 
            : "e.g. Should I reduce my borrow? Is my position safe?"}
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
    );
  }
  export default AIAdvisor;