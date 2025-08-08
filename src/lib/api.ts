import { ArxivPaper, PapersResponse, APIError, QueryParams } from './types';
import { buildArxivQuery, getCacheKey } from './queryBuilder';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const DEFAULT_PAGE_SIZE = 20;

interface CacheEntry {
  data: PapersResponse;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function isValidCache(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

function parseArxivFeed(xmlText: string): ArxivPaper[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const entries = xmlDoc.querySelectorAll('entry');
  const papers: ArxivPaper[] = [];

  entries.forEach((entry) => {
    try {
      const id = entry.querySelector('id')?.textContent?.trim() || '';
      const title = entry.querySelector('title')?.textContent?.trim() || '';
      const summary = entry.querySelector('summary')?.textContent?.trim() || '';
      const published = entry.querySelector('published')?.textContent?.trim() || '';
      
      const authors: string[] = [];
      entry.querySelectorAll('author name').forEach((author) => {
        const name = author.textContent?.trim();
        if (name) authors.push(name);
      });

      const categories: string[] = [];
      entry.querySelectorAll('category').forEach((cat) => {
        const term = cat.getAttribute('term');
        if (term) categories.push(term);
      });

      const links = { abs: '', pdf: '' };
      entry.querySelectorAll('link').forEach((link) => {
        const href = link.getAttribute('href') || '';
        const title = link.getAttribute('title') || '';
        
        if (title === 'pdf') {
          links.pdf = href;
        } else if (href.includes('/abs/')) {
          links.abs = href;
        }
      });

      if (!links.abs && id) {
        links.abs = id.replace('/api/', '/abs/');
      }
      if (!links.pdf && links.abs) {
        links.pdf = links.abs.replace('/abs/', '/pdf/') + '.pdf';
      }

      if (title && summary && authors.length > 0) {
        papers.push({
          id,
          title,
          summary,
          authors,
          published,
          categories,
          links
        });
      }
    } catch (error) {
      console.warn('Failed to parse entry:', error);
    }
  });

  return papers;
}

export async function fetchPapers(params: QueryParams): Promise<PapersResponse> {
  const cacheKey = getCacheKey(params);
  const cached = cache.get(cacheKey);
  
  if (cached && isValidCache(cached)) {
    return cached.data;
  }

  try {
    const arxivUrl = buildArxivQuery(params);

    const response = await fetch(arxivUrl, {
      headers: {
        'User-Agent': 'ArxivPaperApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`ArXiv API returned ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const papers = parseArxivFeed(xmlText);

    const totalResultsMatch = xmlText.match(/<opensearch:totalResults[^>]*>(\d+)<\/opensearch:totalResults>/);
    const totalResults = totalResultsMatch ? parseInt(totalResultsMatch[1]) : papers.length;

    const result: PapersResponse = {
      papers,
      totalResults
    };

    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    const apiError: APIError = {
      message: error instanceof Error ? error.message : 'Network error occurred. Please check your connection and try again.',
      status: error instanceof Error && 'status' in error ? (error as any).status : undefined
    };
    throw apiError;
  }
}

// Legacy wrapper for backward compatibility
export async function fetchPapersLegacy(
  topic?: string,
  search?: string,
  start: number = 0
): Promise<PapersResponse> {
  return fetchPapers({
    topic: topic as any,
    search,
    page: Math.floor(start / DEFAULT_PAGE_SIZE),
    pageSize: DEFAULT_PAGE_SIZE
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return 'Unknown authors';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  if (authors.length <= 4) return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
  return `${authors.slice(0, 3).join(', ')}, and ${authors.length - 3} others`;
}

export function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'cs.AI': 'AI',
    'cs.CL': 'NLP',
    'cs.CV': 'Computer Vision',
    'cs.LG': 'Machine Learning',
    'cs.RO': 'Robotics',
    'cs.IR': 'Information Retrieval',
    'cs.MM': 'Multimedia',
    'cs.SD': 'Sound',
    'cs.CY': 'Security',
    'cs.DC': 'Distributed Computing',
    'cs.DB': 'Databases',
    'cs.GR': 'Graphics',
    'cs.PF': 'Performance',
    'stat.ML': 'Statistics ML',
    'eess.AS': 'Audio Signal Processing'
  };
  
  return categoryMap[category] || category;
}