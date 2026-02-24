/**
 * Pipeline types (S4.1) — config schemas and data payload for node execution.
 */

export interface ColumnDef {
  name: string;
  type?: string;
}

export interface DataPayload {
  rows: Record<string, unknown>[];
  schema: ColumnDef[];
  metadata: { rowCount: number; executionTimeMs?: number };
}

export interface SourceConfig {
  url?: string;
  query?: string;
  /** e.g. "csv" | "json" | "api" */
  sourceType?: string;
}

export interface TransformConfig {
  expression?: string;
  /** e.g. "filter" | "map" | "sql" */
  transformType?: string;
}

export interface SinkConfig {
  table?: string;
  path?: string;
  /** e.g. "database" | "file" | "api" */
  sinkType?: string;
}

export type NodeConfig = SourceConfig | TransformConfig | SinkConfig;

export interface PipelineNodeDataBase {
  label?: string;
  description?: string;
  config?: NodeConfig;
}

export interface SourceNodeData extends PipelineNodeDataBase {
  config?: SourceConfig;
}

export interface TransformNodeData extends PipelineNodeDataBase {
  config?: TransformConfig;
}

export interface SinkNodeData extends PipelineNodeDataBase {
  config?: SinkConfig;
}

export const DEFAULT_SOURCE_CONFIG: SourceConfig = {
  sourceType: 'api',
  url: '',
  query: '',
};

export const DEFAULT_TRANSFORM_CONFIG: TransformConfig = {
  transformType: 'filter',
  expression: '',
};

export const DEFAULT_SINK_CONFIG: SinkConfig = {
  sinkType: 'database',
  table: '',
  path: '',
};
