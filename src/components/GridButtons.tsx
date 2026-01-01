import type { GridItem } from "../engine/FalalaEngine";

interface GridButtonsProps {
  items: GridItem[];
  onPress: (key: string) => void;
}

export const GridButtons = ({ items, onPress }: GridButtonsProps) => {
  return (
    <div
      className="grid-layout"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "1rem",
        width: "100%",
        padding: "1rem",
      }}
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onPress(item.key)}
          className="grid-button"
          style={{
            backgroundColor: item.bgColor || "#f0f0f0",
            border: "none",
            borderRadius: "1rem",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "150px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "transform 0.1s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
            {item.icon}
          </span>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
