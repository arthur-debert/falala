import "./App.css";
import { useFalalaEngine } from "./hooks/useFalalaEngine";
import { GridButtons } from "./components/GridButtons";
import { SentenceDisplay } from "./components/SentenceDisplay";

function App() {
  const { grid, currentSentence, loading, error, navigate, goHome, goBack } =
    useFalalaEngine();

  if (loading) return <div className="loading">Loading Engine...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app-container">
      {/* Header / Nav Bar */}
      <header
        style={{
          width: "100%",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={goHome}
          aria-label="Home"
          style={{ fontSize: "1.5rem" }}
        >
          🏠
        </button>
        {currentSentence && (
          <button onClick={goBack} aria-label="Back">
            ⬅️
          </button>
        )}
      </header>

      <SentenceDisplay sentence={currentSentence} />

      <main className="grid-container" style={{ width: "100%" }}>
        <GridButtons items={grid} onPress={navigate} />
      </main>
    </div>
  );
}

export default App;
