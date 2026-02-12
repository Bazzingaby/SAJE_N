"use client";

import { useState, useMemo, useCallback } from "react";
import { FilePlus, FolderPlus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store";
import type { FileNode } from "@/lib/store/types";
import { sortFileTree, filterFileTree } from "@/lib/utils/file-tree";
import { FileTreeItem } from "./FileTreeItem";

export function FileExplorer() {
  const files = useWorkspaceStore((state) => state.files);
  const openFile = useWorkspaceStore((state) => state.openFile);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);

  const sortedFiles = useMemo(() => sortFileTree(files), [files]);

  const displayedFiles = useMemo(() => {
    if (!searchQuery.trim()) return sortedFiles;
    return filterFileTree(sortedFiles, searchQuery);
  }, [sortedFiles, searchQuery]);

  const handleSelect = useCallback(
    (node: FileNode) => {
      setSelectedPath(node.path);
      if (!node.isDirectory) {
        openFile(node);
      }
    },
    [openFile]
  );

  return (
    <div
      className="flex h-full flex-col bg-bg-secondary"
      data-testid="file-explorer"
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Explorer
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-[44px] w-[44px] min-h-[44px] min-w-[44px]")}
            aria-label="New File"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-[44px] w-[44px] min-h-[44px] min-w-[44px]")}
            aria-label="New Folder"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-[44px] w-[44px] min-h-[44px] min-w-[44px]")}
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 py-2">
        <Input
          type="search"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
          aria-label="Search files"
        />
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div role="tree" aria-label="File explorer" className="px-1 pb-4">
          {displayedFiles.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-text-secondary">
              No files in workspace
            </p>
          ) : (
            displayedFiles.map((node) => (
              <FileTreeItem
                key={node.id}
                node={node}
                depth={0}
                onSelect={handleSelect}
                selectedPath={selectedPath}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
