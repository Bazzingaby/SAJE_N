'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PanelPlaceholder } from './PanelPlaceholder';
import { TerminalPanel } from '@/components/panels/TerminalPanel';

export function BottomPanel() {
  return (
    <div
      data-testid="bottom-panel"
      className="flex h-full flex-col border-t border-border bg-bg-secondary"
    >
      <Tabs defaultValue="terminal" className="flex h-full flex-col">
        <TabsList variant="line" className="h-9 shrink-0 border-b border-border px-2">
          <TabsTrigger value="terminal" className="h-11 min-w-[44px] px-3 text-xs">
            Terminal
          </TabsTrigger>
          <TabsTrigger value="output" className="h-11 min-w-[44px] px-3 text-xs">
            Output
          </TabsTrigger>
          <TabsTrigger value="problems" className="h-11 min-w-[44px] px-3 text-xs">
            Problems
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="flex-1 overflow-hidden">
          <TerminalPanel />
        </TabsContent>

        <TabsContent value="output" className="flex-1 overflow-hidden">
          <PanelPlaceholder
            title="Output"
            description="Build and task output will be displayed here."
          />
        </TabsContent>

        <TabsContent value="problems" className="flex-1 overflow-hidden">
          <PanelPlaceholder
            title="Problems"
            description="Diagnostics and linting issues will appear here."
            accentColor="text-accent-red"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
