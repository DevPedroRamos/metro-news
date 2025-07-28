import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useSidebar } from '@/components/ui/sidebar';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Button
      variant="ghost"
      size={isCollapsed ? "icon" : "sm"}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`${isCollapsed ? 'w-10 h-10' : 'w-full justify-start px-3 py-2 h-auto'} 
        transition-all duration-300 hover:scale-105 hover:shadow-lg
        bg-gradient-to-r from-purple-500/10 to-blue-500/10 
        hover:from-purple-500/20 hover:to-blue-500/20
        border border-purple-200/20 dark:border-purple-700/20
        group relative overflow-hidden`}
      title={isCollapsed ? "Alternar tema" : undefined}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 
        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      
      <div className="relative flex items-center">
        <div className="relative">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 
            text-yellow-500 drop-shadow-sm" />
          <Moon className="absolute top-0 left-0 h-4 w-4 rotate-90 scale-0 transition-all duration-500 
            dark:rotate-0 dark:scale-100 text-blue-400 drop-shadow-sm" />
        </div>
        {!isCollapsed && (
          <>
            <span className="ml-3 font-medium">Alternar tema</span>
            <Palette className="ml-auto h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </div>
    </Button>
  );
}