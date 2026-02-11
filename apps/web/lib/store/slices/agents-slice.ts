import type { AgentsSlice, SliceCreator } from '../types';

const defaultLLMConfig = {
  provider: 'anthropic' as const,
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
  maxTokens: 4096,
};

export const createAgentsSlice: SliceCreator<AgentsSlice> = (set) => ({
  agents: [],
  chatHistory: [],
  llmConfig: defaultLLMConfig,

  addAgent: (agent) =>
    set(
      (state) => {
        state.agents.push(agent);
      },
      undefined,
      'agents/addAgent',
    ),

  removeAgent: (agentId) =>
    set(
      (state) => {
        state.agents = state.agents.filter((a) => a.id !== agentId);
      },
      undefined,
      'agents/removeAgent',
    ),

  updateAgentStatus: (agentId, status, currentTask) =>
    set(
      (state) => {
        const agent = state.agents.find((a) => a.id === agentId);
        if (agent) {
          agent.status = status;
          agent.currentTask = currentTask;
        }
      },
      undefined,
      'agents/updateAgentStatus',
    ),

  addChatMessage: (message) =>
    set(
      (state) => {
        state.chatHistory.push(message);
      },
      undefined,
      'agents/addChatMessage',
    ),

  clearChatHistory: () =>
    set(
      (state) => {
        state.chatHistory = [];
      },
      undefined,
      'agents/clearChatHistory',
    ),

  setLLMConfig: (config) =>
    set(
      (state) => {
        Object.assign(state.llmConfig, config);
      },
      undefined,
      'agents/setLLMConfig',
    ),
});
