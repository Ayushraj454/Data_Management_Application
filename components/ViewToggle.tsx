'use client';

import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border p-1 bg-muted/50">
      <Button
        variant={viewMode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('cards')}
        className="flex items-center gap-2 h-8"
      >
        <Grid3X3 className="h-4 w-4" />
        Cards
      </Button>
      <Button
        variant={viewMode === 'rows' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('rows')}
        className="flex items-center gap-2 h-8"
      >
        <List className="h-4 w-4" />
        Rows
      </Button>
    </div>
  );
}