import React from 'react';
import { Language, Theme } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { Moon, Sun, Globe, LogOut, GraduationCap } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  studentName?: string;
  fullClass?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  studentName,
  fullClass,
  onLogout,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 liquid-glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-xs border border-zinc-800 dark:border-zinc-300">
            <GraduationCap className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white leading-tight">
                {t.schoolName}
              </h1>
              {fullClass && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-300/60 dark:border-zinc-700/60">
                  {fullClass}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              {t.academicYear}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {studentName && (
            <div className="hidden md:flex flex-col text-right ltr:text-left text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[160px]">
                {studentName}
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                {fullClass}
              </span>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium liquid-glass-interactive text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white liquid-glass-interactive transition-all cursor-pointer"
            title={theme === 'light' ? t.themeDark : t.themeLight}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-[#C5A059]" />
            )}
          </button>

          {/* Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 liquid-glass-interactive transition-all cursor-pointer"
              title={t.logout}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
