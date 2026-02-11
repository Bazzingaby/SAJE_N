import { beforeEach, describe, expect, it } from 'vitest';
import { useWorkspaceStore } from '@/lib/store/workspace-store';
import type { AgentState, ChatMessage } from '@/lib/store/types';

const initialState = useWorkspaceStore.getState();

const mockAgent: AgentState = {
  id: 'agent-1',
  type: 'coder',
  status: 'idle',
};

const mockAgent2: AgentState = {
  id: 'agent-2',
  type: 'conductor',
  status: 'idle',
  currentTask: 'Orchestrating',
};

const mockMessage: ChatMessage = {
  id: 'msg-1',
  role: 'user',
  content: 'Hello AI',
  timestamp: Date.now(),
};

const mockAssistantMessage: ChatMessage = {
  id: 'msg-2',
  role: 'assistant',
  content: 'Hello! How can I help?',
  agentType: 'coder',
  timestamp: Date.now(),
};

describe('AgentsSlice', () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  describe('addAgent', () => {
    it('should add an agent to the agents array', () => {
      useWorkspaceStore.getState().addAgent(mockAgent);

      const state = useWorkspaceStore.getState();
      expect(state.agents).toHaveLength(1);
      expect(state.agents[0]).toEqual(mockAgent);
    });

    it('should add multiple agents', () => {
      const { addAgent } = useWorkspaceStore.getState();
      addAgent(mockAgent);
      addAgent(mockAgent2);

      expect(useWorkspaceStore.getState().agents).toHaveLength(2);
    });
  });

  describe('removeAgent', () => {
    it('should remove an agent by id', () => {
      const { addAgent } = useWorkspaceStore.getState();
      addAgent(mockAgent);
      addAgent(mockAgent2);

      useWorkspaceStore.getState().removeAgent('agent-1');

      const state = useWorkspaceStore.getState();
      expect(state.agents).toHaveLength(1);
      expect(state.agents[0]?.id).toBe('agent-2');
    });

    it('should do nothing when removing a non-existent agent', () => {
      useWorkspaceStore.getState().addAgent(mockAgent);
      useWorkspaceStore.getState().removeAgent('non-existent');

      expect(useWorkspaceStore.getState().agents).toHaveLength(1);
    });
  });

  describe('updateAgentStatus', () => {
    it('should update agent status', () => {
      useWorkspaceStore.getState().addAgent(mockAgent);

      useWorkspaceStore.getState().updateAgentStatus('agent-1', 'thinking');

      const state = useWorkspaceStore.getState();
      expect(state.agents[0]?.status).toBe('thinking');
    });

    it('should update agent status and current task', () => {
      useWorkspaceStore.getState().addAgent(mockAgent);

      useWorkspaceStore
        .getState()
        .updateAgentStatus('agent-1', 'executing', 'Writing code');

      const state = useWorkspaceStore.getState();
      expect(state.agents[0]?.status).toBe('executing');
      expect(state.agents[0]?.currentTask).toBe('Writing code');
    });

    it('should clear current task when not provided', () => {
      useWorkspaceStore.getState().addAgent({
        ...mockAgent,
        currentTask: 'Something',
      });

      useWorkspaceStore.getState().updateAgentStatus('agent-1', 'idle');

      const state = useWorkspaceStore.getState();
      expect(state.agents[0]?.status).toBe('idle');
      expect(state.agents[0]?.currentTask).toBeUndefined();
    });

    it('should do nothing when updating a non-existent agent', () => {
      useWorkspaceStore.getState().addAgent(mockAgent);
      useWorkspaceStore.getState().updateAgentStatus('non-existent', 'error');

      expect(useWorkspaceStore.getState().agents[0]?.status).toBe('idle');
    });
  });

  describe('addChatMessage', () => {
    it('should add a message to chat history', () => {
      useWorkspaceStore.getState().addChatMessage(mockMessage);

      const state = useWorkspaceStore.getState();
      expect(state.chatHistory).toHaveLength(1);
      expect(state.chatHistory[0]).toEqual(mockMessage);
    });

    it('should append messages in order', () => {
      const { addChatMessage } = useWorkspaceStore.getState();
      addChatMessage(mockMessage);
      addChatMessage(mockAssistantMessage);

      const state = useWorkspaceStore.getState();
      expect(state.chatHistory).toHaveLength(2);
      expect(state.chatHistory[0]?.role).toBe('user');
      expect(state.chatHistory[1]?.role).toBe('assistant');
      expect(state.chatHistory[1]?.agentType).toBe('coder');
    });
  });

  describe('clearChatHistory', () => {
    it('should clear all messages', () => {
      const { addChatMessage } = useWorkspaceStore.getState();
      addChatMessage(mockMessage);
      addChatMessage(mockAssistantMessage);

      useWorkspaceStore.getState().clearChatHistory();

      expect(useWorkspaceStore.getState().chatHistory).toHaveLength(0);
    });

    it('should work when chat history is already empty', () => {
      useWorkspaceStore.getState().clearChatHistory();

      expect(useWorkspaceStore.getState().chatHistory).toHaveLength(0);
    });
  });

  describe('setLLMConfig', () => {
    it('should update LLM config partially', () => {
      useWorkspaceStore.getState().setLLMConfig({ temperature: 0.5 });

      const state = useWorkspaceStore.getState();
      expect(state.llmConfig.temperature).toBe(0.5);
      expect(state.llmConfig.provider).toBe('anthropic'); // unchanged
    });

    it('should update provider and model', () => {
      useWorkspaceStore.getState().setLLMConfig({
        provider: 'openai',
        model: 'gpt-4',
      });

      const state = useWorkspaceStore.getState();
      expect(state.llmConfig.provider).toBe('openai');
      expect(state.llmConfig.model).toBe('gpt-4');
    });

    it('should update api key and base url', () => {
      useWorkspaceStore.getState().setLLMConfig({
        apiKey: 'sk-test-key',
        baseUrl: 'https://api.example.com',
      });

      const state = useWorkspaceStore.getState();
      expect(state.llmConfig.apiKey).toBe('sk-test-key');
      expect(state.llmConfig.baseUrl).toBe('https://api.example.com');
    });

    it('should update maxTokens', () => {
      useWorkspaceStore.getState().setLLMConfig({ maxTokens: 8192 });

      expect(useWorkspaceStore.getState().llmConfig.maxTokens).toBe(8192);
    });
  });

  describe('default LLM config', () => {
    it('should have sensible defaults', () => {
      const { llmConfig } = useWorkspaceStore.getState();

      expect(llmConfig.provider).toBe('anthropic');
      expect(llmConfig.model).toBeDefined();
      expect(llmConfig.temperature).toBeGreaterThanOrEqual(0);
      expect(llmConfig.temperature).toBeLessThanOrEqual(1);
      expect(llmConfig.maxTokens).toBeGreaterThan(0);
    });
  });
});
