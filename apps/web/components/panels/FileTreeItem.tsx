"use client";

import { useState, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Globe,
  Palette,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileNode } from "@/lib/store/types";
import { getFileIcon } from "@/lib/utils/file-tree";

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Globe,
  Palette,
  Database,
};

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  onSelect: (node: FileNode) => void;
  selectedPath?: string;
}

export function FileTreeItem({ node, depth, onSelect, selectedPath }: FileTreeItemProps) {
  const [expanded, setExpanded] = useState(false);

  const isSelected = selectedPath === node.path;
  const isDirectory = node.isDirectory;

  const handleClick = useCallback(() => {
    if (isDirectory) {
      setExpanded((prev) => !prev);
    }
    onSelect(node);
  }, [isDirectory, node, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
      if (isDirectory) {
        if (e.key === "ArrowRight" && !expanded) {
          e.preventDefault();
          setExpanded(true);
        }
        if (e.key === "ArrowLeft" && expanded) {
          e.preventDefault();
          setExpanded(false);
        }
      }
    },
    [handleClick, isDirectory, expanded]
  );

  // Resolve the icon component
  const iconName = isDirectory
    ? expanded
      ? "FolderOpen"
      : "Folder"
    : getFileIcon(node.name, false);
  const IconComponent = iconComponents[iconName] ?? File;

  return (
    <div role="treeitem" aria-selected={isSelected} aria-expanded={isDirectory ? expanded : undefined}>
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-[44px] w-full items-center gap-1 rounded-md px-3 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary",
          isSelected && "bg-accent-blue/10 text-accent-blue"
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        aria-label={node.name}
      >
        {/* Expand/collapse arrow for directories */}
        {isDirectory ? (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        ) : (
          <span className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}

        {/* File/folder icon */}
        <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />

        {/* File name */}
        <span className="truncate">{node.name}</span>
      </button>

      {/* Render children when directory is expanded */}
      {isDirectory && expanded && node.children && (
        <div role="group">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
