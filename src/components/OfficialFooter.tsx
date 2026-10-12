import React from 'react';
import { Language } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { ShieldCheck } from 'lucide-react';

export const OfficialFooter: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="mt-16 liquid-glass border-t border-x-0 border-b-0 text-zinc-600 dark:text-zinc-400 py-10 transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-start">
          {/* Principal Info */}
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start space-y-1">
            <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
              {t.principalTitle}
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t.principalName}
            </span>
            <span className="text-[11px] text-zinc-400">
              Al Ebtehal Kindergarten Leadership
            </span>
          </div>

          {/* Central School Identity */}
          <div className="order-1 md:order-2 flex flex-col items-center text-center space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base sm:text-lg">
              <span>{t.schoolName}</span>
            </div>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              {t.academicYear}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.allRightsReserved}</span>
            </div>
          </div>

          {/* Cluster Manager Info */}
          <div className="order-3 flex flex-col items-center md:items-end space-y-1">
            <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
              {t.clusterManagerTitle}
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t.clusterManagerName}
            </span>
            <span className="text-[11px] text-zinc-400">
              School Operations & Quality
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          دولة الإمارات العربية المتحدة · نظام تقييم ورصد المهارات الأكاديمية لمرحلة رياض الأطفال · 2026–2027
        </div>
      </div>
    </footer>
  );
};
