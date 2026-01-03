import * as ollama from './ollama';
import * as gemini from './gemini';
import * as mistral from './mistral';

/**
 * AI Service Abstraction Layer
 * Uses manually selected AI provider
 */

type AIProvider = 'ollama' | 'gemini' | 'mistral';

/**
 * Get the selected AI provider from localStorage
 */
const getSelectedProvider = (): AIProvider => {
  const stored = localStorage.getItem('selectedAIProvider');
  return (stored as AIProvider) || 'ollama';
};

/**
 * Check if a provider is available
 */
const isProviderAvailable = async (provider: AIProvider): Promise<boolean> => {
  switch (provider) {
    case 'ollama':
      return await ollama.checkOllamaConnection();
    case 'gemini':
      return !!import.meta.env.VITE_API_KEY;
    case 'mistral':
      return !!import.meta.env.VITE_MISTRAL_API_KEY;
    default:
      return false;
  }
};

/**
 * Get user-friendly error message for unavailable provider
 */
const getUnavailableMessage = (provider: AIProvider): string => {
  switch (provider) {
    case 'ollama':
      return 'Ollama недоступен. Проверьте, запущен ли Ollama сервер.';
    case 'gemini':
      return 'Gemini недоступен. Проверьте API ключ или лимит запросов.';
    case 'mistral':
      return 'Mistral недоступен. Проверьте API ключ или лимит запросов.';
    default:
      return 'Выбранный AI-провайдер недоступен.';
  }
};

export const translateQueryToEnglish = async (query: string): Promise<string> => {
  const provider = getSelectedProvider();
  const available = await isProviderAvailable(provider);

  if (!available) {
    throw new Error(getUnavailableMessage(provider));
  }

  switch (provider) {
    case 'ollama':
      return ollama.translateQueryToEnglish(query);
    case 'gemini':
      return gemini.translateQueryToEnglish(query);
    case 'mistral':
      return mistral.translateQueryToEnglish(query);
    default:
      return query;
  }
};

export const translateTitlesToRussian = async (titles: string[]): Promise<string[]> => {
  const provider = getSelectedProvider();
  const available = await isProviderAvailable(provider);

  if (!available) {
    throw new Error(getUnavailableMessage(provider));
  }

  switch (provider) {
    case 'ollama':
      return ollama.translateTitlesToRussian(titles);
    case 'gemini':
      return gemini.translateTitlesToRussian(titles);
    case 'mistral':
      return mistral.translateTitlesToRussian(titles);
    default:
      return titles;
  }
};

export const summarizeArticleForLayperson = async (title: string, abstract: string): Promise<string> => {
  const provider = getSelectedProvider();
  const available = await isProviderAvailable(provider);

  if (!available) {
    return getUnavailableMessage(provider);
  }

  switch (provider) {
    case 'ollama':
      return ollama.summarizeArticleForLayperson(title, abstract);
    case 'gemini':
      return gemini.summarizeArticleForLayperson(title, abstract);
    case 'mistral':
      return mistral.summarizeArticleForLayperson(title, abstract);
    default:
      return 'AI-провайдер не выбран.';
  }
};

export const optimizeQueryForPubMed = async (longQuery: string): Promise<string> => {
  const provider = getSelectedProvider();
  const available = await isProviderAvailable(provider);

  if (!available) {
    throw new Error(getUnavailableMessage(provider));
  }

  switch (provider) {
    case 'ollama':
      return ollama.optimizeQueryForPubMed(longQuery);
    case 'gemini':
      return gemini.optimizeQueryForPubMed(longQuery);
    case 'mistral':
      return mistral.optimizeQueryForPubMed(longQuery);
    default:
      return longQuery;
  }
};
