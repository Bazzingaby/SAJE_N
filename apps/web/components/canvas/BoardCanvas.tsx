'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MoreHorizontal, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Card {
  id: string;
  title: string;
  link?: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const DEFAULT_BOARD: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: '1', title: 'Initialize Design Canvas', link: '/workspace/design' },
      { id: '2', title: 'Pencil Support' },
    ],
  },
  {
    id: 'doing',
    title: 'In Progress',
    cards: [{ id: '3', title: 'Kanban Board Implementation' }],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: '4', title: 'Foundation Sprint' }],
  },
];

export function BoardCanvas() {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_BOARD);
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; sourceColId: string } | null>(
    null,
  );

  const onDragStart = (cardId: string, colId: string) => {
    setDraggedCard({ cardId, sourceColId: colId });
  };

  const onDrop = (targetColId: string) => {
    if (!draggedCard) return;

    const { cardId, sourceColId } = draggedCard;
    if (sourceColId === targetColId) return;

    setColumns((prev) => {
      const newCols = [...prev];
      const sourceCol = newCols.find((c) => c.id === sourceColId);
      const targetCol = newCols.find((c) => c.id === targetColId);

      if (sourceCol && targetCol) {
        const cardIndex = sourceCol.cards.findIndex((c) => c.id === cardId);
        const [card] = sourceCol.cards.splice(cardIndex, 1);
        if (card) {
          targetCol.cards.push(card);
        }
      }
      return newCols;
    });
    setDraggedCard(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      data-testid="board-canvas"
      className="flex h-full w-full bg-bg-primary overflow-x-auto p-6 gap-6"
    >
      {columns.map((col) => (
        <div
          key={col.id}
          onDragOver={onDragOver}
          onDrop={() => onDrop(col.id)}
          className="flex flex-col w-80 shrink-0 rounded-2xl bg-bg-secondary/50 border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-border bg-bg-secondary/80">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary">{col.title}</h3>
              <span className="text-xs text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded-full">
                {col.cards.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="flex flex-col gap-3">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => onDragStart(card.id, col.id)}
                  className="group relative flex flex-col p-4 rounded-xl bg-bg-tertiary border border-border hover:border-accent-pink/50 transition-all cursor-grab active:cursor-grabbing shadow-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-medium text-text-primary leading-tight">
                      {card.title}
                    </span>
                    {card.link && (
                      <Link2 className="h-3.5 w-3.5 text-accent-pink opacity-50 group-hover:opacity-100" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <div className="h-6 w-6 rounded-full bg-accent-pink/20 border-2 border-bg-tertiary" />
                    </div>
                    <span className="text-[10px] text-text-secondary">#S5-{card.id}</span>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-text-secondary hover:text-accent-pink h-10 rounded-xl border-dashed border border-transparent hover:border-accent-pink/20"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Card</span>
              </Button>
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
