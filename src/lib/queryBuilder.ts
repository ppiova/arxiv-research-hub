import { QueryParams, TOPICS } from './types';

/**
 * Builds arXiv query URL with all parameters
 */
export function buildArxivQuery(params: QueryParams): string {
  const {
    topic,
    search,
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

  const arxivUrl = new URL('http://export.arxiv.org/api/query');
  arxivUrl.searchParams.set('search_query', searchQuery);
  arxivUrl.searchParams.set('start', (page * pageSize).toString());
  arxivUrl.searchParams.set('max_results', pageSize.toString());
  arxivUrl.searchParams.set('sortBy', 'submittedDate');
  arxivUrl.searchParams.set('sortOrder', 'descending');

  return arxivUrl.toString();
}

/**
 * Creates cache key for the query parameters
 */
export function getCacheKey(params: QueryParams): string {
  const {
    topic = '',
    search = '',
    page = 0
  } = params;
  
  return [
    topic,
    search,
    page
  ].join('-');
}