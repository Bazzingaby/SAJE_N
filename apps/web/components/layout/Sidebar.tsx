'use client';

import { useState } from 'react';
import {
  FileText,
  Search,
  GitBranch,
  Blocks,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const topItems: SidebarItem[] = [
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'git', label: 'Git', icon: GitBranch },
  { id: 'extensions', label: 'Extensions', icon: Blocks },
];

const bottomItems: SidebarItem[] = [{ id: 'settings', label: 'Settings', icon: Settings }];

interface SidebarProps {
  /** Called when the user clicks a panel icon that has panel content */
  onPanelChange?: (panel: 'files' | 'git') => void;
  /** Controlled active panel from parent */
  activePanel?: 'files' | 'git';
}

const PANEL_ICONS = new Set<string>(['files', 'git']);

export function Sidebar({ onPanelChange, activePanel }: SidebarProps = {}) {
  const [expanded, setExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(activePanel ?? 'files');

  return (
    <TooltipProvider>
      <aside
        data-testid="sidebar"
        className={cn(
          'flex h-full flex-col border-r border-border bg-bg-secondary transition-all duration-200',
          expanded ? 'w-60' : 'w-14',
        )}
      >
        {/* Expand/Collapse toggle */}
        <div className="flex h-12 items-center justify-center border-b border-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex h-11 w-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {expanded ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeft className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Top navigation icons */}
        <nav className="flex flex-1 flex-col gap-2 p-1.5" aria-label="Sidebar navigation">
          {topItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItem(item.id);
                      if (PANEL_ICONS.has(item.id)) {
                        onPanelChange?.(item.id as 'files' | 'git');
                      }
                    }}
                    className={cn(
                      'relative flex h-11 w-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary',
                      isActive && 'text-text-primary',
                    )}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-accent-indigo"
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="h-5 w-5" />
                    {expanded && (
                      <span className="ml-3 flex-1 text-left text-sm">{item.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {!expanded && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom-aligned items */}
        <div className="flex flex-col gap-2 border-t border-border p-1.5">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItem(item.id);
                      if (PANEL_ICONS.has(item.id)) {
                        onPanelChange?.(item.id as 'files' | 'git');
                      }
                    }}
                    className={cn(
                      'relative flex h-11 w-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary',
                      isActive && 'text-text-primary',
                    )}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-accent-indigo"
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="h-5 w-5" />
                    {expanded && (
                      <span className="ml-3 flex-1 text-left text-sm">{item.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {!expanded && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </div>
      </aside>
    </TooltipProvider>
  );
}
