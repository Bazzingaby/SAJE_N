import { describe, expect, it } from 'vitest';
import type { FileNode } from '@/lib/store/types';
import {
  buildFileTree,
  findNodeByPath,
  getFileLanguage,
  sortFileTree,
  filterFileTree,
  getFileIcon,
} from '@/lib/utils/file-tree';

// ─── Test Fixtures ────────────────────────────────────────────────────────────

const makeFile = (overrides: Partial<FileNode> & Pick<FileNode, 'id' | 'name' | 'path'>): FileNode => ({
  isDirectory: false,
  ...overrides,
});

const makeDir = (overrides: Partial<FileNode> & Pick<FileNode, 'id' | 'name' | 'path'>): FileNode => ({
  isDirectory: true,
  children: [],
  ...overrides,
});

const sampleTree: FileNode[] = [
  makeDir({
    id: 'dir-src',
    name: 'src',
    path: '/src',
    children: [
      makeFile({ id: 'file-index', name: 'index.ts', path: '/src/index.ts' }),
      makeFile({ id: 'file-app', name: 'app.tsx', path: '/src/app.tsx' }),
      makeDir({
        id: 'dir-utils',
        name: 'utils',
        path: '/src/utils',
        children: [
          makeFile({ id: 'file-helpers', name: 'helpers.ts', path: '/src/utils/helpers.ts' }),
        ],
      }),
    ],
  }),
  makeFile({ id: 'file-readme', name: 'README.md', path: '/README.md' }),
  makeFile({ id: 'file-package', name: 'package.json', path: '/package.json' }),
];

// ─── buildFileTree ────────────────────────────────────────────────────────────

describe('buildFileTree', () => {
  it('returns empty array for empty input', () => {
    expect(buildFileTree([])).toEqual([]);
  });

  it('returns sorted flat list when no nesting', () => {
    const flat: FileNode[] = [
      makeFile({ id: '1', name: 'b.ts', path: '/b.ts' }),
      makeFile({ id: '2', name: 'a.ts', path: '/a.ts' }),
    ];
    const result = buildFileTree(flat);
    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe('a.ts');
    expect(result[1]?.name).toBe('b.ts');
  });

  it('groups files into parent directories', () => {
    const flat: FileNode[] = [
      makeDir({ id: 'dir-src', name: 'src', path: '/src' }),
      makeFile({ id: 'file-1', name: 'index.ts', path: '/src/index.ts' }),
      makeFile({ id: 'file-2', name: 'app.tsx', path: '/src/app.tsx' }),
    ];
    const result = buildFileTree(flat);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('src');
    expect(result[0]?.children).toHaveLength(2);
  });

  it('sorts directories before files at each level', () => {
    const flat: FileNode[] = [
      makeFile({ id: 'f1', name: 'z.ts', path: '/z.ts' }),
      makeDir({ id: 'd1', name: 'alpha', path: '/alpha' }),
      makeFile({ id: 'f2', name: 'a.ts', path: '/a.ts' }),
    ];
    const result = buildFileTree(flat);
    expect(result[0]?.name).toBe('alpha');
    expect(result[0]?.isDirectory).toBe(true);
    expect(result[1]?.name).toBe('a.ts');
    expect(result[2]?.name).toBe('z.ts');
  });
});

// ─── findNodeByPath ───────────────────────────────────────────────────────────

describe('findNodeByPath', () => {
  it('finds a top-level node', () => {
    const result = findNodeByPath(sampleTree, '/README.md');
    expect(result).toBeDefined();
    expect(result?.name).toBe('README.md');
  });

  it('finds a nested node', () => {
    const result = findNodeByPath(sampleTree, '/src/utils/helpers.ts');
    expect(result).toBeDefined();
    expect(result?.name).toBe('helpers.ts');
  });

  it('finds a directory', () => {
    const result = findNodeByPath(sampleTree, '/src/utils');
    expect(result).toBeDefined();
    expect(result?.isDirectory).toBe(true);
  });

  it('returns undefined for a non-existent path', () => {
    const result = findNodeByPath(sampleTree, '/non/existent.ts');
    expect(result).toBeUndefined();
  });

  it('returns undefined for an empty tree', () => {
    const result = findNodeByPath([], '/any.ts');
    expect(result).toBeUndefined();
  });
});

// ─── getFileLanguage ──────────────────────────────────────────────────────────

describe('getFileLanguage', () => {
  it('returns typescript for .ts files', () => {
    expect(getFileLanguage('index.ts')).toBe('typescript');
  });

  it('returns typescriptreact for .tsx files', () => {
    expect(getFileLanguage('app.tsx')).toBe('typescriptreact');
  });

  it('returns javascript for .js files', () => {
    expect(getFileLanguage('script.js')).toBe('javascript');
  });

  it('returns javascriptreact for .jsx files', () => {
    expect(getFileLanguage('component.jsx')).toBe('javascriptreact');
  });

  it('returns json for .json files', () => {
    expect(getFileLanguage('package.json')).toBe('json');
  });

  it('returns markdown for .md files', () => {
    expect(getFileLanguage('README.md')).toBe('markdown');
  });

  it('returns css for .css files', () => {
    expect(getFileLanguage('styles.css')).toBe('css');
  });

  it('returns html for .html files', () => {
    expect(getFileLanguage('index.html')).toBe('html');
  });

  it('returns python for .py files', () => {
    expect(getFileLanguage('main.py')).toBe('python');
  });

  it('returns rust for .rs files', () => {
    expect(getFileLanguage('main.rs')).toBe('rust');
  });

  it('returns go for .go files', () => {
    expect(getFileLanguage('main.go')).toBe('go');
  });

  it('returns yaml for .yaml and .yml files', () => {
    expect(getFileLanguage('config.yaml')).toBe('yaml');
    expect(getFileLanguage('config.yml')).toBe('yaml');
  });

  it('returns sql for .sql files', () => {
    expect(getFileLanguage('query.sql')).toBe('sql');
  });

  it('returns shell for .sh files', () => {
    expect(getFileLanguage('setup.sh')).toBe('shell');
  });

  it('returns plaintext for unknown extensions', () => {
    expect(getFileLanguage('file.xyz')).toBe('plaintext');
  });

  it('returns plaintext for files with no extension', () => {
    expect(getFileLanguage('Makefile')).toBe('plaintext');
  });

  it('handles case-insensitive extensions', () => {
    expect(getFileLanguage('File.TS')).toBe('typescript');
    expect(getFileLanguage('File.JSON')).toBe('json');
  });
});

// ─── sortFileTree ─────────────────────────────────────────────────────────────

describe('sortFileTree', () => {
  it('sorts directories before files', () => {
    const nodes: FileNode[] = [
      makeFile({ id: '1', name: 'app.ts', path: '/app.ts' }),
      makeDir({ id: '2', name: 'src', path: '/src' }),
      makeFile({ id: '3', name: 'index.ts', path: '/index.ts' }),
    ];
    const result = sortFileTree(nodes);
    expect(result[0]?.name).toBe('src');
    expect(result[0]?.isDirectory).toBe(true);
  });

  it('sorts alphabetically within the same type', () => {
    const nodes: FileNode[] = [
      makeFile({ id: '1', name: 'zebra.ts', path: '/zebra.ts' }),
      makeFile({ id: '2', name: 'alpha.ts', path: '/alpha.ts' }),
      makeFile({ id: '3', name: 'middle.ts', path: '/middle.ts' }),
    ];
    const result = sortFileTree(nodes);
    expect(result[0]?.name).toBe('alpha.ts');
    expect(result[1]?.name).toBe('middle.ts');
    expect(result[2]?.name).toBe('zebra.ts');
  });

  it('sorts directories alphabetically among themselves', () => {
    const nodes: FileNode[] = [
      makeDir({ id: '1', name: 'zeta', path: '/zeta' }),
      makeDir({ id: '2', name: 'alpha', path: '/alpha' }),
    ];
    const result = sortFileTree(nodes);
    expect(result[0]?.name).toBe('alpha');
    expect(result[1]?.name).toBe('zeta');
  });

  it('does not mutate the original array', () => {
    const nodes: FileNode[] = [
      makeFile({ id: '1', name: 'b.ts', path: '/b.ts' }),
      makeFile({ id: '2', name: 'a.ts', path: '/a.ts' }),
    ];
    const result = sortFileTree(nodes);
    expect(result).not.toBe(nodes);
    expect(nodes[0]?.name).toBe('b.ts');
  });

  it('handles empty array', () => {
    expect(sortFileTree([])).toEqual([]);
  });
});

// ─── filterFileTree ───────────────────────────────────────────────────────────

describe('filterFileTree', () => {
  it('returns all nodes when query is empty', () => {
    const result = filterFileTree(sampleTree, '');
    expect(result).toEqual(sampleTree);
  });

  it('returns all nodes when query is whitespace', () => {
    const result = filterFileTree(sampleTree, '   ');
    expect(result).toEqual(sampleTree);
  });

  it('filters files by name (case-insensitive)', () => {
    const result = filterFileTree(sampleTree, 'README');
    expect(result.some((n) => n.name === 'README.md')).toBe(true);
  });

  it('keeps parent directories when a child matches', () => {
    const result = filterFileTree(sampleTree, 'helpers');
    // src directory should be kept because it contains utils/helpers.ts
    const srcDir = result.find((n) => n.name === 'src');
    expect(srcDir).toBeDefined();
    expect(srcDir?.isDirectory).toBe(true);
  });

  it('preserves nested structure for matching descendants', () => {
    const result = filterFileTree(sampleTree, 'helpers');
    const srcDir = result.find((n) => n.name === 'src');
    const utilsDir = srcDir?.children?.find((n) => n.name === 'utils');
    expect(utilsDir).toBeDefined();
    const helpersFile = utilsDir?.children?.find((n) => n.name === 'helpers.ts');
    expect(helpersFile).toBeDefined();
  });

  it('returns empty array when nothing matches', () => {
    const result = filterFileTree(sampleTree, 'zzz_no_match_zzz');
    expect(result).toHaveLength(0);
  });

  it('matches case-insensitively', () => {
    const result = filterFileTree(sampleTree, 'readme');
    expect(result.some((n) => n.name === 'README.md')).toBe(true);
  });

  it('matches partial file names', () => {
    const result = filterFileTree(sampleTree, 'pack');
    expect(result.some((n) => n.name === 'package.json')).toBe(true);
  });
});

// ─── getFileIcon ──────────────────────────────────────────────────────────────

describe('getFileIcon', () => {
  it('returns Folder for directories', () => {
    expect(getFileIcon('src', true)).toBe('Folder');
  });

  it('returns FileCode for TypeScript files', () => {
    expect(getFileIcon('index.ts', false)).toBe('FileCode');
  });

  it('returns FileCode for TSX files', () => {
    expect(getFileIcon('app.tsx', false)).toBe('FileCode');
  });

  it('returns FileCode for JavaScript files', () => {
    expect(getFileIcon('script.js', false)).toBe('FileCode');
  });

  it('returns FileCode for JSX files', () => {
    expect(getFileIcon('component.jsx', false)).toBe('FileCode');
  });

  it('returns FileJson for JSON files', () => {
    expect(getFileIcon('package.json', false)).toBe('FileJson');
  });

  it('returns FileText for Markdown files', () => {
    expect(getFileIcon('README.md', false)).toBe('FileText');
  });

  it('returns Palette for CSS files', () => {
    expect(getFileIcon('styles.css', false)).toBe('Palette');
  });

  it('returns Globe for HTML files', () => {
    expect(getFileIcon('index.html', false)).toBe('Globe');
  });

  it('returns FileCode for Python files', () => {
    expect(getFileIcon('main.py', false)).toBe('FileCode');
  });

  it('returns FileCode for Rust files', () => {
    expect(getFileIcon('main.rs', false)).toBe('FileCode');
  });

  it('returns Database for SQL files', () => {
    expect(getFileIcon('query.sql', false)).toBe('Database');
  });

  it('returns FileText for YAML files', () => {
    expect(getFileIcon('config.yaml', false)).toBe('FileText');
    expect(getFileIcon('config.yml', false)).toBe('FileText');
  });

  it('returns File for unknown extensions', () => {
    expect(getFileIcon('data.xyz', false)).toBe('File');
  });

  it('returns File for files with no extension', () => {
    expect(getFileIcon('Makefile', false)).toBe('File');
  });
});
