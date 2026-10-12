import React from 'react';
import { AttendanceStatus, Language } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { CheckCircle2, AlertTriangle, XCircle, Info, Activity } from 'lucide-react';

interface AttendanceCardProps {
  status: AttendanceStatus;
  lang: Language;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ status, lang }) => {
  const t = translations[lang];

  const getStatusConfig = () => {
    switch (status) {
      case 'ملتزم':
        return {
          label: t.attendanceCommitted,
          gaugePercent: 96,
          strokeColor: '#16A34A',
          bgColor: 'text-emerald-600 dark:text-emerald-400',
          badgeClass: 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          note: t.attendanceNoteCommitted,
          tierAr: 'التزام كامل ومستمر',
          tierEn: 'Full & Consistent Commitment',
        };
      case 'ملتزم جزئياً':
        return {
          label: t.attendancePartiallyCommitted,
          gaugePercent: 65,
          strokeColor: '#D97706',
          bgColor: 'text-amber-600 dark:text-amber-400',
          badgeClass: 'text-amber-800 dark:text-amber-300 bg-amber-500/10 border-amber-500/20',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          note: t.attendanceNotePartial,
          tierAr: 'التزام جزئي يتطلب متابعة',
          tierEn: 'Partial Commitment - Follow-up Advised',
        };
      case 'غير ملتزم':
        return {
          label: t.attendanceNotCommitted,
          gaugePercent: 35,
          strokeColor: '#DC2626',
          bgColor: 'text-rose-600 dark:text-rose-400',
          badgeClass: 'text-rose-800 dark:text-rose-300 bg-rose-500/10 border-rose-500/20',
          icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
          note: t.attendanceNoteUncommitted,
          tierAr: 'انقطاع يستوجب التنسيق مع الإدارة',
          tierEn: 'Frequent Absence - Action Needed',
        };
    }
  };

  const config = getStatusConfig();
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (config.gaugePercent / 100) * circumference;

  return (
    <div className="liquid-glass rounded-2xl p-6 relative overflow-hidden transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left side: Context and Description */}
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-2xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 shrink-0">
            <Activity className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                {t.attendanceSectionTitle}
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badgeClass}`}>
                {config.icon}
                <span>{config.label}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              {config.note}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{t.attendancePercentageUnavailable}</span>
            </div>
          </div>
        </div>

        {/* Right side: Compact Radial Progress Meter */}
        <div className="flex items-center gap-4 self-center lg:self-auto px-5 py-3 rounded-2xl liquid-glass-subtle shrink-0">
          {/* Circular SVG Gauge */}
          <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              {/* Background Track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={config.strokeColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                {config.label}
              </span>
            </div>
          </div>

          <div className="text-start space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              {lang === 'ar' ? 'مستوى الانضباط' : 'Commitment Tier'}
            </span>
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {lang === 'ar' ? config.tierAr : config.tierEn}
            </div>
            <span className="inline-block text-[10px] text-zinc-400">
              {lang === 'ar' ? 'سجل الفصل الدراسي 2' : 'Term 2 Official Record'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
