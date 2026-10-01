import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ColumnDef, SortState } from '@/components/admin/table-state';

/*
 * Pieces shared by the admin report and check-in tables: sortable headers,
 * show/hide column pills, and the stat tiles above them.
 */

export function ColumnToggleBar<K extends string>({
  columns,
  visible,
  onToggle,
  onToggleAll,
}: {
  columns: readonly ColumnDef<K>[];
  visible: Record<K, boolean>;
  onToggle: (key: K) => void;
  onToggleAll: () => void;
}) {
  const { t } = useTranslation();
  const allVisible = columns.every((c) => visible[c.key]);

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      role="group"
      aria-label={t('admin.columns')}
    >
      <button
        type="button"
        onClick={onToggleAll}
        className="text-whd-text-muted cursor-pointer px-1 text-xs underline-offset-2 hover:text-white hover:underline"
      >
        {allVisible ? t('admin.hideAll') : t('admin.showAll')}
      </button>
      {columns.map((col) => (
        <button
          key={col.key}
          type="button"
          aria-pressed={visible[col.key]}
          onClick={() => onToggle(col.key)}
          className={cn(
            'cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors select-none',
            visible[col.key]
              ? 'border-whd-pink/50 bg-whd-pink/15 text-whd-pink-bright hover:bg-whd-pink/25'
              : 'border-whd-border text-whd-text-dim hover:text-whd-text-muted',
          )}
        >
          {col.label}
        </button>
      ))}
    </div>
  );
}

export function SortableTh<K extends string>({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: K;
  sort: SortState<K>;
  onSort: (key: K) => void;
}) {
  const active = sort.key === sortKey;
  return (
    <th
      className="px-4 py-3 font-medium whitespace-nowrap"
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-white',
          active && 'text-whd-pink-bright',
        )}
      >
        {label}
        <span aria-hidden="true" className={active ? '' : 'opacity-0'}>
          {sort.dir === 'asc' || !active ? '↑' : '↓'}
        </span>
      </button>
    </th>
  );
}

export function PlainTh({ label }: { label: string }) {
  return <th className="px-4 py-3 font-medium whitespace-nowrap">{label}</th>;
}

export function StatCard({
  label,
  value,
  breakdown,
}: {
  label: string;
  value: number;
  breakdown?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-end justify-between gap-3 p-5">
        <div>
          <div className="text-whd-pink-bright text-3xl font-black md:text-4xl">{value}</div>
          <div className="text-whd-text-muted mt-1 text-sm">{label}</div>
        </div>
        {breakdown && (
          <div className="text-whd-text-muted text-right text-sm tabular-nums">{breakdown}</div>
        )}
      </CardContent>
    </Card>
  );
}
