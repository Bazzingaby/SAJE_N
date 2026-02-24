/**
 * Pipeline node execution (S4.1) — stubs that return DataPayload for runner.
 */
import type { DataPayload, SourceConfig, TransformConfig, SinkConfig } from './types';

const emptyPayload: DataPayload = {
  rows: [],
  schema: [],
  metadata: { rowCount: 0, executionTimeMs: 0 },
};

function makePayload(rows: Record<string, unknown>[]): DataPayload {
  const schema =
    rows.length > 0 ? Object.keys(rows[0]!).map((name) => ({ name, type: 'string' })) : [];
  return {
    rows,
    schema,
    metadata: { rowCount: rows.length, executionTimeMs: 0 },
  };
}

/**
 * Execute a source node: returns mock or real data based on config.
 */
export async function executeSource(config: SourceConfig = {}): Promise<DataPayload> {
  const start = Date.now();
  if (config.sourceType === 'api' && config.url) {
    // Placeholder: in real impl would fetch config.url
    const rows = [{ id: 1, source: config.url, fetched: new Date().toISOString() }];
    return {
      ...makePayload(rows),
      metadata: { rowCount: rows.length, executionTimeMs: Date.now() - start },
    };
  }
  // Default mock rows for MVP
  const rows = [
    { id: 1, name: 'Alice', value: 100 },
    { id: 2, name: 'Bob', value: 200 },
    { id: 3, name: 'Carol', value: 150 },
  ];
  return {
    ...makePayload(rows),
    metadata: { rowCount: rows.length, executionTimeMs: Date.now() - start },
  };
}

/**
 * Execute a transform node: applies expression (mock) to input rows.
 */
export async function executeTransform(
  config: TransformConfig = {},
  input: DataPayload,
): Promise<DataPayload> {
  const start = Date.now();
  let rows = [...input.rows];
  if (config.expression?.trim()) {
    // Mock: filter by "value" if expression contains "value"
    if (config.expression.toLowerCase().includes('value')) {
      rows = rows.filter((r) => Number(r['value']) > 0);
    }
  }
  const result = makePayload(rows);
  result.metadata.executionTimeMs = Date.now() - start;
  return result;
}

/**
 * Execute a sink node: consumes input (mock write).
 */
export async function executeSink(
  _config: SinkConfig = {},
  input: DataPayload,
): Promise<DataPayload> {
  const start = Date.now();
  // Mock: just pass through; real impl would write to config.table or config.path
  const result = makePayload(input.rows);
  result.metadata.executionTimeMs = Date.now() - start;
  return result;
}

export function getEmptyPayload(): DataPayload {
  return { ...emptyPayload };
}
