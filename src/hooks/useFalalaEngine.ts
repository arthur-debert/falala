import { useEffect, useState, useCallback } from "react";
import { FalalaEngine } from "../engine/FalalaEngine";
import type { EngineEvent, GridItem } from "../engine/FalalaEngine";
import { Loader } from "../engine/loader";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

// Singleton engine instance to persist across re-renders
let engineInstance: FalalaEngine | null = null;
let enginePromise: Promise<FalalaEngine> | null = null;

export const useFalalaEngine = () => {
  // Lazy initialization to avoid effect synchronization
  const [grid, setGrid] = useState<GridItem[]>(() =>
    engineInstance ? engineInstance.getGrid() : [],
  );

  const [currentSentence, setCurrentSentence] = useState(() =>
    engineInstance ? engineInstance.getSentence() : "",
  );

  const [loading, setLoading] = useState(!engineInstance);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback((engine: FalalaEngine) => {
    setGrid(engine.getGrid());
    setCurrentSentence(engine.getSentence());
  }, []);

  const handleEngineEvent = useCallback(
    async (event: EngineEvent) => {
      if (!engineInstance) return;

      if (event.type === "NAVIGATE") {
        updateState(engineInstance);
      } else if (event.type === "SPEAK") {
        try {
          await TextToSpeech.speak({
            text: event.text,
            lang: "en-US", // Should come from engine config/state
            rate: 1.0,
          });
        } catch (e) {
          console.warn("TTS failed", e);
          // Fallback
          if ("speechSynthesis" in window) {
            const u = new SpeechSynthesisUtterance(event.text);
            window.speechSynthesis.speak(u);
          }
        }
      }
    },
    [updateState],
  );

  // Effect 1: Load the Engine Singleton
  useEffect(() => {
    // If already loaded, nothing to do (state initialized lazily)
    if (engineInstance) return;

    const load = async () => {
      try {
        if (!enginePromise) {
          enginePromise = Loader.loadConfig(
            "/lexicon.yaml",
            "/translations.yaml",
          ).then((config) => new FalalaEngine(config));
        }

        const instance = await enginePromise;
        engineInstance = instance;

        // Update state and loading together (batched in React 18, safe in async)
        updateState(instance);
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load engine");
        setLoading(false);
      }
    };

    load();
  }, [updateState]);

  // Effect 2: Subscribe
  useEffect(() => {
    if (loading || !engineInstance) return;

    // No initial update needed here; handled by lazy init or the load() async completion

    // Subscribe
    const unsubscribe = engineInstance.subscribe(handleEngineEvent);
    return () => {
      unsubscribe();
    };
  }, [loading, handleEngineEvent]);

  const navigate = (key: string) => engineInstance?.navigate(key);
  const goBack = () => engineInstance?.goBack();
  const goHome = () => engineInstance?.goHome();

  return { grid, currentSentence, loading, error, navigate, goBack, goHome };
};
