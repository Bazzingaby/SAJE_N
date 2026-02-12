import type { FileNode } from '@/lib/store/types';

/**
 * Sort file tree nodes: directories first, then alphabetical by name.
 */
export function sortFileTree(nodes: FileNode[]): FileNode[] {
  return [...nodes].sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Build a nested tree from a flat list of FileNode items.
 * Groups files into directories based on their path structure,
 * then sorts with directories first and alphabetical order.
 */
export function buildFileTree(files: FileNode[]): FileNode[] {
  if (files.length === 0) return [];

  // Separate top-level items from nested ones
  const nodeMap = new Map<string, FileNode>();
  const roots: FileNode[] = [];

  // First pass: register all nodes by path
  for (const file of files) {
    nodeMap.set(file.path, { ...file, children: file.isDirectory ? [...(file.children ?? [])] : file.children });
  }

  // Second pass: assign children to parents
  for (const file of files) {
    const parentPath = file.path.substring(0, file.path.lastIndexOf('/'));
    const parent = parentPath ? nodeMap.get(parentPath) : undefined;

    if (parent && parent.isDirectory) {
      if (!parent.children) {
        parent.children = [];
      }
      // Avoid duplicates
      if (!parent.children.some((child) => child.path === file.path)) {
        const node = nodeMap.get(file.path);
        if (node) {
          parent.children.push(node);
        }
      }
    } else {
      const node = nodeMap.get(file.path);
      if (node) {
        roots.push(node);
      }
    }
  }

  // Recursively sort children
  function sortRecursive(nodes: FileNode[]): FileNode[] {
    const sorted = sortFileTree(nodes);
    for (const node of sorted) {
      if (node.isDirectory && node.children) {
        node.children = sortRecursive(node.children);
      }
    }
    return sorted;
  }

  return sortRecursive(roots);
}

/**
 * Find a node by its path in a tree (recursive depth-first search).
 */
export function findNodeByPath(tree: FileNode[], path: string): FileNode | undefined {
  for (const node of tree) {
    if (node.path === path) return node;
    if (node.isDirectory && node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Determine the editor language from a file extension.
 */
export function getFileLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescriptreact',
    js: 'javascript',
    jsx: 'javascriptreact',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    py: 'python',
    rs: 'rust',
    go: 'go',
    yaml: 'yaml',
    yml: 'yaml',
    sql: 'sql',
    sh: 'shell',
    dockerfile: 'dockerfile',
  };
  return (ext && languageMap[ext]) ?? 'plaintext';
}

/**
 * Filter a file tree by a search query (case-insensitive).
 * Keeps nodes whose name matches the query.
 * For directories, keeps them if any descendant matches.
 * Preserves tree structure.
 */
export function filterFileTree(nodes: FileNode[], query: string): FileNode[] {
  if (!query.trim()) return nodes;

  const lowerQuery = query.toLowerCase();

  return nodes.reduce<FileNode[]>((acc, node) => {
    const nameMatches = node.name.toLowerCase().includes(lowerQuery);

    if (node.isDirectory && node.children) {
      const filteredChildren = filterFileTree(node.children, query);
      if (nameMatches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }
    } else if (nameMatches) {
      acc.push(node);
    }

    return acc;
  }, []);
}

/**
 * Get a lucide icon name based on file type.
 */
export function getFileIcon(fileName: string, isDirectory: boolean): string {
  if (isDirectory) return 'Folder';
  const ext = fileName.split('.').pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    ts: 'FileCode',
    tsx: 'FileCode',
    js: 'FileCode',
    jsx: 'FileCode',
    json: 'FileJson',
    md: 'FileText',
    css: 'Palette',
    html: 'Globe',
    py: 'FileCode',
    rs: 'FileCode',
    sql: 'Database',
    yaml: 'FileText',
    yml: 'FileText',
  };
  return (ext && iconMap[ext]) ?? 'File';
}
