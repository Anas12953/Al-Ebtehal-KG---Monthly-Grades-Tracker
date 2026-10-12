import React from 'react';
import { Language } from '../types/index.ts';
import { GRADE_DEFINITIONS } from '../data/curriculum.ts';

export const AssessmentLegend: React.FC<{ lang: Language }> = ({ lang }) => {
  const isAr = lang === 'ar';

  const grades = [
    {
      ...GRADE_DEFINITIONS.EX,
      level: 4,
      tagBg: 'bg-emerald-600',
      badgeBorder: 'border-emerald-500/30',
      title: isAr ? 'يفوق التوقعات' : 'Exceeding',
      desc: isAr ? 'يظهر إتقاناً ومبادرة تفوق المستوى المتوقع لعمره' : 'Exceeds age-appropriate developmental milestones',
    },
    {
      ...GRADE_DEFINITIONS.M,
      level: 3,
      tagBg: 'bg-blue-600',
      badgeBorder: 'border-blue-500/30',
      title: isAr ? 'متمكن' : 'Mastery',
      desc: isAr ? 'حقق المعيار التعليمي باستقلالية وثقة تامة' : 'Consistently achieves standard independently',
    },
    {
      ...GRADE_DEFINITIONS.D,
      level: 2,
      tagBg: 'bg-amber-600',
      badgeBorder: 'border-amber-500/30',
      title: isAr ? 'في طور التطور' : 'Developing',
      desc: isAr ? 'يتقدم نحو تحقيق المعيار مع بعض التوجيه والممارسة' : 'Progressing toward standard with guidance',
    },
    {
      ...GRADE_DEFINITIONS.E,
      level: 1,
      tagBg: 'bg-rose-600',
      badgeBorder: 'border-rose-500/30',
      title: isAr ? 'في مرحلة النمو' : 'Emerging',
      desc: isAr ? 'بدأ اكتساب المهارة ويحتاج إلى تدريب مستمر ودعم' : 'Initial acquisition stage requiring structured practice',
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {isAr ? 'دليل مستويات التقييم المعتمدة' : 'Official Assessment Scale'}
        </h4>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          {isAr ? 'معايير وزارة التربية والتعليم' : 'UAE Ministry Rubric'}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {grades.map((item) => (
          <div
            key={item.code}
            className="liquid-glass-interactive p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 space-y-3"
          >
            {/* Edge refraction highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className={`w-8 h-8 rounded-xl ${item.tagBg} text-white font-extrabold text-xs flex items-center justify-center shadow-xs border ${item.badgeBorder}`}>
                {item.code}
              </span>

              {/* 4-dot Level Indicator */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((dot) => (
                  <span
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full ${
                      dot <= item.level
                        ? item.tagBg
                        : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                {item.title}
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
