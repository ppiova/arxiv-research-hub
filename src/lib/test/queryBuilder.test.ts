import { buildArxivQuery, formatDateForArxiv, getDateRangeFromDays } from '../queryBuilder';
import { QueryParams } from '../types';

// Test helper
function testQuery(description: string, params: QueryParams, expectedSubstrings: string[]) {
  console.log(`\n🧪 Test: ${description}`);
  const result = buildArxivQuery(params);
  console.log(`URL: ${result}`);
  
  let allPassed = true;
  expectedSubstrings.forEach(expected => {
    if (result.includes(expected)) {
      console.log(`✅ Contains: ${expected}`);
    } else {
      console.log(`❌ Missing: ${expected}`);
      allPassed = false;
    }
  });
  
  return allPassed;
}

// Run tests
export function runQueryBuilderTests() {
  console.log('🚀 Running Query Builder Tests...');
  
  // Test 1: Basic topic query with latest mode
  testQuery('Basic topic query (latest mode)', {
    topic: 'llm-nlp',
    mode: 'latest'
  }, [
    'cat:cs.CL',
    'sortBy=submittedDate',
    'sortOrder=descending'
  ]);

  // Test 2: Relevance mode with date range
  testQuery('Relevance mode with date range', {
    topic: 'computer-vision',
    mode: 'relevance',
    from: '20240101',
    to: '20240131'
  }, [
    'cat:cs.CV',
    'submittedDate:[20240101+TO+20240131]',
    'sortBy=relevance',
    'sortOrder=descending'
  ]);

  // Test 3: Keywords and relevance mode
  testQuery('Keywords with relevance mode', {
    topic: 'llm-nlp',
    mode: 'relevance',
    keywords: ['transformer', 'attention'],
    from: '20240101',
    to: '20240131'
  }, [
    'cat:cs.CL',
    'submittedDate:[20240101+TO+20240131]',
    'all:("transformer"+OR+"attention")',
    'sortBy=relevance'
  ]);

  console.log('\n✨ Tests completed!');
}

// Test date formatting
export function testDateFormatting() {
  console.log('\n📅 Testing date formatting...');
  
  const testDate = new Date('2024-01-15');
  const formatted = formatDateForArxiv(testDate);
  console.log(`Date ${testDate.toISOString()} -> ${formatted}`);
  
  const range = getDateRangeFromDays(7);
  console.log(`Last 7 days range: ${range.from} to ${range.to}`);
}