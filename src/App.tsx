import "./App.css";
import { WordButton } from "./components/WordButton";

function App() {
  // Simple red apple SVG
  const AppleSvg = (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 80C70 80 80 60 80 40C80 20 60 10 50 20C40 10 20 20 20 40C20 60 30 80 50 80Z"
        fill="#FF5733"
      />
      <path
        d="M50 20C50 20 55 5 65 5"
        stroke="#4CAF50"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M50 20L60 10"
        stroke="#5D4037"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="app-container">
      <h1>Falala Walking Skeleton</h1>
      <main className="grid-container">
        <WordButton word="Apple" svg={AppleSvg} />
      </main>
    </div>
  );
}

export default App;
