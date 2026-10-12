import React, { useState } from 'react';
import { ProgressSnapshot, Language } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { TrendingUp, Clock, Calendar, CheckCircle2, ArrowUpRight, Award, Compass } from 'lucide-react';
import { GRADE_DEFINITIONS } from '../data/curriculum.ts';

interface HistoricalProgressProps {
  snapshots?: ProgressSnapshot[];
  lang: Language;
}

export const HistoricalProgress: React.FC<HistoricalProgressProps> = ({
  snapshots = [],
  lang,
}) => {
  const [activeTerm, setActiveTerm] = useState<'term1' | 'term2'>('term2');
  const t = translations[lang];
  const isAr = lang === 'ar';

  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="liquid-glass rounded-3xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 flex items-center justify-center mx-auto text-zinc-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {t.progressJourneyTitle}
        </h4>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          {isAr
            ? 'سجل التقييمات التاريخية محفوظ وسيبدأ برصد المقارنات بمجرد إدراج التقييمات اللاحقة المعتمدة.'
            : 'Historical checkpoint records will display comparisons once subsequent official evaluation cycles are added.'}
        </p>
      </div>
    );
  }

  const term1 = snapshots.find((s) => s.term === 'term1') || snapshots[0];
  const term2 = snapshots.find((s) => s.term === 'term2') || snapshots[snapshots.length - 1];

  const currentSnapshot = activeTerm === 'term1' ? term1 : term2;
  const currentCounts = currentSnapshot.counts;
  const total = currentCounts.EX + currentCounts.M + currentCounts.D + currentCounts.E;

  const term1Mastery = term1.counts.EX + term1.counts.M;
  const term2Mastery = term2.counts.EX + term2.counts.M;
  const masteryDelta = term2Mastery - term1Mastery;
  const masteryGrowthRate = term1Mastery > 0 ? Math.round((masteryDelta / term1Mastery) * 100) : 0;

  // Chart coordinates for 2-term area comparison
  // Height: 120px, Width: 100% SVG
  const t1Pct = Math.round((term1Mastery / (term1.counts.EX + term1.counts.M + term1.counts.D + term1.counts.E)) * 100);
  const t2Pct = Math.round((term2Mastery / (term2.counts.EX + term2.counts.M + term2.counts.D + term2.counts.E)) * 100);

  // SVG Area path points (x: 40 to 360, y inverted: 120 -> 20)
  const y1 = 120 - (t1Pct / 100) * 80;
  const y2 = 120 - (t2Pct / 100) * 80;

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 space-y-6">
      {/* Refraction highlight shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

      {/* Title & Timeline controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100">
            <TrendingUp className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
              {t.progressJourneyTitle}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.progressJourneySubtitle}
            </p>
          </div>
        </div>

        {/* Term Checkpoint Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-xl border border-zinc-300/60 dark:border-zinc-700/60">
          <button
            onClick={() => setActiveTerm('term1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTerm === 'term1'
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'الفصل 1 (تأسيسي)' : 'Term 1 (Baseline)'}
          </button>
          <button
            onClick={() => setActiveTerm('term2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTerm === 'term2'
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'الفصل 2 (شامل حالي)' : 'Term 2 (Current)'}
          </button>
        </div>
      </div>

      {/* Longitudinal Trajectory Banner with Trend Area Graph */}
      <div className="solid-content-surface rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {isAr ? 'مسار نمو الإتقان الأكاديمي' : 'Academic Mastery Trajectory'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>
                  {masteryDelta >= 0 ? `+${masteryGrowthRate}%` : `${masteryGrowthRate}%`}{' '}
                  {isAr ? 'نمو إيجابي' : 'Growth'}
                </span>
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              {term1Mastery} → {term2Mastery}{' '}
              <span className="text-xs font-normal text-zinc-500">
                {isAr ? 'معايير متقونة ومتميزة' : 'mastered standards'}
              </span>
            </div>
          </div>

          {/* Stepper Timeline Badges */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isAr ? 'الفصل 1: 96% التزام' : 'Term 1: 96% Comm.'}</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">→</span>
            <div className="flex items-center gap-1.5 text-zinc-900 dark:text-white font-bold">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>{isAr ? 'الفصل 2: تقييم شامل' : 'Term 2: Current'}</span>
            </div>
          </div>
        </div>

        {/* SVG Trend Area Graph */}
        <div className="w-full h-32 sm:h-36 relative mt-2 pt-2">
          <svg
            viewBox="0 0 400 130"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            role="img"
            aria-label="Progress graph comparing Term 1 and Term 2 mastery"
          >
            <defs>
              <linearGradient id="progressAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid Guideline */}
            <line x1="40" y1="40" x2="360" y2="40" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeDasharray="3 3" />
            <line x1="40" y1="80" x2="360" y2="80" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeDasharray="3 3" />
            <line x1="40" y1="120" x2="360" y2="120" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" />

            {/* Gradient Area */}
            <path
              d={`M 50 120 L 50 ${y1} C 150 ${y1}, 250 ${y2}, 350 ${y2} L 350 120 Z`}
              fill="url(#progressAreaGrad)"
            />

            {/* Curve Line */}
            <path
              d={`M 50 ${y1} C 150 ${y1}, 250 ${y2}, 350 ${y2}`}
              fill="none"
              stroke="#C5A059"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Point Node 1 (Term 1) */}
            <g className="cursor-pointer" onClick={() => setActiveTerm('term1')}>
              <circle cx="50" cy={y1} r="7" className="fill-white dark:fill-zinc-900 stroke-[#C5A059]" strokeWidth="3" />
              <text x="50" y={y1 - 14} textAnchor="middle" className="text-[11px] font-bold fill-zinc-900 dark:fill-white">
                {t1Pct}%
              </text>
              <text x="50" y="132" textAnchor="middle" className="text-[10px] font-semibold fill-zinc-500">
                {isAr ? 'الفصل 1' : 'Term 1'}
              </text>
            </g>

            {/* Data Point Node 2 (Term 2) */}
            <g className="cursor-pointer" onClick={() => setActiveTerm('term2')}>
              <circle cx="350" cy={y2} r="8" className="fill-[#C5A059] stroke-white dark:stroke-zinc-900" strokeWidth="2.5" />
              <text x="350" y={y2 - 14} textAnchor="middle" className="text-[11px] font-extrabold fill-zinc-950 dark:fill-white">
                {t2Pct}%
              </text>
              <text x="350" y="132" textAnchor="middle" className="text-[10px] font-semibold fill-zinc-900 dark:fill-white">
                {isAr ? 'الفصل 2 (الحالي)' : 'Term 2 (Now)'}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Active Checkpoint Details & Comparison Grid */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-1">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>{isAr ? currentSnapshot.termNameAr : currentSnapshot.termNameEn}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {new Date(currentSnapshot.timestamp).toLocaleDateString(isAr ? 'ar-AE' : 'en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* 4 Grade Delta Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['EX', 'M', 'D', 'E'] as const).map((grade) => {
            const currentCount = currentCounts[grade];
            const prevCount = term1.counts[grade];
            const delta = currentCount - prevCount;
            const config = GRADE_DEFINITIONS[grade];

            return (
              <div
                key={grade}
                className="liquid-glass-interactive rounded-2xl p-4 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-7 h-7 rounded-xl text-white text-xs font-bold flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: config.color }}
                  >
                    {grade}
                  </span>
                  {activeTerm === 'term2' && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        delta > 0 && (grade === 'EX' || grade === 'M')
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                          : delta < 0 && (grade === 'D' || grade === 'E')
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                          : delta === 0
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta === 0 ? '±0' : delta}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-lg font-bold text-zinc-950 dark:text-white">
                    {currentCount}{' '}
                    <span className="text-[11px] font-normal text-zinc-500">
                      {t.standardsUnit}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600 dark:text-zinc-300 block truncate">
                    {isAr ? config.nameAr : config.nameEn}
                  </span>
                </div>

                {/* Comparative Mini Dual-Bar */}
                <div className="pt-1 space-y-1 text-[10px] text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span>{isAr ? 'فصل 1' : 'T1'}: {prevCount}</span>
                    <span>{isAr ? 'فصل 2' : 'T2'}: {term2.counts[grade]}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-0.5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${total > 0 ? (currentCount / total) * 100 : 0}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
