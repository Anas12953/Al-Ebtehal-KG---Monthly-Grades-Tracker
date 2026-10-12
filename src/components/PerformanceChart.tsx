import React, { useState, useMemo } from 'react';
import { AssessmentGrade, AssessmentStandard, Language, SubjectDomain, AdvisorFeedback, StudentRecord } from '../types/index.ts';
import { DOMAINS, GRADE_DEFINITIONS } from '../data/curriculum.ts';
import { translations } from '../utils/i18n.ts';
import { Download, PieChart, BarChart3, Layers, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { generateStudentPdfReport } from '../utils/pdfGenerator.ts';

interface PerformanceChartProps {
  student: StudentRecord;
  standards: AssessmentStandard[];
  advisor: AdvisorFeedback | null;
  lang: Language;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  student,
  standards,
  advisor,
  lang,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain | 'all'>('all');
  const [chartView, setChartView] = useState<'all' | 'donut' | 'domains'>('all');
  const [activeSegment, setActiveSegment] = useState<AssessmentGrade | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const t = translations[lang];
  const isAr = lang === 'ar';

  // Filtered standards according to domain tab
  const filteredStandards = useMemo(() => {
    if (selectedDomain === 'all') return standards;
    return standards.filter((s) => s.domain === selectedDomain);
  }, [standards, selectedDomain]);

  // Aggregate counts
  const counts = useMemo(() => {
    const res: Record<AssessmentGrade, number> = { EX: 0, M: 0, D: 0, E: 0 };
    filteredStandards.forEach((s) => {
      res[s.grade]++;
    });
    return res;
  }, [filteredStandards]);

  const total = filteredStandards.length;
  const masteryCount = counts.EX + counts.M;
  const masteryPercentage = total > 0 ? Math.round((masteryCount / total) * 100) : 0;

  // Domain breakdown calculation across all 6 domains
  const domainBreakdown = useMemo(() => {
    return Object.entries(DOMAINS).map(([key, meta]) => {
      const domStandards = standards.filter((s) => s.domain === key);
      const domCounts: Record<AssessmentGrade, number> = { EX: 0, M: 0, D: 0, E: 0 };
      domStandards.forEach((s) => {
        domCounts[s.grade]++;
      });
      const domTotal = domStandards.length;
      const domMastery = domCounts.EX + domCounts.M;
      const domPct = domTotal > 0 ? Math.round((domMastery / domTotal) * 100) : 0;
      return {
        key: key as SubjectDomain,
        meta,
        counts: domCounts,
        total: domTotal,
        masteryCount: domMastery,
        masteryPct: domPct,
      };
    });
  }, [standards]);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateStudentPdfReport(student, advisor, lang);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const domainTabs: { key: SubjectDomain | 'all'; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'كافة المجالات', labelEn: 'All Domains' },
    { key: 'arabic', labelAr: DOMAINS.arabic.nameAr, labelEn: DOMAINS.arabic.nameEn },
    { key: 'english', labelAr: DOMAINS.english.nameAr, labelEn: DOMAINS.english.nameEn },
    { key: 'math', labelAr: DOMAINS.math.nameAr, labelEn: DOMAINS.math.nameEn },
    { key: 'science', labelAr: DOMAINS.science.nameAr, labelEn: DOMAINS.science.nameEn },
    { key: 'islamic', labelAr: DOMAINS.islamic.nameAr, labelEn: DOMAINS.islamic.nameEn },
    { key: 'national', labelAr: DOMAINS.national.nameAr, labelEn: DOMAINS.national.nameEn },
  ];

  const gradeItems: { grade: AssessmentGrade; config: typeof GRADE_DEFINITIONS.EX; count: number }[] = [
    { grade: 'EX', config: GRADE_DEFINITIONS.EX, count: counts.EX },
    { grade: 'M', config: GRADE_DEFINITIONS.M, count: counts.M },
    { grade: 'D', config: GRADE_DEFINITIONS.D, count: counts.D },
    { grade: 'E', config: GRADE_DEFINITIONS.E, count: counts.E },
  ];

  // SVG Donut Calculations
  const donutRadius = 72;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * donutRadius;
  let accumulatedOffset = 0;

  const donutSegments = gradeItems.map(({ grade, config, count }) => {
    const fraction = total > 0 ? count / total : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const offset = -accumulatedOffset;
    accumulatedOffset += fraction * circumference;
    return {
      grade,
      config,
      count,
      fraction,
      percentage: Math.round(fraction * 100),
      strokeDasharray,
      offset,
    };
  });

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 space-y-6">
      {/* Refraction highlight shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100">
              <PieChart className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                {t.overviewTitle}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.overviewSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & PDF Download Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/80 border border-zinc-300/60 dark:border-zinc-700/60 text-xs">
            <button
              onClick={() => setChartView('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                chartView === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {isAr ? 'عرض شامل' : 'Combined'}
            </button>
            <button
              onClick={() => setChartView('donut')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                chartView === 'donut'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {isAr ? 'الرسم الدائري' : 'Donut'}
            </button>
            <button
              onClick={() => setChartView('domains')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                chartView === 'domains'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {isAr ? 'المجالات' : 'Domains'}
            </button>
          </div>

          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#C5A059] dark:text-[#C5A059]" />
            <span>{isGeneratingPdf ? t.generatingPdf : t.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Domain Interactive Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {domainTabs.map((tab) => {
          const isActive = selectedDomain === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedDomain(tab.key)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-950 font-semibold'
                  : 'liquid-glass-interactive text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Chart Visualizations Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Donut Chart */}
        {(chartView === 'all' || chartView === 'donut') && (
          <div
            className={`${
              chartView === 'donut' ? 'lg:col-span-12' : 'lg:col-span-5'
            } solid-content-surface rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-xs`}
          >
            <div className="w-full flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-[#C5A059]" />
                <span>{isAr ? 'النسبة الإجمالية للإتقان' : 'Overall Mastery Proportions'}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                {total} {t.standardsUnit}
              </span>
            </div>

            {/* SVG Donut */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-3">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full -rotate-90 transform overflow-visible"
                role="img"
                aria-label={`Donut chart showing student performance across ${total} standards`}
              >
                {/* Track Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={donutRadius}
                  className="stroke-zinc-100 dark:stroke-zinc-800/80"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* Segments */}
                {total > 0 &&
                  donutSegments.map((seg) => {
                    if (seg.count === 0) return null;
                    const isHovered = activeSegment === seg.grade;
                    return (
                      <circle
                        key={seg.grade}
                        cx="100"
                        cy="100"
                        r={donutRadius}
                        stroke={seg.config.color}
                        strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.offset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveSegment(seg.grade)}
                        onMouseLeave={() => setActiveSegment(null)}
                      />
                    );
                  })}
              </svg>

              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                  {masteryPercentage}%
                </span>
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  {isAr ? 'نسبة الإتقان والتفوق' : 'Mastery & Exceeding'}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                  ({masteryCount} / {total})
                </span>
              </div>
            </div>

            {/* Interactive Donut Legend Bar */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
              {donutSegments.map((seg) => (
                <div
                  key={seg.grade}
                  onMouseEnter={() => setActiveSegment(seg.grade)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    activeSegment === seg.grade
                      ? 'bg-zinc-100 dark:bg-zinc-800 scale-105'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: seg.config.color }}
                    />
                    <span>{seg.grade}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                    {seg.count} ({seg.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right: Domain Comparison Progress Bars */}
        {(chartView === 'all' || chartView === 'domains') && (
          <div
            className={`${
              chartView === 'domains' ? 'lg:col-span-12' : 'lg:col-span-7'
            } solid-content-surface rounded-2xl p-6 flex flex-col justify-between shadow-xs space-y-4`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#C5A059]" />
                <span>{isAr ? 'مقارنة مجالات التعلم الستة' : '6 Learning Domains Comparison'}</span>
              </span>
              <span className="text-[11px] text-zinc-400">
                {isAr ? 'نسبة المعايير المتقنة لكل مادة' : 'Mastery % per subject'}
              </span>
            </div>

            {/* Domain Progress List */}
            <div className="space-y-3.5">
              {domainBreakdown.map((dom) => {
                return (
                  <div key={dom.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: dom.meta.color }}
                        />
                        {isAr ? dom.meta.nameAr : dom.meta.nameEn}
                      </span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-zinc-400">
                          {dom.masteryCount}/{dom.total} {isAr ? 'معايير' : 'standards'}
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 min-w-[36px] text-end">
                          {dom.masteryPct}%
                        </span>
                      </div>
                    </div>

                    {/* Stacked Proportional Bar for this domain */}
                    <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex gap-0.5 p-0.5 border border-zinc-200/80 dark:border-zinc-700/80">
                      {dom.total > 0 ? (
                        (['EX', 'M', 'D', 'E'] as const).map((grade) => {
                          const count = dom.counts[grade];
                          if (count === 0) return null;
                          const pct = (count / dom.total) * 100;
                          return (
                            <div
                              key={grade}
                              style={{
                                width: `${pct}%`,
                                backgroundColor: GRADE_DEFINITIONS[grade].color,
                              }}
                              className="h-full rounded-full transition-all duration-300"
                              title={`${grade}: ${count}`}
                            />
                          );
                        })
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                {isAr
                  ? 'يعكس الشريط الملون نسبة التوزيع بين التفوق (أخضر)، الإتقان (أزرق)، التطور (أصفر)، والنمو (أحمر).'
                  : 'Colored bars illustrate distribution among Exceeding (Green), Mastery (Blue), Developing (Yellow), and Emerging (Red).'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Four Category Stat Cards with Spark Rings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {gradeItems.map(({ grade, config, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div
              key={grade}
              className="liquid-glass-interactive rounded-2xl p-4 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-7 h-7 rounded-xl text-white text-xs font-extrabold flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: config.color }}
                >
                  {grade}
                </span>
                <span className="text-xs font-bold text-zinc-950 dark:text-white">
                  {pct}%
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                  {isAr ? config.nameAr : config.nameEn}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                  {count} {t.standardsUnit}
                </span>
              </div>

              {/* Mini Spark Gauge Bar */}
              <div className="w-full h-1.5 bg-zinc-200/80 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: config.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
