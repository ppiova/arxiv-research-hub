/**
 * @fileoverview API integration layer for arXiv research papers
 * 
 * This module provides the core API functionality for fetching and parsing
 * research papers from the arXiv API. It includes caching, error handling,
 * and data transformation utilities.
 * 
 * @author arXiv Research Hub Team
 * @version 1.0.0
 */

import { ArxivPaper, PapersResponse, APIError, QueryParams } from './types';
import { buildArxivQuery, getCacheKey } from './queryBuilder';

/** Cache duration in milliseconds (10 minutes) */
const CACHE_DURATION = 10 * 60 * 1000;

/** Default number of papers to fetch per page */
const DEFAULT_PAGE_SIZE = 20;

/**
 * Cache entry structure for storing API responses
 * @interface CacheEntry
 */
interface CacheEntry {
  /** The cached API response data */
  data: PapersResponse;
  /** Timestamp when the data was cached */
  timestamp: number;
}

/** In-memory cache for API responses */
const cache = new Map<string, CacheEntry>();

/**
 * Checks if a cache entry is still valid based on its timestamp
 * @param entry - The cache entry to validate
 * @returns True if the cache entry is still valid, false otherwise
 */
function isValidCache(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

/**
 * Parses arXiv API XML response and converts it to ArxivPaper objects
 * 
 * The arXiv API returns data in Atom XML format. This function extracts
 * relevant paper information including title, authors, abstract, categories,
 * and generates appropriate links for PDF and abstract viewing.
 * 
 * @param xmlText - Raw XML response from arXiv API
 * @returns Array of parsed ArxivPaper objects
 * @throws Error if XML parsing fails
 * 
 * @example
 * ```typescript
 * const xmlResponse = await fetch('http://export.arxiv.org/api/query?...');
 * const xmlText = await xmlResponse.text();
 * const papers = parseArxivFeed(xmlText);
 * ```
 */
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

      const links = { abs: '', pdf: '', html: '' };
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
      if (!links.html && links.abs) {
        links.html = links.abs.replace('/abs/', '/html/');
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

/**
 * Main function for fetching research papers from arXiv API
 * 
 * This function handles the complete lifecycle of fetching papers:
 * 1. Checks local cache for existing data
 * 2. Builds appropriate arXiv query URL
 * 3. Fetches data from arXiv API if cache miss
 * 4. Parses XML response into structured data
 * 5. Updates cache with new results
 * 
 * @param params - Query parameters for fetching papers
 * @param params.topic - Research topic filter (optional)
 * @param params.search - Search query string (optional)
 * @param params.page - Page number for pagination (default: 0)
 * @param params.pageSize - Number of results per page (default: 20)
 * 
 * @returns Promise resolving to papers response with metadata
 * @throws APIError if the request fails or parsing errors occur
 * 
 * @example
 * ```typescript
 * // Fetch papers by topic
 * const response = await fetchPapers({ topic: 'llm-nlp', page: 0 });
 * 
 * // Search for specific papers
 * const searchResults = await fetchPapers({ 
 *   search: 'transformer attention', 
 *   page: 0 
 * });
 * ```
 */
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