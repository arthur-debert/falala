interface SentenceDisplayProps {
  sentence: string;
}

export const SentenceDisplay = ({ sentence }: SentenceDisplayProps) => {
  if (!sentence) return null;

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "white",
        borderRadius: "1rem",
        marginBottom: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "90%",
        maxWidth: "600px",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#333" }}>
        {sentence}
      </h2>
    </div>
  );
};
