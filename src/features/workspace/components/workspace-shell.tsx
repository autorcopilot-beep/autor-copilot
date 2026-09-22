'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { WorkspaceHeader } from '@/features/workspace/components/workspace-header';
import { WorkspaceSidebar } from '@/features/workspace/components/workspace-sidebar';
import { WritingRail } from '@/features/writing/components/writing-rail';
import { SoundDock } from '@/features/sound/components/sound-dock';

type WorkspaceShellProps = {
  children: React.ReactNode;
  profile: {
    displayName: string;
    email?: string;
    penName?: string;
    avatarUrl?: string;
  };
  soundEnabled?: boolean;
};

export function WorkspaceShell({ children, profile, soundEnabled = false }: WorkspaceShellProps) {
  const pathname = usePathname();
  const isAccountArea = pathname === '/account' || pathname.startsWith('/account/');
  const isWritingArea = pathname === '/write' || pathname.startsWith('/write/');
  const isCreativeArea = isWritingArea || pathname.startsWith('/library') || pathname.startsWith('/overview') || pathname.startsWith('/sound');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isCreativeArea) {
    return (
      <div className="writing-workspace-frame">
        <WritingRail displayName={profile.penName || profile.displayName} avatarUrl={profile.avatarUrl} />
        {isWritingArea
          ? <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
          : <main className="creative-workspace-content workspace-scrollbar"><div className="creative-workspace-inner">{children}</div></main>}
        <SoundDock enabled={soundEnabled} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-canvas p-4">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        {!isAccountArea && <WorkspaceSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />}
        <div className="min-w-0 flex-1">
          <WorkspaceHeader {...profile} showWorkspaceMenu={!isAccountArea} />
          <main className="pb-10">{children}</main>
        </div>
      </div>
      <SoundDock enabled={soundEnabled} />
    </div>
  );
}
