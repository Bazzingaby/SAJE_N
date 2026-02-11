# Data Pipeline Engine Blueprint

Open-source visual pipeline builder inspired by Databricks, Airflow, and Informatica.

---

## 1. Node Interface

```typescript
interface PipelineNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  execute(input: DataPayload): Promise<DataPayload>;
  validate(): ValidationResult;
  getSchema(): SchemaDefinition;
}

interface DataPayload {
  rows: Record<string, any>[];
  schema: ColumnDef[];
  metadata: { rowCount: number; executionTime: number };
}
```

## 2. Node Types

### Sources
| Node | Config | Output |
|------|--------|--------|
| REST API | URL, method, headers, auth | JSON as rows |
| PostgreSQL | Connection string, query | Query results |
| MySQL | Connection string, query | Query results |
| CSV File | File path, delimiter, headers | Parsed rows |
| JSON File | File path, JSONPath | Extracted rows |
| S3 Bucket | Bucket, prefix, credentials | File content |
| Google Sheets | Sheet ID, range | Sheet data |
| Webhook | Auto-generated endpoint | Incoming payload |

### Transforms
| Node | Config | Behavior |
|------|--------|----------|
| SQL Transform | SQL query (`source` alias) | Runs SQL on input data |
| Python Function | `transform(df)` code | Executes Python |
| JavaScript Function | `transform(rows)` code | Executes JS |
| Filter | Column, operator, value | Row filtering |
| Map | Column mappings | Rename, cast, compute |
| Join | Type, left key, right key | Merge two inputs |
| Aggregate | Group by, functions | Group + sum/avg/count |
| Sort | Column, direction | Order rows |
| Deduplicate | Key columns | Remove duplicates |
| Pivot / Unpivot | Row/column/value keys | Reshape data |
| AI Transform | Prompt template, model | LLM classifies/extracts per row |
| Data Quality | Rules (null, range, regex) | Validates, flags issues |

### Sinks
| Node | Config | Behavior |
|------|--------|----------|
| Database Write | Connection, table, mode | INSERT/UPSERT |
| CSV/JSON Export | Path, format | Write file |
| API POST | URL, headers, body template | POST data |
| Email | To, subject, body | Send notification |
| Slack | Channel, message template | Post message |
| Dashboard | Chart type, axes | Render visualization |

### Control Flow
| Node | Config | Behavior |
|------|--------|----------|
| Branch (If/Else) | Condition | Routes to true/false output |
| Switch | Column, cases | Multiple output routing |
| Loop | Iterator | Repeats sub-flow per item |
| Merge | Strategy | Combines multiple inputs |
| Trigger | Type (cron/webhook/manual) | Starts pipeline |
| Retry | Max attempts, backoff | Retries failed node |

## 3. Execution Engine

```
1. PARSE:    Node graph → DAG (topological sort)
2. VALIDATE: Check all configs
3. EXECUTE:  Run nodes in dependency order
   - Fetch inputs from predecessors
   - Execute node logic (sandboxed)
   - Cache output for downstream nodes
   - Stream log entry to client (SSE)
4. COMPLETE: Store results, notify user
```

### DAG Resolution
Topological sort via BFS from nodes with 0 in-degree. Cycle detection throws error.

## 4. Scheduling

- **Cron**: Standard cron expressions via UI with presets (hourly, daily, weekly)
- **Webhook**: Auto-generated endpoint triggers run
- **File watch**: S3/GCS bucket new file trigger
- **Database change**: pg_notify listener
- **Manual**: User clicks Run

## 5. Error Handling

| Strategy | Behavior |
|----------|----------|
| Retry | Re-execute with linear/exponential backoff |
| Skip | Mark as skipped, continue pipeline |
| Abort | Stop pipeline, mark failed (default) |
| Fallback | Route to alternative branch |
| Alert | Email/Slack notification on failure |

## 6. Data Lineage

Every run tracks the full path:
```
Source: customers.csv
  → Filter: status='active'
    → Join: orders ON customer_id
      → Aggregate: sum(revenue) BY region
        → Sink: analytics_db.regional_revenue
```

Viewable as interactive graph in Data Canvas.

## 7. Orchestration Features

- **Execution history**: Every run logged with inputs/outputs/timing
- **Dependency management**: Node B waits for Node A
- **Parallel execution**: Independent branches run concurrently
- **Data sampling**: Preview mode runs on first 100 rows
- **Cost estimation**: AI estimates tokens/compute before ML pipeline runs
