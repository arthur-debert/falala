import type { Config } from "./types";

export interface GridItem {
  key: string;
  label: string;
  icon: string;
  bgColor?: string;
}

export type EngineEvent =
  | { type: "NAVIGATE"; path: string[] }
  | { type: "SPEAK"; text: string; fullSentence: string };

type Listener = (event: EngineEvent) => void;

export class FalalaEngine {
  private config: Config;
  private currentPath: string[] = [];
  private listeners: Listener[] = [];
  private currentLang: string = "en";

  constructor(config: Config) {
    this.config = config;
  }

  setLanguage(lang: string) {
    this.currentLang = lang;
    this.emit({ type: "NAVIGATE", path: this.currentPath });
  }

  getCurrentPath(): string[] {
    return this.currentPath;
  }

  // Translates a key using current language, or falls back to key
  private t(key: string): string {
    return this.config.translations[this.currentLang]?.[key] ?? key;
  }

  getGrid(): GridItem[] {
    let currentLevel = this.config.lexicon.phrases;

    // Traverse to current level
    for (const key of this.currentPath) {
      if (currentLevel[key]?.children) {
        currentLevel = currentLevel[key].children!;
      } else {
        // Should not happen if logic is correct, but safe fallback
        return [];
      }
    }

    return Object.entries(currentLevel).map(([key, prop]) => ({
      key,
      label: this.t(key), // Use translated label
      icon: prop.icon,
      bgColor: prop.bg_color,
    }));
  }

  getSentence(): string {
    // Basic sentence construction: just join translated labels for now
    // Advanced grammar (from ABOUT.lex) would go here
    return this.currentPath.map((key) => this.t(key)).join(" ");
  }

  navigate(key: string) {
    // 1. Find the node at the current level
    let currentLevel = this.config.lexicon.phrases;
    for (const step of this.currentPath) {
      currentLevel = currentLevel[step].children!;
    }

    const node = currentLevel[key];
    if (!node) return;

    // 2. Check if leaf or branch
    if (node.children) {
      // BRANCH: Descend
      this.currentPath.push(key);
      this.emit({ type: "NAVIGATE", path: this.currentPath });
    } else {
      // LEAF: Speak
      const fullSentenceKey = node.full_sentence ?? key;
      const textToSpeak = this.t(fullSentenceKey);

      this.emit({
        type: "SPEAK",
        text: textToSpeak,
        fullSentence: this.getSentence() + " " + this.t(key),
      });
    }
  }

  goBack() {
    if (this.currentPath.length > 0) {
      this.currentPath.pop();
      this.emit({ type: "NAVIGATE", path: this.currentPath });
    }
  }

  goHome() {
    this.currentPath = [];
    this.emit({ type: "NAVIGATE", path: this.currentPath });
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(event: EngineEvent) {
    this.listeners.forEach((l) => l(event));
  }
}
