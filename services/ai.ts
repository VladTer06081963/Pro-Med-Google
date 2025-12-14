/**
 * AI Service Abstraction Layer
 * Currently uses Ollama as the primary AI service
 * Can be easily switched to other providers (Gemini, OpenAI, etc.)
 */

// Import Ollama functions as the default AI provider
export {
  translateQueryToEnglish,
  translateTitlesToRussian,
  summarizeArticleForLayperson
} from './ollama';
