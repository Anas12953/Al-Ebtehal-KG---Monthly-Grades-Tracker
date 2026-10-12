import React, { useState } from 'react';
import { AdvisorFeedback, Language } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { Sparkles, RefreshCw, CheckCircle2, Target, Home, Shield, Lightbulb, Compass } from 'lucide-react';

interface AIAdvisorProps {
  advisor: AdvisorFeedback | null;
  loading: boolean;
  onRefresh: () => void;
  lang: Language;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  advisor,
  loading,
  onRefresh,
  lang,
}) => {
  const [completedActivities, setCompletedActivities] = useState<Record<number, boolean>>({});
  const t = translations[lang];
  const isAr = lang === 'ar';

  const narrativeText = isAr
    ? advisor?.narrativeAr || ''
    : advisor?.narrativeEn || advisor?.narrativeAr || '';

  const narrativeLines = narrativeText.split('\n').filter((l) => l.trim().length > 0);

  const toggleActivity = (idx: number) => {
    setCompletedActivities((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 space-y-6">
      {/* Refraction highlight shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                {t.aiAdvisorTitle}
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-300/60 dark:border-zinc-700/60">
                {t.aiAdvisorBadge}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isAr
                ? 'توجيهات تربوية ذكية مخصصة لولي الأمر بالاستناد إلى تقييمات المعايير الحالية'
                : 'Targeted educational guidance for parents based on real verified curriculum standards'}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-white transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#C5A059] ${loading ? 'animate-spin' : ''}`} />
          <span>{t.regenerateAnalysis}</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          </div>
        </div>
      ) : advisor ? (
        <div className="space-y-6">
          {/* Narrative Paragraph on Solid Surface for WCAG AA readability */}
          <div className="solid-content-surface rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <span>{isAr ? 'التقرير التشخيصي والتوجيهي' : 'Diagnostic Narrative & Guidance'}</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
              {narrativeLines.map((line, idx) => (
                <p key={idx} className="flex items-baseline gap-2.5">
                  <span className="text-[#C5A059] font-bold text-xs select-none">
                    •
                  </span>
                  <span>{line}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Strengths & Growth Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths Card */}
            <div className="solid-content-surface rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.aiAdvisorStrengths}</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                {advisor.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas Card */}
            <div className="solid-content-surface rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-xs">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t.aiAdvisorGrowth}</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                {advisor.growthAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Home Enrichment Activities */}
          {advisor.recommendations && advisor.recommendations.length > 0 && (
            <div className="solid-content-surface rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-xs">
                  <Home className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.aiAdvisorHomeActivities}</span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {isAr ? 'أنشطة تدريبية وتفاعلية منزلية' : 'Home-based interactive tasks'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {advisor.recommendations.map((act: string, idx: number) => {
                  const isDone = completedActivities[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleActivity(idx)}
                      className={`text-start p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                          : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-bold text-zinc-400">
                          {isAr ? `تمرين ${idx + 1}` : `Activity ${idx + 1}`}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-zinc-300 dark:border-zinc-700'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed font-medium">
                        {act}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Child Data Privacy Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500 px-1">
            <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.aiPrivacyNotice}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
