import type { CanvasSlice, SliceCreator } from '../types';

export const createCanvasSlice: SliceCreator<CanvasSlice> = (set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) =>
    set(
      (state) => {
        state.nodes = nodes;
      },
      undefined,
      'canvas/setNodes',
    ),

  setEdges: (edges) =>
    set(
      (state) => {
        state.edges = edges;
      },
      undefined,
      'canvas/setEdges',
    ),

  addNode: (node) =>
    set(
      (state) => {
        state.nodes.push(node);
      },
      undefined,
      'canvas/addNode',
    ),

  removeNode: (nodeId) =>
    set(
      (state) => {
        state.nodes = state.nodes.filter(
          (n) => (n as { id: string }).id !== nodeId,
        );
      },
      undefined,
      'canvas/removeNode',
    ),

  addEdge: (edge) =>
    set(
      (state) => {
        state.edges.push(edge);
      },
      undefined,
      'canvas/addEdge',
    ),

  removeEdge: (edgeId) =>
    set(
      (state) => {
        state.edges = state.edges.filter(
          (e) => (e as { id: string }).id !== edgeId,
        );
      },
      undefined,
      'canvas/removeEdge',
    ),
});
