import * as ollama from './ollama';
import * as gemini from './gemini';

/**
 * AI Service Abstraction Layer
 * Automatically switches between Ollama (preferred) and Gemini (fallback)
 */

export const translateQueryToEnglish = async (query: string): Promise<string> => {
  const isOllamaAvailable = await ollama.checkOllamaConnection();
  if (isOllamaAvailable) {
    return ollama.translateQueryToEnglish(query);
  }
  console.log('Ollama unavailable, switching to Gemini for translateQueryToEnglish');
  return gemini.translateQueryToEnglish(query);
};

export const translateTitlesToRussian = async (titles: string[]): Promise<string[]> => {
  const isOllamaAvailable = await ollama.checkOllamaConnection();
  if (isOllamaAvailable) {
    return ollama.translateTitlesToRussian(titles);
  }
  console.log('Ollama unavailable, switching to Gemini for translateTitlesToRussian');
  return gemini.translateTitlesToRussian(titles);
};

export const summarizeArticleForLayperson = async (title: string, abstract: string): Promise<string> => {
  const isOllamaAvailable = await ollama.checkOllamaConnection();
  if (isOllamaAvailable) {
    return ollama.summarizeArticleForLayperson(title, abstract);
  }
  console.log('Ollama unavailable, switching to Gemini for summarizeArticleForLayperson');
  return gemini.summarizeArticleForLayperson(title, abstract);
};

export const optimizeQueryForPubMed = async (longQuery: string): Promise<string> => {
  const isOllamaAvailable = await ollama.checkOllamaConnection();
  if (isOllamaAvailable) {
    return ollama.optimizeQueryForPubMed(longQuery);
  }
  console.log('Ollama unavailable, switching to Gemini for optimizeQueryForPubMed');
  return gemini.optimizeQueryForPubMed(longQuery);
};
