import { describe, it, expect, beforeEach, vi } from "vitest";
import { FalalaEngine } from "./FalalaEngine";
import type { Config } from "./types";

const mockConfig: Config = {
  lexicon: {
    phrases: {
      hungry: {
        icon: "😋",
        children: {
          apple: { icon: "🍎", full_sentence: "request_apple" },
        },
      },
    },
  },
  translations: {
    en: {
      hungry: "I am hungry",
      apple: "Apple",
      request_apple: "I want an apple",
    },
  },
};

describe("FalalaEngine", () => {
  let engine: FalalaEngine;

  beforeEach(() => {
    engine = new FalalaEngine(mockConfig);
  });

  it("starts at root", () => {
    expect(engine.getCurrentPath()).toEqual([]);
    const grid = engine.getGrid();
    expect(grid).toHaveLength(1);
    expect(grid[0].key).toBe("hungry");
    expect(grid[0].label).toBe("I am hungry");
  });

  it("navigates to category", () => {
    engine.navigate("hungry");
    expect(engine.getCurrentPath()).toEqual(["hungry"]);

    // Grid should now show children
    const grid = engine.getGrid();
    expect(grid).toHaveLength(1);
    expect(grid[0].key).toBe("apple");
  });

  it("speaks on leaf node", () => {
    engine.navigate("hungry");

    const listener = vi.fn();
    engine.subscribe(listener);

    engine.navigate("apple");

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SPEAK",
        text: "I want an apple",
      }),
    );

    // Path should remain at category (engine decision: leaf selection doesn't change nav state)
    expect(engine.getCurrentPath()).toEqual(["hungry"]);
  });

  it("supports going back and home", () => {
    engine.navigate("hungry");
    expect(engine.getCurrentPath()).toHaveLength(1);

    engine.goBack();
    expect(engine.getCurrentPath()).toHaveLength(0);

    engine.navigate("hungry");
    engine.goHome();
    expect(engine.getCurrentPath()).toHaveLength(0);
  });
});
