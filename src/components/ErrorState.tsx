import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, ArrowCounterClockwise } from '@phosphor-icons/react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ message, onRetry, showRetry = true }: ErrorStateProps) {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 rounded-full bg-destructive/10">
          <AlertTriangle size={32} className="text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <ArrowCounterClockwise size={16} />
            Try again
          </Button>
        )}
      </div>
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}