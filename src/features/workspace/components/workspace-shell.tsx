'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { WorkspaceHeader } from '@/features/workspace/components/workspace-header';
import { WorkspaceSidebar } from '@/features/workspace/components/workspace-sidebar';

type WorkspaceShellProps = {
  children: React.ReactNode;
  profile: {
    displayName: string;
    email?: string;
    penName?: string;
    avatarUrl?: string;
  };
};

export function WorkspaceShell({ children, profile }: WorkspaceShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const isAccountArea = pathname === '/account' || pathname.startsWith('/account/');

  return (
    <div className="min-h-dvh bg-canvas p-4">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        {!isAccountArea && <WorkspaceSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />}
        <div className="min-w-0 flex-1">
          <WorkspaceHeader {...profile} showWorkspaceMenu={!isAccountArea} />
          <main className="pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
