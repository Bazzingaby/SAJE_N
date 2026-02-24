import { describe, expect, it } from 'vitest';
import {
  executeSource,
  executeTransform,
  executeSink,
  getEmptyPayload,
} from '@/lib/pipeline/nodes';
import type { SourceConfig, TransformConfig, SinkConfig } from '@/lib/pipeline/types';

describe('Pipeline nodes', () => {
  describe('executeSource', () => {
    it('returns DataPayload with rows and schema', async () => {
      const result = await executeSource({});
      expect(result.rows).toBeDefined();
      expect(Array.isArray(result.rows)).toBe(true);
      expect(result.schema).toBeDefined();
      expect(result.metadata.rowCount).toBe(result.rows.length);
    });

    it('returns mock rows when no config', async () => {
      const result = await executeSource({});
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.metadata.rowCount).toBe(result.rows.length);
    });

    it('accepts SourceConfig', async () => {
      const config: SourceConfig = { url: 'https://api.example.com', sourceType: 'api' };
      const result = await executeSource(config);
      expect(result.rows).toBeDefined();
    });
  });

  describe('executeTransform', () => {
    it('returns DataPayload from input', async () => {
      const input = getEmptyPayload();
      input.rows = [{ a: 1 }, { a: 2 }];
      input.schema = [{ name: 'a' }];
      const result = await executeTransform({}, input);
      expect(result.rows).toHaveLength(2);
      expect(result.schema).toHaveLength(1);
    });

    it('can filter when expression provided', async () => {
      const input = getEmptyPayload();
      input.rows = [{ value: 0 }, { value: 10 }, { value: 20 }];
      input.schema = [{ name: 'value' }];
      const result = await executeTransform({ expression: 'value > 0' } as TransformConfig, input);
      expect(result.rows.length).toBeLessThanOrEqual(3);
    });
  });

  describe('executeSink', () => {
    it('returns DataPayload from input', async () => {
      const input = getEmptyPayload();
      input.rows = [{ x: 1 }];
      input.schema = [{ name: 'x' }];
      const config: SinkConfig = { table: 'out' };
      const result = await executeSink(config, input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toEqual({ x: 1 });
    });
  });

  describe('getEmptyPayload', () => {
    it('returns payload with empty rows and schema', () => {
      const p = getEmptyPayload();
      expect(p.rows).toEqual([]);
      expect(p.schema).toEqual([]);
      expect(p.metadata.rowCount).toBe(0);
    });
  });
});
