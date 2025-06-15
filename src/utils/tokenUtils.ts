
const CHARS_PER_TOKEN = 4;
export const GEMINI_1_5_FLASH_CONTEXT_LIMIT = 1_000_000;

export const estimateTokenCount = (text: string | undefined | null): number => {
  if (!text) return 0;
  return Math.ceil(text.length / CHARS_PER_TOKEN);
};
