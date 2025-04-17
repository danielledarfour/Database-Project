import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroPage from "./pages/HeroPage";
import SearchPage from "./pages/SearchPage";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapVisualization";
import AIInsightsPage from "./pages/AIInsightsPage";
import About from "./pages/AboutPage";
import ErrorPage from "./pages/ErrorPage";
import useMousePositionEffect from "./hooks/useMousePositionEffect";
import APISpecPage from "./pages/APISpecPage";

function App() {
  const [darkMode] = useState(false); // Use light mode for the new design

  // Initialize the mouse position effect
  useMousePositionEffect();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-eerie-black to-dark-navy">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HeroPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/ai-insights" element={<AIInsightsPage />} />
            <Route path="/api-specs" element={<APISpecPage />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* 404 Error Page - catches all other routes */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
