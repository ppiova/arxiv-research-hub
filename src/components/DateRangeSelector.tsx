import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@phosphor-icons/react';
import { DateRange, DATE_RANGES } from '@/lib/types';
import { getDateRangeFromDays } from '@/lib/queryBuilder';

interface DateRangeSelectorProps {
  selectedRange: DateRange | null;
  customRange: { from: string; to: string } | null;
  onRangeChange: (range: DateRange | null, customRange: { from: string; to: string } | null) => void;
}

export function DateRangeSelector({ selectedRange, customRange, onRangeChange }: DateRangeSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(customRange?.from || '');
  const [customTo, setCustomTo] = useState(customRange?.to || '');

  const handlePresetSelect = (range: DateRange) => {
    setShowCustom(false);
    onRangeChange(range, null);
  };

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      const from = customFrom.replace(/-/g, '');
      const to = customTo.replace(/-/g, '');
      onRangeChange(null, { from, to });
      setShowCustom(false);
    }
  };

  const formatDateForInput = (dateStr: string): string => {
    if (dateStr.length === 8) {
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    return dateStr;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Ventana:</span>
      
      {DATE_RANGES.map((range) => (
        <Button
          key={range.days}
          variant={selectedRange?.days === range.days ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetSelect(range)}
          className="text-xs"
        >
          {range.label}
        </Button>
      ))}
      
      <Button
        variant={customRange ? "default" : "outline"}
        size="sm"
        onClick={() => setShowCustom(!showCustom)}
        className="gap-1 text-xs"
      >
        <Calendar size={12} />
        Personalizado
      </Button>

      {showCustom && (
        <div className="flex items-center gap-2 ml-2 p-2 border rounded-lg bg-card">
          <span className="text-xs">Desde:</span>
          <input
            type="date"
            value={formatDateForInput(customFrom)}
            onChange={(e) => setCustomFrom(e.target.value.replace(/-/g, ''))}
            className="text-xs border rounded px-2 py-1 bg-background"
          />
          <span className="text-xs">Hasta:</span>
          <input
            type="date"
            value={formatDateForInput(customTo)}
            onChange={(e) => setCustomTo(e.target.value.replace(/-/g, ''))}
            className="text-xs border rounded px-2 py-1 bg-background"
          />
          <Button
            size="sm"
            onClick={handleCustomApply}
            disabled={!customFrom || !customTo}
            className="text-xs"
          >
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
}