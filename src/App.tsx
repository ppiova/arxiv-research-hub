import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArxivPaper, PapersResponse, APIError, TOPICS, TopicKey, SortMode, DateRange } from '@/lib/types';
import { fetchPapers } from '@/lib/api';
import { getDateRangeFromDays } from '@/lib/queryBuilder';
import { PaperCard } from '@/components/PaperCard';
import { PaperGridSkeleton } from '@/components/PaperCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { ErrorState, EmptyState } from '@/components/ErrorState';
import { ModeSelector } from '@/components/ModeSelector';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { KeywordsSelector } from '@/components/KeywordsSelector';
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
  mode: SortMode;
  selectedDateRange: DateRange | null;
  customDateRange: { from: string; to: string } | null;
  selectedKeywords: string[];
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
    mode: 'latest',
    selectedDateRange: null,
    customDateRange: null,
    selectedKeywords: [],
    currentPage: 0
  });

  const loadPapers = async (append: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const page = append ? state.currentPage + 1 : 0;
      
      // Build date range
      let dateRange: { from?: string; to?: string } = {};
      if (state.mode === 'relevance') {
        if (state.customDateRange) {
          dateRange = state.customDateRange;
        } else if (state.selectedDateRange) {
          const range = getDateRangeFromDays(state.selectedDateRange.days);
          dateRange = range;
        }
      }

      const response: PapersResponse = await fetchPapers({
        topic: state.currentTopic || undefined,
        mode: state.mode,
        search: state.searchQuery || undefined,
        keywords: state.selectedKeywords.length > 0 ? state.selectedKeywords : undefined,
        from: dateRange.from,
        to: dateRange.to,
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
        selectedKeywords: [],
        currentPage: 0
      }));
    }
  };

  const handleSearch = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      currentTopic: query ? null : prev.currentTopic,
      selectedKeywords: [],
      currentPage: 0
    }));
  };

  const handleModeChange = (mode: SortMode) => {
    setState(prev => ({
      ...prev,
      mode,
      currentPage: 0,
      // Set default date range for relevance mode
      selectedDateRange: mode === 'relevance' && !prev.selectedDateRange 
        ? { label: '14 días', days: 14 } 
        : prev.selectedDateRange
    }));
  };

  const handleDateRangeChange = (range: DateRange | null, customRange: { from: string; to: string } | null) => {
    setState(prev => ({
      ...prev,
      selectedDateRange: range,
      customDateRange: customRange,
      currentPage: 0
    }));
  };

  const handleKeywordsChange = (keywords: string[]) => {
    setState(prev => ({
      ...prev,
      selectedKeywords: keywords,
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
    if (state.currentTopic || state.searchQuery || state.mode === 'relevance') {
      loadPapers(false);
    }
  }, [
    state.currentTopic,
    state.searchQuery,
    state.mode,
    state.selectedDateRange,
    state.customDateRange,
    state.selectedKeywords
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
  const isRelevanceMode = state.mode === 'relevance';

  // Get current date range label
  const getCurrentRangeLabel = () => {
    if (state.customDateRange) {
      return `${state.customDateRange.from} - ${state.customDateRange.to}`;
    }
    if (state.selectedDateRange) {
      return state.selectedDateRange.label;
    }
    return isRelevanceMode ? '14 días' : '';
  };

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

            <div className="flex justify-center">
              <ModeSelector 
                mode={state.mode}
                onModeChange={handleModeChange}
              />
            </div>

            {isRelevanceMode && (
              <div className="space-y-3">
                <DateRangeSelector
                  selectedRange={state.selectedDateRange}
                  customRange={state.customDateRange}
                  onRangeChange={handleDateRangeChange}
                />
                
                <KeywordsSelector
                  topic={state.currentTopic}
                  selectedKeywords={state.selectedKeywords}
                  onKeywordsChange={handleKeywordsChange}
                />
              </div>
            )}
          </div>

          {(isSearchMode || isRelevanceMode) && (
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 px-4 py-3 bg-muted rounded-lg">
              {isSearchMode && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Buscando: <span className="font-medium text-foreground">"{state.searchQuery}"</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch('')}
                    className="gap-1 h-6 px-2 text-xs"
                  >
                    <X size={12} />
                    Limpiar
                  </Button>
                </div>
              )}
              
              {isRelevanceMode && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Ordenado por <span className="font-medium text-foreground">relevancia (arXiv)</span>
                  </span>
                  {getCurrentRangeLabel() && (
                    <span className="text-muted-foreground">
                      Período: <span className="font-medium text-foreground">{getCurrentRangeLabel()}</span>
                    </span>
                  )}
                  {state.totalResults > 0 && (
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{state.totalResults}</span> resultados
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </header>

        <main>
          {!isSearchMode && !isRelevanceMode && (
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
                    ? "Prueba con diferentes palabras clave o navega por tema."
                    : "No hay papers disponibles para este tema en este momento."
                }
                action={
                  isSearchMode
                    ? {
                        label: "Limpiar búsqueda",
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
                        'Cargando...'
                      ) : (
                        <>
                          <ArrowDown size={16} />
                          Cargar más papers
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