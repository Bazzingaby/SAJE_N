import { beforeEach, describe, expect, it } from 'vitest';
import { useWorkspaceStore } from '@/lib/store/workspace-store';

const initialState = useWorkspaceStore.getState();

const mockNode = { id: 'node-1', type: 'input', data: { label: 'Start' }, position: { x: 0, y: 0 } };
const mockNode2 = { id: 'node-2', type: 'output', data: { label: 'End' }, position: { x: 200, y: 100 } };
const mockEdge = { id: 'edge-1', source: 'node-1', target: 'node-2' };
const mockEdge2 = { id: 'edge-2', source: 'node-2', target: 'node-3' };

describe('CanvasSlice', () => {
  beforeEach(() => {
    useWorkspaceStore.setState(initialState, true);
  });

  describe('setNodes', () => {
    it('should replace all nodes', () => {
      useWorkspaceStore.getState().setNodes([mockNode, mockNode2]);

      const state = useWorkspaceStore.getState();
      expect(state.nodes).toHaveLength(2);
      expect(state.nodes[0]).toEqual(mockNode);
      expect(state.nodes[1]).toEqual(mockNode2);
    });

    it('should clear nodes when setting an empty array', () => {
      useWorkspaceStore.getState().addNode(mockNode);
      useWorkspaceStore.getState().setNodes([]);

      expect(useWorkspaceStore.getState().nodes).toHaveLength(0);
    });
  });

  describe('setEdges', () => {
    it('should replace all edges', () => {
      useWorkspaceStore.getState().setEdges([mockEdge, mockEdge2]);

      const state = useWorkspaceStore.getState();
      expect(state.edges).toHaveLength(2);
      expect(state.edges[0]).toEqual(mockEdge);
    });

    it('should clear edges when setting an empty array', () => {
      useWorkspaceStore.getState().addEdge(mockEdge);
      useWorkspaceStore.getState().setEdges([]);

      expect(useWorkspaceStore.getState().edges).toHaveLength(0);
    });
  });

  describe('addNode', () => {
    it('should add a node to the nodes array', () => {
      useWorkspaceStore.getState().addNode(mockNode);

      const state = useWorkspaceStore.getState();
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0]).toEqual(mockNode);
    });

    it('should append to existing nodes', () => {
      const { addNode } = useWorkspaceStore.getState();
      addNode(mockNode);
      addNode(mockNode2);

      expect(useWorkspaceStore.getState().nodes).toHaveLength(2);
    });
  });

  describe('removeNode', () => {
    it('should remove a node by id', () => {
      const { addNode } = useWorkspaceStore.getState();
      addNode(mockNode);
      addNode(mockNode2);

      useWorkspaceStore.getState().removeNode('node-1');

      const state = useWorkspaceStore.getState();
      expect(state.nodes).toHaveLength(1);
      expect((state.nodes[0] as { id: string }).id).toBe('node-2');
    });

    it('should do nothing when removing a non-existent node', () => {
      useWorkspaceStore.getState().addNode(mockNode);
      useWorkspaceStore.getState().removeNode('non-existent');

      expect(useWorkspaceStore.getState().nodes).toHaveLength(1);
    });
  });

  describe('addEdge', () => {
    it('should add an edge to the edges array', () => {
      useWorkspaceStore.getState().addEdge(mockEdge);

      const state = useWorkspaceStore.getState();
      expect(state.edges).toHaveLength(1);
      expect(state.edges[0]).toEqual(mockEdge);
    });

    it('should append to existing edges', () => {
      const { addEdge } = useWorkspaceStore.getState();
      addEdge(mockEdge);
      addEdge(mockEdge2);

      expect(useWorkspaceStore.getState().edges).toHaveLength(2);
    });
  });

  describe('removeEdge', () => {
    it('should remove an edge by id', () => {
      const { addEdge } = useWorkspaceStore.getState();
      addEdge(mockEdge);
      addEdge(mockEdge2);

      useWorkspaceStore.getState().removeEdge('edge-1');

      const state = useWorkspaceStore.getState();
      expect(state.edges).toHaveLength(1);
      expect((state.edges[0] as { id: string }).id).toBe('edge-2');
    });

    it('should do nothing when removing a non-existent edge', () => {
      useWorkspaceStore.getState().addEdge(mockEdge);
      useWorkspaceStore.getState().removeEdge('non-existent');

      expect(useWorkspaceStore.getState().edges).toHaveLength(1);
    });
  });
});
