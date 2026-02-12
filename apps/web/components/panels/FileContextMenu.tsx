"use client";

import { useCallback } from "react";
import { Plus, FolderPlus, Pencil, Trash2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FileNode } from "@/lib/store/types";

interface FileContextMenuProps {
  node: FileNode;
  children: React.ReactNode;
  onNewFile?: (parentPath: string) => void;
  onNewFolder?: (parentPath: string) => void;
  onRename?: (node: FileNode) => void;
  onDelete?: (node: FileNode) => void;
}

export function FileContextMenu({
  node,
  children,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
}: FileContextMenuProps) {
  const handleCopyPath = useCallback(() => {
    void navigator.clipboard.writeText(node.path);
  }, [node.path]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]" align="start">
        {node.isDirectory && (
          <>
            <DropdownMenuItem
              className="h-[44px] gap-2"
              onSelect={() => onNewFile?.(node.path)}
            >
              <Plus className="h-4 w-4" />
              <span>New File</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="h-[44px] gap-2"
              onSelect={() => onNewFolder?.(node.path)}
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="h-[44px] gap-2"
          onSelect={() => onRename?.(node)}
        >
          <Pencil className="h-4 w-4" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="h-[44px] gap-2"
          onSelect={handleCopyPath}
        >
          <Copy className="h-4 w-4" />
          <span>Copy Path</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="h-[44px] gap-2"
          variant="destructive"
          onSelect={() => onDelete?.(node)}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
