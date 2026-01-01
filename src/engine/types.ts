export interface LexiconProp {
  icon: string;
  bg_color?: string;
  // If present, this node acts as a category
  children?: Record<string, LexiconProp>;
  // If present (usually on leaf), this key is used for TTS lookups
  full_sentence?: string;
}

export interface LexiconRoot {
  phrases: Record<string, LexiconProp>;
}

export type TranslationMap = Record<string, string>;

export interface Config {
  lexicon: LexiconRoot;
  translations: Record<string, TranslationMap>;
}
