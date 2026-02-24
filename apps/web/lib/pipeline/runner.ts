/**
 * Pipeline runner (S4.3) — build DAG, topological sort, execute nodes in order.
 */
import type { Node, Edge } from '@xyflow/react';
import type { DataPayload, SourceConfig, TransformConfig, SinkConfig } from './types';
import { executeSource, executeTransform, executeSink, getEmptyPayload } from './nodes';

export interface RunResult {
  success: boolean;
  nodeOutputs: Map<string, DataPayload>;
  error?: string;
}

function getInDegreeMap(nodes: Node[], edges: Edge[]): Map<string, number> {
  const map = new Map<string, number>();
  nodes.forEach((n) => map.set(n.id, 0));
  edges.forEach((e) => {
    map.set(e.target, (map.get(e.target) ?? 0) + 1);
  });
  return map;
}

/**
 * Topological sort of node ids; sources first. Throws if cycle detected.
 */
export function topologicalSort(nodes: Node[], edges: Edge[]): string[] {
  const inDegree = getInDegreeMap(nodes, edges);
  const outEdges = new Map<string, string[]>();
  edges.forEach((e) => {
    const list = outEdges.get(e.source) ?? [];
    list.push(e.target);
    outEdges.set(e.source, list);
  });

  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });
  const order: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const target of outEdges.get(id) ?? []) {
      const d = inDegree.get(target)! - 1;
      inDegree.set(target, d);
      if (d === 0) queue.push(target);
    }
  }
  if (order.length !== nodes.length) {
    throw new Error('Pipeline has a cycle');
  }
  return order;
}

function getPredecessorOutputs(
  nodeId: string,
  edges: Edge[],
  nodeOutputs: Map<string, DataPayload>,
): DataPayload {
  const incoming = edges.filter((e) => e.target === nodeId);
  if (incoming.length === 0) return getEmptyPayload();
  const first = incoming[0];
  const payload = nodeOutputs.get(first!.source);
  if (!payload) return getEmptyPayload();
  return payload;
}

/**
 * Run pipeline: sort nodes, execute in order, pass outputs to successors.
 */
export async function runPipeline(nodes: Node[], edges: Edge[]): Promise<RunResult> {
  const nodeOutputs = new Map<string, DataPayload>();

  try {
    const order = topologicalSort(nodes, edges);

    for (const nodeId of order) {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      const type = node.type ?? '';
      const config = (node.data?.config ?? {}) as SourceConfig | TransformConfig | SinkConfig;

      if (type === 'source') {
        const out = await executeSource(config as SourceConfig);
        nodeOutputs.set(nodeId, out);
      } else if (type === 'transform') {
        const input = getPredecessorOutputs(nodeId, edges, nodeOutputs);
        const out = await executeTransform(config as TransformConfig, input);
        nodeOutputs.set(nodeId, out);
      } else if (type === 'sink') {
        const input = getPredecessorOutputs(nodeId, edges, nodeOutputs);
        await executeSink(config as SinkConfig, input);
        nodeOutputs.set(nodeId, input);
      } else {
        nodeOutputs.set(nodeId, getEmptyPayload());
      }
    }

    return { success: true, nodeOutputs };
  } catch (err) {
    return {
      success: false,
      nodeOutputs: new Map(),
      error: err instanceof Error ? err.message : 'Pipeline run failed',
    };
  }
}
