import { ArxivPaper } from '@/lib/types';
import { formatRelativeDate, formatAuthors, formatCategory } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Calendar, Users } from '@phosphor-icons/react';

interface PaperCardProps {
  paper: ArxivPaper;
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-semibold text-lg leading-tight">
            <a
              href={paper.links.abs}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {paper.title}
            </a>
          </h3>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="shrink-0"
          >
            <a
              href={paper.links.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <FileText size={16} />
              PDF
            </a>
          </Button>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
          {paper.summary}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={14} className="shrink-0" />
            <span className="truncate">{formatAuthors(paper.authors)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} className="shrink-0" />
            <span>{formatRelativeDate(paper.published)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
        {paper.categories.slice(0, 3).map((category) => (
          <Badge key={category} variant="secondary" className="text-xs">
            {formatCategory(category)}
          </Badge>
        ))}
        {paper.categories.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{paper.categories.length - 3} more
          </Badge>
        )}
      </div>
    </Card>
  );
}