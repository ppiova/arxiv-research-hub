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
  currentPage: number;
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
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    currentPage: 0
  });

  const loadPapers = async (append: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const page = append ? state.currentPage + 1 : 0;

      const response: PapersResponse = await fetchPapers({
        topic: state.currentTopic || undefined,
        search: state.searchQuery || undefined,
        page
      });
      
      setState(prev => ({
        ...prev,
        papers: append ? [...prev.papers, ...response.papers] : response.papers,
        totalResults: response.totalResults,
        loadedResults: (page + 1) * 20,
        loading: false,
        currentPage: page
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
      setState(prev => ({
        ...prev,
        currentTopic: topicKey,
        searchQuery: '',
        currentPage: 0
      }));
    }
  };

  const handleSearch = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      currentTopic: query ? null : prev.currentTopic,
      currentPage: 0
    }));
  };

  const handleLoadMore = () => {
    loadPapers(true);
  };

  const handleRetry = () => {
    loadPapers(false);
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    setState(prev => ({ ...prev, currentTopic: 'llm-nlp' }));
  }, []);

  useEffect(() => {
    if (state.currentTopic || state.searchQuery) {
      loadPapers(false);
    }
  }, [
    state.currentTopic,
    state.searchQuery
  ]);

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

          <div className="space-y-4">
            <div className="flex justify-center">
              <SearchBar 
                onSearch={handleSearch}
                isLoading={state.loading}
                placeholder="Search papers by keyword..."
              />
            </div>
          </div>

          {isSearchMode && (
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 px-4 py-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Searching: <span className="font-medium text-foreground">"{state.searchQuery}"</span>
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
                    ? "Try different keywords or browse by topic."
                    : "No papers available for this topic at the moment."
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
                          Load more papers
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
          <p className="flex flex-wrap items-center justify-center gap-2">
            <span>
              Powered by{' '}
              <a
                href="https://arxiv.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                arXiv.org
              </a>
            </span>
            <span className="text-muted-foreground">|</span>
            <span>Pablito Piova</span>
            <span className="text-muted-foreground">|</span>
            <a
              href="https://www.linkedin.com/in/ppiova/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              aria-label="Pablito Piova on LinkedIn"
            >
              LinkedIn
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;