'use client';

import { rankItem } from '@tanstack/match-sorter-utils';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Column,
  type ColumnDef,
  type FilterFn,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/cn';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  searchPlaceholder?: string;
  mode?: 'pagination' | 'incremental';
  pageSize?: number;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = 'Nenhum resultado encontrado.',
  searchPlaceholder = 'Buscar em todos os campos…',
  mode = 'pagination',
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const fuzzyFilter: FilterFn<TData> = (row, columnId, value, addMeta) => {
    const rank = rankItem(String(row.getValue(columnId) ?? ''), String(value));
    addMeta({ rank });
    return rank.passed;
  };
  // TanStack Table manages its own mutable instance; React Compiler correctly skips this hook.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<TData>({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);
      setVisibleCount(pageSize);
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: mode === 'pagination' ? getPaginationRowModel() : undefined,
    initialState: { pagination: { pageSize } },
  });

  const allRows = table.getRowModel().rows;
  const rows = mode === 'incremental' ? allRows.slice(0, visibleCount) : allRows;
  const totalFiltered = table.getFilteredRowModel().rows.length;

  return (
    <div className="overflow-hidden rounded-card border border-white/10 bg-white/[0.02]">
      <div className="flex flex-col gap-3 border-b border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" aria-hidden="true" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="min-h-10 border-white/10 bg-black/20 pl-9 text-white placeholder:text-white/35 hover:border-white/20 focus-visible:border-emerald-400 focus-visible:ring-emerald-400"
          />
        </div>
        <p className="text-xs text-white/40">{table.getFilteredRowModel().rows.length} {table.getFilteredRowModel().rows.length === 1 ? 'registro' : 'registros'}</p>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-white/[0.035] hover:bg-white/[0.035]">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
              {row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={columns.length} className="h-28 text-center text-white/45">{emptyMessage}</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      {mode === 'pagination' ? (
        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-3 py-2.5">
          <span className="text-xs text-white/40">Página {table.getState().pagination.pageIndex + 1} de {Math.max(table.getPageCount(), 1)}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="size-9 min-h-9 text-white disabled:opacity-30 hover:bg-white/10" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Página anterior"><ChevronLeft className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="size-9 min-h-9 text-white disabled:opacity-30 hover:bg-white/10" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Próxima página"><ChevronRight className="size-4" /></Button>
          </div>
        </div>
      ) : visibleCount < totalFiltered ? (
        <div className="border-t border-white/10 p-3 text-center">
          <Button variant="ghost" className="min-h-9 text-white/70 hover:bg-white/10 hover:text-white" onClick={() => setVisibleCount((count) => count + pageSize)}>Carregar mais</Button>
        </div>
      ) : null}
    </div>
  );
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: { column: Column<TData, TValue>; title: string; className?: string }) {
  if (!column.getCanSort()) return <span className={className}>{title}</span>;
  const sorted = column.getIsSorted();
  return (
    <button type="button" className={cn('inline-flex items-center gap-1.5 hover:text-white', className)} onClick={() => column.toggleSorting(sorted === 'asc')}>
      {title}
      {sorted === 'asc' ? <ArrowUp className="size-3.5" /> : sorted === 'desc' ? <ArrowDown className="size-3.5" /> : <ArrowUpDown className="size-3.5 opacity-55" />}
    </button>
  );
}
