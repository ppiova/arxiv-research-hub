import { ArxivPaper, PapersResponse, TOPICS } from '@/lib/types';

interface CacheEntry {
  data: PapersResponse;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const MAX_RESULTS = 20;

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

function getCacheKey(topic?: string, search?: string, start?: number): string {
  return `${topic || 'all'}-${search || ''}-${start || 0}`;
}

function isValidCache(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic');
    const search = url.searchParams.get('search');
    const start = parseInt(url.searchParams.get('start') || '0');

    const cacheKey = getCacheKey(topic, search, start);
    const cached = cache.get(cacheKey);
    
    if (cached && isValidCache(cached)) {
      return Response.json(cached.data);
    }

    let searchQuery = '';
    
    if (search) {
      searchQuery = `all:${encodeURIComponent(search)}`;
    } else if (topic && topic in TOPICS) {
      searchQuery = TOPICS[topic as keyof typeof TOPICS].query;
    } else {
      searchQuery = 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV';
    }

    const arxivUrl = new URL('http://export.arxiv.org/api/query');
    arxivUrl.searchParams.set('search_query', searchQuery);
    arxivUrl.searchParams.set('start', start.toString());
    arxivUrl.searchParams.set('max_results', MAX_RESULTS.toString());
    arxivUrl.searchParams.set('sortBy', 'submittedDate');
    arxivUrl.searchParams.set('sortOrder', 'descending');

    const response = await fetch(arxivUrl.toString(), {
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

    return Response.json(result);
  } catch (error) {
    console.error('API Error:', error);
    
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}