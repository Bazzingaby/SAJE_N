import type { Node, Edge } from '@xyflow/react';
import type { CanvasSlice, SliceCreator } from '../types';

export const createCanvasSlice: SliceCreator<CanvasSlice> = (set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) =>
    set(
      (state) => {
        state.nodes = nodes as typeof state.nodes;
      },
      undefined,
      'canvas/setNodes',
    ),

  setEdges: (edges) =>
    set(
      (state) => {
        state.edges = edges as typeof state.edges;
      },
      undefined,
      'canvas/setEdges',
    ),

  addNode: (node: Node) =>
    set(
      (state) => {
        (state.nodes as Node[]).push(node);
      },
      undefined,
      'canvas/addNode',
    ),

  removeNode: (nodeId) =>
    set(
      (state) => {
        state.nodes = (state.nodes as Node[]).filter((n) => n.id !== nodeId) as typeof state.nodes;
      },
      undefined,
      'canvas/removeNode',
    ),

  addEdge: (edge: Edge) =>
    set(
      (state) => {
        (state.edges as Edge[]).push(edge);
      },
      undefined,
      'canvas/addEdge',
    ),

  removeEdge: (edgeId) =>
    set(
      (state) => {
        state.edges = (state.edges as Edge[]).filter((e) => e.id !== edgeId) as typeof state.edges;
      },
      undefined,
      'canvas/removeEdge',
    ),
});
