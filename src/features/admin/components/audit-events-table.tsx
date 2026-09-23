'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { DataTable, DataTableColumnHeader } from '@/components/ui/data-table';
import { adminRoleLabels, type AdminRole } from '@/features/admin/rbac';

export type AuditEventRow = {
  event_id: string;
  actor_role: AdminRole | null;
  action: string;
  target_type: string;
  target_id: string | null;
  ip_address: string | null;
  occurred_at: string;
};

const columns: ColumnDef<AuditEventRow>[] = [
  {
    accessorKey: 'occurred_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data" />,
    cell: ({ row }) => <span className="text-muted">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.original.occurred_at))}</span>,
  },
  {
    id: 'actor_role',
    accessorFn: (event) => event.actor_role ? adminRoleLabels[event.actor_role] : 'Sistema',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ator" />,
    cell: ({ row }) => row.original.actor_role ? adminRoleLabels[row.original.actor_role] : 'Sistema',
  },
  {
    accessorKey: 'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ação" />,
    cell: ({ row }) => <span className="font-mono text-xs text-accent">{row.original.action}</span>,
  },
  {
    id: 'target',
    accessorFn: (event) => `${event.target_type} ${event.target_id ?? ''}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alvo" />,
    cell: ({ row }) => <span className="text-muted">{row.original.target_type}{row.original.target_id ? ` · ${row.original.target_id}` : ''}</span>,
  },
  {
    accessorKey: 'ip_address',
    header: ({ column }) => <DataTableColumnHeader column={column} title="IP" />,
    cell: ({ row }) => <span className="font-mono text-xs text-muted">{row.original.ip_address ?? '—'}</span>,
  },
];

export function AuditEventsTable({ events }: { events: AuditEventRow[] }) {
  return <DataTable columns={columns} data={events} pageSize={15} searchPlaceholder="Buscar por ator, ação, alvo ou IP…" emptyMessage="Nenhum evento administrativo registrado." />;
}
