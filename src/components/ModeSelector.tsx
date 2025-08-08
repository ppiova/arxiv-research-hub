import { Button } from '@/components/ui/button';
import { Clock, TrendingUp } from '@phosphor-icons/react';
import { SortMode } from '@/lib/types';

interface ModeSelectorProps {
  mode: SortMode;
  onModeChange: (mode: SortMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={mode === 'latest' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('latest')}
        className="gap-2 text-xs"
      >
        <Clock size={14} />
        Últimos enviados
      </Button>
      <Button
        variant={mode === 'relevance' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('relevance')}
        className="gap-2 text-xs"
      >
        <TrendingUp size={14} />
        Top por relevancia
      </Button>
    </div>
  );
}