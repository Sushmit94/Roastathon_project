import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ApiKeySetup from "./components/ApiKeySetup";
import HomePage from "./pages/HomePage";
import LendingPage from "./pages/LendingPage";
import BorrowingPage from "./pages/BorrowingPage";
export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);

  return (
    <Router>
     
        <Navigation 
          apiKey={apiKey} 
          setApiKey={setApiKey}
          showApiInput={showApiInput}
          setShowApiInput={setShowApiInput}
        />
        
        <ApiKeySetup 
          apiKey={apiKey}
          setApiKey={setApiKey}
          showApiInput={showApiInput}
          setShowApiInput={setShowApiInput}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lending" element={<LendingPage apiKey={apiKey} setShowApiInput={setShowApiInput} />} />
          <Route path="/borrowing" element={<BorrowingPage apiKey={apiKey} setShowApiInput={setShowApiInput} />} />
        </Routes>

       
    </Router>
  );
}