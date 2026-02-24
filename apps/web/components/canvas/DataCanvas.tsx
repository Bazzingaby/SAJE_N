'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SAMPLE_ROWS: Record<string, unknown>[] = [
  { id: 1, name: 'Alice', value: 100 },
  { id: 2, name: 'Bob', value: 200 },
  { id: 3, name: 'Carol', value: 150 },
  { id: 4, name: 'Dave', value: 180 },
];

function DataTable({ rows }: { rows: Record<string, unknown>[] }) {
  const columns = rows.length > 0 ? Object.keys(rows[0]!) : [];

  return (
    <ScrollArea className="h-full w-full">
      <table className="w-full border-collapse text-left text-sm" data-testid="data-table">
        <thead className="sticky top-0 bg-bg-secondary">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="min-h-[44px] border-b border-border px-3 py-2 font-medium text-text-secondary"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border hover:bg-bg-tertiary">
              {columns.map((col) => (
                <td key={col} className="min-h-[44px] px-3 py-2 text-text-primary">
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

function SimpleBarChart({ rows }: { rows: Record<string, unknown>[] }) {
  if (rows.length === 0) return <div className="p-4 text-text-secondary">No data available</div>;

  const columns = Object.keys(rows[0]!);
  const valueCol =
    columns.find((c) => c.toLowerCase() === 'value') ?? columns[1] ?? columns[0] ?? '';
  const labelCol = columns.find((c) => c.toLowerCase() === 'name') ?? columns[0] ?? '';

  if (!valueCol || !labelCol)
    return <div className="p-4 text-text-secondary">Insufficient columns for chart</div>;

  const max = Math.max(...rows.map((r) => Number(r[valueCol]) || 0), 1);

  return (
    <div className="flex h-64 items-end gap-2 px-4 py-4" data-testid="data-chart">
      {rows.slice(0, 10).map((row, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1" style={{ minHeight: 44 }}>
          <div
            className="w-full min-w-[24px] rounded-t bg-accent-amber/80 transition-all"
            style={{ height: `${((Number(row[valueCol]) || 0) / max) * 180}px` }}
            title={String(row[valueCol])}
          />
          <span className="truncate text-[10px] text-text-secondary max-w-full">
            {String(row[labelCol] ?? '')}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DataCanvas() {
  const [rows] = useState<Record<string, unknown>[]>(SAMPLE_ROWS);
  const [sqlInput, setSqlInput] = useState('SELECT * FROM sample LIMIT 10');
  const [sqlResult, setSqlResult] = useState<Record<string, unknown>[] | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('table');

  const handleRunSql = () => {
    setSqlError(null);
    setSqlResult(null);
    if (!sqlInput.trim()) return;
    if (sqlInput.toUpperCase().includes('SELECT')) {
      setSqlResult(rows);
    } else {
      setSqlError('Only SELECT is supported in this demo.');
    }
  };

  return (
    <div data-testid="data-canvas" className="flex h-full w-full flex-col bg-bg-primary">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
          <TabsList className="bg-bg-secondary">
            <TabsTrigger
              value="table"
              className="min-h-[44px] data-[state=active]:bg-accent-amber/20"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="chart"
              className="min-h-[44px] data-[state=active]:bg-accent-amber/20"
            >
              Chart
            </TabsTrigger>
            <TabsTrigger
              value="sql"
              className="min-h-[44px] data-[state=active]:bg-accent-amber/20"
            >
              SQL
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table" className="mt-0 flex-1 overflow-hidden p-2">
          <DataTable rows={rows} />
        </TabsContent>

        <TabsContent value="chart" className="mt-0 flex-1 overflow-hidden p-2">
          <div className="rounded-lg border border-border bg-bg-secondary p-2">
            <SimpleBarChart rows={rows} />
          </div>
        </TabsContent>

        <TabsContent value="sql" className="mt-0 flex flex-1 flex-col gap-2 overflow-hidden p-2">
          <div className="flex gap-2">
            <Input
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              placeholder="SELECT ..."
              className="min-h-[44px] flex-1 font-mono text-sm"
              aria-label="SQL query"
              data-testid="sql-input"
            />
            <Button
              onClick={handleRunSql}
              className="min-h-[44px] bg-accent-amber text-bg-primary hover:bg-accent-amber/90"
              data-testid="sql-run-button"
            >
              Run
            </Button>
          </div>
          {sqlError && (
            <p className="text-sm text-red-400" role="alert">
              {sqlError}
            </p>
          )}
          {sqlResult && (
            <div className="flex-1 overflow-hidden rounded border border-border">
              <DataTable rows={sqlResult} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
