import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useState } from "react";

interface WordButtonProps {
  word: string;
  svg: React.ReactNode;
}

export const WordButton = ({ word, svg }: WordButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePress = async () => {
    if (isSpeaking) return;

    try {
      setIsSpeaking(true);
      await TextToSpeech.speak({
        text: word,
        lang: "en-US",
        rate: 1.0,
      });
    } catch (e) {
      console.error("TTS Error:", e);
      // Fallback for browser if plugin fails (though plugin usually handles web too)
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <button
      onClick={handlePress}
      disabled={isSpeaking}
      className="word-button"
      aria-label={`Speak word: ${word}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        border: "3px solid #ccc",
        borderRadius: "1rem",
        background: "white",
        cursor: "pointer",
        transition: "transform 0.1s",
        transform: isSpeaking ? "scale(0.95)" : "scale(1)",
        width: "200px",
        height: "200px",
      }}
    >
      <div style={{ width: "100px", height: "100px", marginBottom: "1rem" }}>
        {svg}
      </div>
      <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{word}</span>
    </button>
  );
};
