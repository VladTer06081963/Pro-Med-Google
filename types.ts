export interface PubMedArticle {
  id: string;
  title: string;
  titleTranslated?: string;
  authors: string[];
  journal: string;
  year: string;
  abstract: string;
  url: string;
}

export interface SearchState {
  query: string;
  results: PubMedArticle[];
  loading: boolean;
  error: string | null;
  count: number;
}

export interface SummaryState {
  articleId: string | null;
  content: string;
  loading: boolean;
  error: string | null;
}

export interface PubMedConfig {
  apiKey?: string;
}