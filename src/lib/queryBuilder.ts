import { QueryParams, TOPICS } from './types';

/**
 * Formats a date to YYYYMMDD format required by arXiv
 */
export function formatDateForArxiv(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Gets date range for the last N days
 */
export function getDateRangeFromDays(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  
  return {
    from: formatDateForArxiv(from),
    to: formatDateForArxiv(to)
  };
}

/**
 * Builds arXiv query URL with all parameters
 */
export function buildArxivQuery(params: QueryParams): string {
  const {
    topic,
    mode = 'latest',
    search,
    keywords = [],
    from,
    to,
    page = 0,
    pageSize = 20
  } = params;

  let searchQuery = '';
  
  // Build category part
  if (search) {
    // Global search across all categories
    searchQuery = `all:${encodeURIComponent(search)}`;
  } else if (topic && topic in TOPICS) {
    const topicInfo = TOPICS[topic];
    searchQuery = `cat:${topicInfo.category}`;
  } else {
    // Default fallback
    searchQuery = 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV';
  }

  // Add date range if specified
  if (from && to) {
    searchQuery += `+AND+submittedDate:[${from}+TO+${to}]`;
  }

  // Add keywords if specified
  if (keywords.length > 0) {
    const keywordQuery = keywords
      .map(kw => `"${kw.replace(/"/g, '\\"')}"`)
      .join('+OR+');
    searchQuery += `+AND+all:(${keywordQuery})`;
  }

  const arxivUrl = new URL('http://export.arxiv.org/api/query');
  arxivUrl.searchParams.set('search_query', searchQuery);
  arxivUrl.searchParams.set('start', (page * pageSize).toString());
  arxivUrl.searchParams.set('max_results', pageSize.toString());
  
  if (mode === 'relevance') {
    arxivUrl.searchParams.set('sortBy', 'relevance');
  } else {
    arxivUrl.searchParams.set('sortBy', 'submittedDate');
  }
  arxivUrl.searchParams.set('sortOrder', 'descending');

  return arxivUrl.toString();
}

/**
 * Creates cache key for the query parameters
 */
export function getCacheKey(params: QueryParams): string {
  const {
    topic = '',
    mode = 'latest',
    search = '',
    keywords = [],
    from = '',
    to = '',
    page = 0
  } = params;
  
  return [
    topic,
    mode,
    search,
    keywords.join(','),
    from,
    to,
    page
  ].join('-');
}