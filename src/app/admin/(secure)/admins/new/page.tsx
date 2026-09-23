import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { CreateAdminForm } from '@/features/admin/components/create-admin-form';
import { requireAdmin } from '@/features/admin/auth';

export default async function NewAdminPage() {
  await requireAdmin('admins.manage');
  return (
    <div className="mx-auto max-w-xl"><Link href="/admin/admins" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ChevronLeft className="size-4" />Administradores</Link><p className="mt-7 text-xs uppercase tracking-[0.2em] text-accent">Acesso controlado</p><h1 className="mt-2 text-3xl font-semibold">Convidar administrador</h1><p className="mt-3 text-sm leading-relaxed text-muted">A identidade será criada no Supabase Auth e vinculada ao papel selecionado. A operação só será concluída se a auditoria também for registrada.</p><section className="mt-7 rounded-card border border-line bg-surface p-6 text-ink"><CreateAdminForm /></section></div>
  );
}
