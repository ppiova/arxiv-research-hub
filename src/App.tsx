import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArxivPaper, PapersResponse, APIError, TOPICS, TopicKey } from '@/lib/types';
import { fetchPapers } from '@/lib/api';
import { PaperCard } from '@/components/PaperCard';
import { PaperGridSkeleton } from '@/components/PaperCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { ErrorState, EmptyState } from '@/components/ErrorState';
import { Moon, Sun, ArrowDown, X } from '@phosphor-icons/react';

interface AppState {
  papers: ArxivPaper[];
  loading: boolean;
  error: string | null;
  currentTopic: TopicKey | null;
  searchQuery: string;
  totalResults: number;
  loadedResults: number;
  darkMode: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    papers: [],
    loading: false,
    error: null,
    currentTopic: 'llm-nlp',
    searchQuery: '',
    totalResults: 0,
    loadedResults: 0,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
  });

  const loadPapers = async (topic?: TopicKey, search?: string, append: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const start = append ? state.loadedResults : 0;
      const response: PapersResponse = await fetchPapers(topic, search, start);
      
      setState(prev => ({
        ...prev,
        papers: append ? [...prev.papers, ...response.papers] : response.papers,
        totalResults: response.totalResults,
        loadedResults: start + response.papers.length,
        loading: false,
        currentTopic: topic || null,
        searchQuery: search || ''
      }));
    } catch (error) {
      const apiError = error as APIError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message
      }));
    }
  };

  const handleTopicChange = (topic: string) => {
    const topicKey = topic as TopicKey;
    if (topicKey !== state.currentTopic) {
      loadPapers(topicKey);
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      loadPapers(undefined, query);
    } else {
      loadPapers(state.currentTopic || 'llm-nlp');
    }
  };

  const handleLoadMore = () => {
    if (state.searchQuery) {
      loadPapers(undefined, state.searchQuery, true);
    } else {
      loadPapers(state.currentTopic || 'llm-nlp', undefined, true);
    }
  };

  const handleRetry = () => {
    if (state.searchQuery) {
      loadPapers(undefined, state.searchQuery);
    } else {
      loadPapers(state.currentTopic || 'llm-nlp');
    }
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    loadPapers('llm-nlp');
  }, []);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const hasMoreResults = state.loadedResults < state.totalResults;
  const isSearchMode = Boolean(state.searchQuery);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                arXiv Research Discovery
              </h1>
              <p className="text-muted-foreground">
                Discover the latest research papers from arXiv
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="gap-2"
            >
              {state.darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {state.darkMode ? 'Light' : 'Dark'}
            </Button>
          </div>

          <div className="flex justify-center mb-6">
            <SearchBar 
              onSearch={handleSearch}
              isLoading={state.loading}
              placeholder="Search papers by keyword..."
            />
          </div>

          {isSearchMode && (
            <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                Searching for: <span className="font-medium text-foreground">"{state.searchQuery}"</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearch('')}
                className="gap-1 h-6 px-2 text-xs"
              >
                <X size={12} />
                Clear
              </Button>
            </div>
          )}
        </header>

        <main>
          {!isSearchMode && (
            <Tabs 
              value={state.currentTopic || 'llm-nlp'} 
              onValueChange={handleTopicChange}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
                {Object.entries(TOPICS).map(([key, { label }]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          <div className="space-y-6">
            {state.error ? (
              <ErrorState
                message={state.error}
                onRetry={handleRetry}
              />
            ) : state.loading && state.papers.length === 0 ? (
              <PaperGridSkeleton count={6} />
            ) : state.papers.length === 0 ? (
              <EmptyState
                title="No papers found"
                description={
                  isSearchMode
                    ? "Try different keywords or browse by topic instead."
                    : "No papers available for this topic right now."
                }
                action={
                  isSearchMode
                    ? {
                        label: "Clear search",
                        onClick: () => handleSearch('')
                      }
                    : undefined
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.papers.map((paper) => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </div>

                {hasMoreResults && (
                  <div className="flex justify-center pt-8">
                    <Button
                      onClick={handleLoadMore}
                      disabled={state.loading}
                      variant="outline"
                      className="gap-2"
                    >
                      {state.loading ? (
                        'Loading...'
                      ) : (
                        <>
                          <ArrowDown size={16} />
                          Load More Papers
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {state.loading && state.papers.length > 0 && (
                  <div className="mt-6">
                    <PaperGridSkeleton count={3} />
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>
            Powered by{' '}
            <a
              href="https://arxiv.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              arXiv.org
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;