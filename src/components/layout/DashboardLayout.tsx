
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppNavbar } from './AppNavbar';
import { useAvatarCheck } from '@/hooks/useAvatarCheck';
import ProfilePhotoPrompt from '@/components/profile/ProfilePhotoPrompt';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { avatarUrl, loading, updateAvatar } = useAvatarCheck();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppNavbar />
          <main className="flex-1 p-6 overflow-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      {/* Pop-up global para foto de perfil */}
      {!loading && !avatarUrl && (
        <ProfilePhotoPrompt onImageUpdate={updateAvatar} />
      )}
    </SidebarProvider>
  );
}
