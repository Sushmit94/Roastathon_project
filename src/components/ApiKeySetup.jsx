import React from "react";
function ApiKeySetup({ apiKey, setApiKey, showApiInput, setShowApiInput }) {
    if (!showApiInput) return null;
    
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold mb-2">🔑 Groq API Key (Free)</h4>
        <p className="text-xs text-gray-600 mb-2">
          Get your free API key from: <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">console.groq.com/keys</a>
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
    );
}

export default ApiKeySetup;