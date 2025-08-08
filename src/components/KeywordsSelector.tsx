import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from '@phosphor-icons/react';
import { TOPICS, TopicKey } from '@/lib/types';

interface KeywordsSelectorProps {
  topic: TopicKey | null;
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

export function KeywordsSelector({ topic, selectedKeywords, onKeywordsChange }: KeywordsSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customKeyword, setCustomKeyword] = useState('');

  const suggestedKeywords = topic && topic in TOPICS ? TOPICS[topic].keywords : [];

  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      onKeywordsChange(selectedKeywords.filter(k => k !== keyword));
    } else {
      onKeywordsChange([...selectedKeywords, keyword]);
    }
  };

  const addCustomKeyword = () => {
    if (customKeyword.trim() && !selectedKeywords.includes(customKeyword.trim())) {
      onKeywordsChange([...selectedKeywords, customKeyword.trim()]);
      setCustomKeyword('');
      setShowCustomInput(false);
    }
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(selectedKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="space-y-3">
      {/* Selected keywords */}
      {selectedKeywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground mr-2">Filtros activos:</span>
          {selectedKeywords.map((keyword) => (
            <Button
              key={keyword}
              variant="secondary"
              size="sm"
              onClick={() => removeKeyword(keyword)}
              className="gap-1 text-xs h-6 px-2"
            >
              {keyword}
              <X size={10} />
            </Button>
          ))}
        </div>
      )}

      {/* Suggested keywords */}
      {suggestedKeywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground">Sugeridos:</span>
          {suggestedKeywords.map((keyword) => (
            <Button
              key={keyword}
              variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleKeyword(keyword)}
              className="text-xs h-6 px-2"
            >
              {keyword}
            </Button>
          ))}
        </div>
      )}

      {/* Custom keyword input */}
      <div className="flex items-center gap-2">
        {!showCustomInput ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(true)}
            className="gap-1 text-xs"
          >
            <Plus size={12} />
            Agregar palabra clave
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomKeyword()}
              placeholder="Escribe una palabra clave..."
              className="text-xs border rounded px-2 py-1 bg-background min-w-[150px]"
              autoFocus
            />
            <Button
              size="sm"
              onClick={addCustomKeyword}
              disabled={!customKeyword.trim()}
              className="text-xs"
            >
              Agregar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCustomInput(false);
                setCustomKeyword('');
              }}
              className="text-xs"
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}