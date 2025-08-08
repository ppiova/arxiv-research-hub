# API Documentation

This document provides detailed information about the arXiv Research Hub's API layer and data structures.

## Overview

The application integrates directly with the [arXiv API](https://arxiv.org/help/api) to fetch research papers. All API interactions are handled through the `/src/lib/api.ts` module, which provides caching, error handling, and data transformation.

## Core API Functions

### `fetchPapers(params: QueryParams): Promise<PapersResponse>`

Main function for fetching papers from arXiv with caching support.

**Parameters:**
```typescript
interface QueryParams {
  topic?: TopicKey;        // Research topic filter
  search?: string;         // Search query string
  page?: number;          // Page number (0-based)
  pageSize?: number;      // Results per page (default: 20)
}
```

**Returns:**
```typescript
interface PapersResponse {
  papers: ArxivPaper[];   // Array of paper objects
  totalResults: number;   // Total available results
}
```

**Example Usage:**
```typescript
// Fetch LLM papers, page 0
const response = await fetchPapers({
  topic: 'llm-nlp',
  page: 0
});

// Search for specific papers
const searchResults = await fetchPapers({
  search: 'transformer attention',
  page: 0
});
```

### `fetchPapersLegacy(topic?, search?, start?): Promise<PapersResponse>`

Legacy compatibility wrapper for the main fetch function.

**Parameters:**
- `topic?: string` - Topic identifier
- `search?: string` - Search query
- `start?: number` - Starting index (converted to page number)

## Data Structures

### ArxivPaper

Represents a single research paper with all relevant metadata.

```typescript
interface ArxivPaper {
  id: string;              // arXiv paper ID
  title: string;           // Paper title
  summary: string;         // Abstract/summary
  authors: string[];       // List of author names
  published: string;       // Publication date (ISO string)
  categories: string[];    // arXiv categories (e.g., 'cs.CL', 'cs.AI')
  links: {
    abs: string;          // Abstract page URL
    pdf: string;          // PDF download URL  
    html: string;         // HTML view URL
  };
}
```

### Research Topics

The application supports 8 predefined research domains:

```typescript
type TopicKey = 
  | 'llm-nlp'          // Large Language Models & NLP
  | 'computer-vision'  // Computer Vision
  | 'multimodal'       // Multimodal AI
  | 'robotics-rl'      // Robotics & Reinforcement Learning
  | 'ir-rag'           // Information Retrieval & RAG
  | 'speech-audio'     // Speech & Audio Processing
  | 'safety-evals'     // AI Safety & Evaluations
  | 'ml-systems';      // ML Systems
```

Each topic maps to specific arXiv categories:

```typescript
const TOPICS: Record<TopicKey, { label: string; category: string }> = {
  'llm-nlp': { label: 'LLMs & NLP', category: 'cs.CL' },
  'computer-vision': { label: 'Computer Vision', category: 'cs.CV' },
  // ... etc
}
```

## Query Building

### `buildArxivQuery(params: QueryParams): string`

Constructs arXiv API query URLs with proper parameter encoding.

**Query Construction Logic:**
- **Topic queries**: `cat:cs.CL` (category-based)
- **Search queries**: `all:transformer attention` (full-text search)
- **Sorting**: By submission date, descending
- **Pagination**: Uses `start` and `max_results` parameters

**Example URLs:**
```
// Topic query
http://export.arxiv.org/api/query?search_query=cat:cs.CL&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending

// Search query  
http://export.arxiv.org/api/query?search_query=all:transformer&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending
```

### `getCacheKey(params: QueryParams): string`

Generates unique cache keys for query parameters.

**Format:** `{topic}-{search}-{page}`

**Examples:**
- `llm-nlp--0` (LLM topic, page 0)
- `-transformer attention-0` (search query, page 0)

## Caching Strategy

### Cache Implementation

- **Storage**: In-memory Map with timestamp-based entries
- **Duration**: 10 minutes (600,000ms)
- **Key Generation**: Based on query parameters
- **Validation**: Automatic expiry checking

```typescript
interface CacheEntry {
  data: PapersResponse;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
```

### Cache Behavior

1. **Cache Hit**: Returns cached data if valid (< 10 minutes old)
2. **Cache Miss**: Makes API request, stores result, returns data
3. **Cache Expiry**: Automatic cleanup on next access

## Data Processing

### XML Parsing

arXiv API returns Atom XML which is parsed using the browser's DOMParser:

```typescript
function parseArxivFeed(xmlText: string): ArxivPaper[]
```

**Extraction Process:**
1. Parse XML response using DOMParser
2. Query for `<entry>` elements
3. Extract metadata from each entry:
   - Title from `<title>`
   - Summary from `<summary>`
   - Authors from `<author><name>`
   - Categories from `<category term="">`
   - Links from `<link href="" title="">`
4. Construct paper objects with proper link URLs

### Link Construction

Paper links are intelligently constructed:
- **Abstract**: Direct from API or constructed from ID
- **PDF**: Replace `/abs/` with `/pdf/` + `.pdf`
- **HTML**: Replace `/abs/` with `/html/`

## Utility Functions

### Formatting Utilities

```typescript
// Date formatting
formatRelativeDate(dateString: string): string
// Returns: "Today", "2 days ago", "3 weeks ago", etc.

// Author list formatting  
formatAuthors(authors: string[]): string
// Returns: "Smith", "Smith and Jones", "Smith, Jones, and 2 others"

// Category formatting
formatCategory(category: string): string
// Returns: "NLP" for "cs.CL", "Computer Vision" for "cs.CV"
```

## Error Handling

### APIError Interface

```typescript
interface APIError {
  message: string;    // Human-readable error message
  status?: number;    // HTTP status code (if applicable)
}
```

### Error Scenarios

1. **Network Errors**: Connection failures, timeout
2. **API Errors**: arXiv service unavailable, rate limiting
3. **Parsing Errors**: Malformed XML responses
4. **Data Errors**: Missing required fields

### Error Recovery

- Graceful degradation for missing fields
- User-friendly error messages
- Retry mechanisms in UI layer
- Fallback values for incomplete data

## Rate Limiting & Best Practices

### arXiv API Limits

- **Rate Limit**: ~1 request per 3 seconds recommended
- **Bulk Requests**: Use larger `max_results` instead of many small requests
- **User Agent**: Always include descriptive User-Agent header

### Application Best Practices

1. **Caching**: 10-minute cache reduces API calls
2. **Pagination**: Load 20 results per page
3. **Debouncing**: Search queries should be debounced
4. **Error Handling**: Graceful fallbacks for API failures

## Testing the API

### Manual Testing

```typescript
// Test basic topic fetch
fetchPapers({ topic: 'llm-nlp', page: 0 })
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Test search functionality
fetchPapers({ search: 'neural networks', page: 0 })
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### Cache Testing

```typescript
// Check cache functionality
const key = getCacheKey({ topic: 'llm-nlp', page: 0 });
console.log('Cache key:', key);

// Verify cache expiration
setTimeout(() => {
  // Should trigger new API call after cache expires
  fetchPapers({ topic: 'llm-nlp', page: 0 });
}, 11 * 60 * 1000);
```