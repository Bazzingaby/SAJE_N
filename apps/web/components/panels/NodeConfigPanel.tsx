'use client';

import { useState, useEffect } from 'react';
import type { Node } from '@xyflow/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SourceConfig, TransformConfig, SinkConfig } from '@/lib/pipeline/types';

interface NodeConfigPanelProps {
  node: Node | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (nodeId: string, data: Record<string, unknown>) => void;
}

export function NodeConfigPanel({ node, open, onOpenChange, onSave }: NodeConfigPanelProps) {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [expression, setExpression] = useState('');
  const [table, setTable] = useState('');
  const [path, setPath] = useState('');

  useEffect(() => {
    if (!node) return;
    const d = node.data as Record<string, unknown>;
    const config = (d.config ?? {}) as SourceConfig | TransformConfig | SinkConfig;
    setUrl((config as SourceConfig).url ?? '');
    setQuery((config as SourceConfig).query ?? '');
    setExpression((config as TransformConfig).expression ?? '');
    setTable((config as SinkConfig).table ?? '');
    setPath((config as SinkConfig).path ?? '');
  }, [node]);

  const handleSave = () => {
    if (!node) return;
    const type = node.type ?? '';
    const data: Record<string, unknown> = { ...node.data };
    if (type === 'source') {
      data.config = { sourceType: 'api', url: url || undefined, query: query || undefined };
    } else if (type === 'transform') {
      data.config = { transformType: 'filter', expression: expression || undefined };
    } else if (type === 'sink') {
      data.config = { sinkType: 'database', table: table || undefined, path: path || undefined };
    }
    onSave(node.id, data);
    onOpenChange(false);
  };

  if (!node) return null;

  const type = node.type ?? '';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh] rounded-t-xl border-border bg-bg-secondary">
        <SheetHeader>
          <SheetTitle className="text-text-primary">Configure {type} node</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {type === 'source' && (
            <>
              <label className="block text-sm text-text-secondary">URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="min-h-[44px] bg-bg-primary"
                aria-label="Source URL"
              />
              <label className="block text-sm text-text-secondary">Query (optional)</label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Query"
                className="min-h-[44px] bg-bg-primary"
                aria-label="Query"
              />
            </>
          )}
          {type === 'transform' && (
            <>
              <label className="block text-sm text-text-secondary">Expression</label>
              <Input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g. filter, map expression"
                className="min-h-[44px] bg-bg-primary"
                aria-label="Transform expression"
              />
            </>
          )}
          {type === 'sink' && (
            <>
              <label className="block text-sm text-text-secondary">Table</label>
              <Input
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="Table name"
                className="min-h-[44px] bg-bg-primary"
                aria-label="Sink table"
              />
              <label className="block text-sm text-text-secondary">Path (optional)</label>
              <Input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/path/to/file"
                className="min-h-[44px] bg-bg-primary"
                aria-label="Sink path"
              />
            </>
          )}
          {!['source', 'transform', 'sink'].includes(type) && (
            <p className="text-sm text-text-secondary">No config for this node type.</p>
          )}
        </div>
        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            className="min-h-[44px]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="min-h-[44px] bg-accent-green hover:bg-accent-green/90"
            onClick={handleSave}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
