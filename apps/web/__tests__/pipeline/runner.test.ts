import { describe, expect, it } from 'vitest';
import { topologicalSort, runPipeline } from '@/lib/pipeline/runner';
import type { Node, Edge } from '@xyflow/react';

const node = (id: string, type: string): Node => ({
  id,
  type,
  position: { x: 0, y: 0 },
  data: { label: id, config: {} },
});

describe('Pipeline runner', () => {
  describe('topologicalSort', () => {
    it('returns sources first', () => {
      const nodes = [node('a', 'source'), node('b', 'transform'), node('c', 'sink')];
      const edges: Edge[] = [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'c' },
      ];
      const order = topologicalSort(nodes, edges);
      expect(order).toEqual(['a', 'b', 'c']);
    });

    it('handles multiple sources', () => {
      const nodes = [node('s1', 'source'), node('s2', 'source'), node('t', 'transform')];
      const edges: Edge[] = [
        { id: 'e1', source: 's1', target: 't' },
        { id: 'e2', source: 's2', target: 't' },
      ];
      const order = topologicalSort(nodes, edges);
      expect(order).toContain('s1');
      expect(order).toContain('s2');
      expect(order.indexOf('t')).toBeGreaterThan(order.indexOf('s1'));
      expect(order.indexOf('t')).toBeGreaterThan(order.indexOf('s2'));
    });

    it('throws on cycle', () => {
      const nodes = [node('a', 'source'), node('b', 'transform')];
      const edges: Edge[] = [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'a' },
      ];
      expect(() => topologicalSort(nodes, edges)).toThrow(/cycle/);
    });
  });

  describe('runPipeline', () => {
    it('runs source -> transform -> sink', async () => {
      const nodes = [node('s', 'source'), node('t', 'transform'), node('o', 'sink')];
      const edges: Edge[] = [
        { id: 'e1', source: 's', target: 't' },
        { id: 'e2', source: 't', target: 'o' },
      ];
      const result = await runPipeline(nodes, edges);
      expect(result.success).toBe(true);
      expect(result.nodeOutputs.get('s')?.rows.length).toBeGreaterThan(0);
      expect(result.nodeOutputs.get('t')).toBeDefined();
      expect(result.nodeOutputs.get('o')).toBeDefined();
    });

    it('returns error on cycle', async () => {
      const nodes = [node('a', 'source'), node('b', 'transform')];
      const edges: Edge[] = [
        { id: 'e1', source: 'a', target: 'b' },
        { id: 'e2', source: 'b', target: 'a' },
      ];
      const result = await runPipeline(nodes, edges);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/cycle/);
    });
  });
});
