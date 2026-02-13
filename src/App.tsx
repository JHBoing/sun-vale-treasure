import { useEffect, useState } from "react";
import "./App.css";
import SunValeColorPuzzlePage from "./components/SunValeColorPuzzlePage";
import TreasureCartographyParserPage from "./components/TreasureCartographyParserPage";

type TabName = "sun-vale" | "treasure-cartography";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>("sun-vale");
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const savedTheme = window.localStorage.getItem("theme-mode");
    if (savedTheme === "night") return true;
    if (savedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.body.classList.toggle("theme-night", isNightMode);
    window.localStorage.setItem("theme-mode", isNightMode ? "night" : "light");
  }, [isNightMode]);

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="tab-bar">
          <button
            className={`tab-button ${activeTab === "sun-vale" ? "is-active" : ""}`}
            onClick={() => setActiveTab("sun-vale")}
            type="button"
          >
            Sun Vale Color Puzzle
          </button>
          <button
            className={`tab-button ${activeTab === "treasure-cartography" ? "is-active" : ""}`}
            type="button"
            disabled
            aria-disabled="true"
          >
            Treasure Cartography Parser
          </button>
        </div>
        <button className="theme-toggle" onClick={() => setIsNightMode((prev) => !prev)} type="button">
          {isNightMode ? "Light Mode" : "Night Mode"}
        </button>
      </div>

      <div className="page-frame">
        {activeTab === "sun-vale" ? <SunValeColorPuzzlePage /> : <TreasureCartographyParserPage />}
      </div>
    </div>
  );
}
