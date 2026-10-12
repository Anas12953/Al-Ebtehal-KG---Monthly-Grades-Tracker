import React, { useState, useEffect, useMemo } from 'react';
import { StudentRecord, Language, Theme, AdvisorFeedback } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { Header } from '../components/Header.tsx';
import { SchoolOfficialHeaderLogos } from '../components/OfficialLogos.tsx';
import { AmbientBackground } from '../components/AmbientBackground.tsx';
import { AttendanceCard } from '../components/AttendanceCard.tsx';
import { AssessmentLegend } from '../components/AssessmentLegend.tsx';
import { PerformanceChart } from '../components/PerformanceChart.tsx';
import { StandardsTable } from '../components/StandardsTable.tsx';
import { AIAdvisor } from '../components/AIAdvisor.tsx';
import { HistoricalProgress } from '../components/HistoricalProgress.tsx';
import { TeacherNotes } from '../components/TeacherNotes.tsx';
import { FahemChat } from '../components/FahemChat.tsx';
import { OfficialFooter } from '../components/OfficialFooter.tsx';
import { Sparkles, Award, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

interface DashboardPageProps {
  student: StudentRecord;
  token: string;
  onLogout: () => void;
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  token,
  onLogout,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
}) => {
  const [advisor, setAdvisor] = useState<AdvisorFeedback | null>(null);
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);

  const t = translations[lang];
  const isAr = lang === 'ar';

  // Overall student stats for quick spark cards
  const stats = useMemo(() => {
    const total = student.standards.length;
    const masteryCount = student.standards.filter((s) => s.grade === 'EX' || s.grade === 'M').length;
    const masteryPct = total > 0 ? Math.round((masteryCount / total) * 100) : 0;
    return { total, masteryCount, masteryPct };
  }, [student.standards]);

  // Load AI Advisor insights on mount
  const fetchAdvisorInsights = async () => {
    setLoadingAdvisor(true);
    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lang }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdvisor(data);
      }
    } catch (err) {
      console.error('Advisor fetch error:', err);
    } finally {
      setLoadingAdvisor(false);
    }
  };

  useEffect(() => {
    fetchAdvisorInsights();
  }, [student.emiratesId, lang]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 relative overflow-x-hidden">
      {/* Ambient Light Mesh for Layered Glass Refraction */}
      <AmbientBackground />

      {/* Official Administrative Logos Bar */}
      <SchoolOfficialHeaderLogos isDark={theme === 'dark'} />

      {/* Global Interactive Navigation Header */}
      <Header
        lang={lang}
        onToggleLang={onToggleLang}
        theme={theme}
        onToggleTheme={onToggleTheme}
        studentName={student.nameAr}
        fullClass={student.fullClass}
        onLogout={onLogout}
      />

      {/* Main Personalized Dashboard Scrollable Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Personalized Greeting Hero Card with Liquid Glass Layering */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
          {/* Edge refraction highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-subtle text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{t.academicYear} · {t.portalTitle}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                {t.welcomeGreeting}{' '}
                <span className="text-zinc-950 dark:text-white underline decoration-[#C5A059] decoration-2 underline-offset-6">
                  {student.nameAr}
                </span>
                !
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.gradeClassLabel} {student.fullClass}</span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span>{student.gradeLevel === 'KG1' ? 'الروضة الأولى' : 'الروضة الثانية'}</span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{t.lastSyncText} 28 مارس 2027</span>
                </span>
              </div>

              {/* Compact Quick Stat Indicators */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl solid-content-surface text-xs font-semibold shadow-2xs">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{isAr ? 'نسبة الإتقان العامة:' : 'Overall Mastery:'}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{stats.masteryPct}%</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl solid-content-surface text-xs font-semibold shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isAr ? 'المعايير المعتمدة:' : 'Evaluated Standards:'}</span>
                  <span className="text-zinc-950 dark:text-white font-extrabold">{stats.total}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl solid-content-surface text-xs font-semibold shadow-2xs">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isAr ? 'حالة الفصل 2:' : 'Term 2 Status:'}</span>
                  <span className="text-zinc-950 dark:text-white font-extrabold">{isAr ? 'مكتمل ومعتمد' : 'Verified'}</span>
                </div>
              </div>
            </div>

            {/* School Leadership Signature Box */}
            <div className="hidden lg:flex flex-col items-end text-end text-xs liquid-glass-subtle p-4 rounded-2xl space-y-1.5 max-w-xs shrink-0">
              <span className="text-zinc-400 font-medium">{t.principalTitle}</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{t.principalName}</span>
              <span className="text-zinc-400 mt-1 font-medium">{t.clusterManagerTitle}</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{t.clusterManagerName}</span>
            </div>
          </div>
        </div>

        {/* Attendance Card with Radial Gauge */}
        <AttendanceCard status={student.attendanceStatus} lang={lang} />

        {/* Academic Assessment Scale Legend */}
        <AssessmentLegend lang={lang} />

        {/* Performance Overview Chart & Proportions */}
        <PerformanceChart
          student={student}
          standards={student.standards}
          advisor={advisor}
          lang={lang}
        />

        {/* AI Learning Advisor */}
        <AIAdvisor
          advisor={advisor}
          loading={loadingAdvisor}
          onRefresh={fetchAdvisorInsights}
          lang={lang}
        />

        {/* Historical Improvement & Longitudinal Progress Journey */}
        <HistoricalProgress
          snapshots={student.historicalSnapshots}
          lang={lang}
        />

        {/* Detailed Standards Table with Progress Meters & Rich Sorting */}
        <StandardsTable standards={student.standards} lang={lang} />

        {/* Teacher Notes & Translation */}
        <TeacherNotes
          originalNote={student.teacherNotes}
          token={token}
          lang={lang}
        />
      </main>

      {/* Fahem Intelligent Assistant Floating Widget */}
      <FahemChat student={student} token={token} lang={lang} />

      {/* Official Dashboard Footer */}
      <OfficialFooter lang={lang} />
    </div>
  );
};
