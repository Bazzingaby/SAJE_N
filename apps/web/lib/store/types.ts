import type { StateCreator } from 'zustand';
import type { Node, Edge } from '@xyflow/react';

// ─── Canvas Modes ──────────────────────────────────────────────────────────────

export type CanvasMode = 'code' | 'design' | 'flow' | 'data' | 'board';

// ─── File System Types ─────────────────────────────────────────────────────────

export interface FileNode {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface OpenTab {
  id: string;
  filePath: string;
  fileName: string;
  isDirty: boolean;
}

// ─── Agent Types ───────────────────────────────────────────────────────────────

export type AgentType =
  | 'conductor'
  | 'coder'
  | 'designer'
  | 'pipeline'
  | 'reviewer'
  | 'tester'
  | 'doc-writer'
  | 'researcher';

export type AgentStatus = 'idle' | 'thinking' | 'executing' | 'error';

export interface AgentState {
  id: string;
  type: AgentType;
  status: AgentStatus;
  currentTask?: string;
}

// ─── Chat Types ────────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  agentType?: string;
  timestamp: number;
}

// ─── LLM Configuration ────────────────────────────────────────────────────────

export type LLMProvider =
  | 'openrouter'
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'groq'
  | 'ollama'
  | 'huggingface'
  | 'custom';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature: number;
  maxTokens: number;
}

// ─── UI State ──────────────────────────────────────────────────────────────────

export type BottomTab = 'terminal' | 'output' | 'problems';

export interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  aiPanelOpen: boolean;
  aiPanelWidth: number;
  bottomPanelOpen: boolean;
  bottomPanelHeight: number;
  activeBottomTab: BottomTab;
}

// ─── Slice Interfaces ──────────────────────────────────────────────────────────

export interface WorkspaceSlice {
  projectId: string | null;
  projectName: string;
  canvasMode: CanvasMode;
  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setCanvasMode: (mode: CanvasMode) => void;
}

export interface FilesSlice {
  files: FileNode[];
  openTabs: OpenTab[];
  activeTabId: string | null;
  openFile: (file: FileNode) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateFileContent: (filePath: string, content: string) => void;
  addFile: (file: FileNode) => void;
  deleteFile: (filePath: string) => void;
  renameFile: (oldPath: string, newPath: string, newName: string) => void;
}

export interface CanvasSlice {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;
}

// Re-export for convenience
export type { Node, Edge };

export interface AgentsSlice {
  agents: AgentState[];
  chatHistory: ChatMessage[];
  llmConfig: LLMConfig;
  addAgent: (agent: AgentState) => void;
  removeAgent: (agentId: string) => void;
  updateAgentStatus: (agentId: string, status: AgentStatus, currentTask?: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  setLLMConfig: (config: Partial<LLMConfig>) => void;
}

export interface UISlice {
  ui: UIState;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  toggleAIPanel: () => void;
  setAIPanelWidth: (width: number) => void;
  toggleBottomPanel: () => void;
  setBottomPanelHeight: (height: number) => void;
  setActiveBottomTab: (tab: BottomTab) => void;
}

// ─── Combined Store ────────────────────────────────────────────────────────────

export type WorkspaceStore = WorkspaceSlice & FilesSlice & CanvasSlice & AgentsSlice & UISlice;

// ─── Slice Creator Type ────────────────────────────────────────────────────────

export type SliceCreator<T> = StateCreator<
  WorkspaceStore,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  T
>;
