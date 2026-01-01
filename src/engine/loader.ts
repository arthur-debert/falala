import yaml from "js-yaml";
import type { Config, LexiconRoot, TranslationMap } from "./types";

export class Loader {
  static async loadConfig(
    lexiconUrl: string,
    translationsUrl: string,
  ): Promise<Config> {
    const [lexiconText, translationsText] = await Promise.all([
      fetch(lexiconUrl).then((r) => r.text()),
      fetch(translationsUrl).then((r) => r.text()),
    ]);

    const lexicon = yaml.load(lexiconText) as LexiconRoot;
    const translations = yaml.load(translationsText) as Record<
      string,
      TranslationMap
    >;

    // Basic validation could happen here
    if (!lexicon.phrases) {
      throw new Error('Invalid Lexicon: Missing "phrases" root.');
    }

    return { lexicon, translations };
  }
}
