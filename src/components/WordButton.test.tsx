import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WordButton } from "./WordButton";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

// Mock the Capacitor plugin
vi.mock("@capacitor-community/text-to-speech", () => ({
  TextToSpeech: {
    speak: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("WordButton", () => {
  it("renders correctly", () => {
    render(<WordButton word="Test" svg={<span>SVG</span>} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("SVG")).toBeInTheDocument();
  });

  it("calls TTS on click", async () => {
    render(<WordButton word="Apple" svg={<span>SVG</span>} />);

    const button = screen.getByRole("button", { name: /Speak word: Apple/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(TextToSpeech.speak).toHaveBeenCalledWith({
        text: "Apple",
        lang: "en-US",
        rate: 1.0,
      });
    });
  });
});
