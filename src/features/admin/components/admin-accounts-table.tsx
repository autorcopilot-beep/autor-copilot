'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { DataTable, DataTableColumnHeader } from '@/components/ui/data-table';
import { adminRoleLabels, type AdminRole } from '@/features/admin/rbac';

export type AdminAccountRow = {
  user_id: string;
  display_name: string;
  email: string;
  role: AdminRole;
  is_master: boolean;
  status: string;
  created_at: string;
};

const columns: ColumnDef<AdminAccountRow>[] = [
  {
    id: 'identity',
    accessorFn: (account) => `${account.display_name} ${account.email}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => <div><span className="font-medium text-white">{row.original.display_name}</span><span className="block text-xs text-white/40">{row.original.email}</span></div>,
  },
  {
    id: 'role',
    accessorFn: (account) => adminRoleLabels[account.role],
    header: ({ column }) => <DataTableColumnHeader column={column} title="Papel" />,
    cell: ({ row }) => <span>{adminRoleLabels[row.original.role]}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <span className={`rounded-full px-2 py-1 text-xs ${row.original.status === 'active' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-red-400/10 text-red-300'}`}>{row.original.status === 'active' ? 'Ativo' : 'Suspenso'}</span>,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Criado em" />,
    cell: ({ row }) => <span className="text-white/45">{new Intl.DateTimeFormat('pt-BR').format(new Date(row.original.created_at))}</span>,
  },
];

export function AdminAccountsTable({ accounts }: { accounts: AdminAccountRow[] }) {
  return <DataTable columns={columns} data={accounts} searchPlaceholder="Buscar por nome, e-mail, papel ou status…" emptyMessage="Nenhuma identidade visível para este papel." />;
}
