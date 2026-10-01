import { useState } from 'react';

/** Sort and column-visibility state for the admin tables (components live in table.tsx). */

export type SortState<K extends string> = { key: K; dir: 'asc' | 'desc' };

/** Sort state that flips direction when the active column is clicked again. */
export function useSort<K extends string>(initial: K) {
  const [sort, setSort] = useState<SortState<K>>({ key: initial, dir: 'asc' });
  const toggle = (key: K) =>
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  return [sort, toggle] as const;
}

/** Case-insensitive compare that sorts empty values last. */
export function compareText(a: string | null | undefined, b: string | null | undefined) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
}

export function applyDir(cmp: number, dir: 'asc' | 'desc') {
  return dir === 'asc' ? cmp : -cmp;
}

export type ColumnDef<K extends string> = { key: K; label: string };

/** Per-column visibility, all visible to start. */
export function useColumnVisibility<K extends string>(columns: readonly ColumnDef<K>[]) {
  const [visible, setVisible] = useState<Record<K, boolean>>(
    () => Object.fromEntries(columns.map((c) => [c.key, true])) as Record<K, boolean>,
  );
  const toggle = (key: K) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleAll = () => {
    const allVisible = columns.every((c) => visible[c.key]);
    setVisible(Object.fromEntries(columns.map((c) => [c.key, !allVisible])) as Record<K, boolean>);
  };
  return { visible, toggle, toggleAll };
}
