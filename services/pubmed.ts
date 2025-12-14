import { PubMedArticle } from '../types';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

/**
 * Helper to get text content from an XML element safely
 */
const getXmlText = (element: Element | null, selector: string): string => {
  if (!element) return '';
  const node = element.querySelector(selector);
  return node ? node.textContent || '' : '';
};

/**
 * Helper to get all text from potentially fragmented AbstractText tags
 */
const getAbstractText = (element: Element | null): string => {
  if (!element) return '';
  const abstractNode = element.querySelector('Abstract');
  if (!abstractNode) return '';
  
  // Sometimes AbstractText has labels (e.g. BACKGROUND, METHODS)
  const texts = abstractNode.querySelectorAll('AbstractText');
  if (texts.length === 0) return '';
  
  return Array.from(texts).map(textNode => {
    const label = textNode.getAttribute('Label');
    const content = textNode.textContent || '';
    return label ? `**${label}**: ${content}` : content;
  }).join('\n\n');
};

export const searchPubMedArticles = async (
  query: string,
  count: number = 5,
  apiKey?: string
): Promise<PubMedArticle[]> => {
  try {
    // 1. ESearch: Get IDs
    let searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${count}&retmode=json`;
    if (apiKey) searchUrl += `&api_key=${apiKey}`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error('PubMed Search failed');
    const searchData = await searchRes.json();
    
    const ids = searchData.esearchresult?.idlist || [];
    
    if (ids.length === 0) return [];

    // 2. EFetch: Get Details (using XML to get full abstract reliably)
    // We use post if there are many IDs, but for small counts GET is fine.
    let fetchUrl = `${BASE_URL}/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`;
    if (apiKey) fetchUrl += `&api_key=${apiKey}`;

    const fetchRes = await fetch(fetchUrl);
    if (!fetchRes.ok) throw new Error('PubMed Fetch Details failed');
    const textData = await fetchRes.text();

    // 3. Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(textData, "text/xml");
    const articlesXml = xmlDoc.querySelectorAll('PubmedArticle');

    const articles: PubMedArticle[] = Array.from(articlesXml).map(articleEl => {
      const medline = articleEl.querySelector('MedlineCitation');
      const articleData = medline?.querySelector('Article');
      
      const id = getXmlText(medline, 'PMID');
      const title = getXmlText(articleData, 'ArticleTitle');
      const abstract = getAbstractText(articleData);
      
      // Authors
      const authorList = articleData?.querySelectorAll('Author');
      const authors = authorList ? Array.from(authorList).map(a => {
        const last = getXmlText(a, 'LastName');
        const initials = getXmlText(a, 'Initials');
        return `${last} ${initials}`;
      }).slice(0, 3) : []; // Limit to first 3 for display
      
      // Journal Info
      const journalTitle = getXmlText(articleData, 'Journal > Title');
      const year = getXmlText(articleData, 'Journal > JournalIssue > PubDate > Year') || 
                   getXmlText(articleData, 'Journal > JournalIssue > PubDate > MedlineDate'); // Fallback

      return {
        id,
        title,
        titleTranslated: '', // Will be filled later by AI
        authors,
        journal: journalTitle,
        year: year || 'N/A',
        abstract,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
      };
    });

    return articles;

  } catch (error) {
    console.error("Error fetching PubMed data:", error);
    throw error;
  }
};