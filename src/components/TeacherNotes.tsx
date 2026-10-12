import React, { useState } from 'react';
import { Language } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { MessageSquareQuote, Languages, Loader2, CheckCircle2, UserCheck } from 'lucide-react';

interface TeacherNotesProps {
  originalNote: string;
  token?: string;
  lang: Language;
}

export const TeacherNotes: React.FC<TeacherNotesProps> = ({
  originalNote,
  token,
  lang,
}) => {
  const [viewMode, setViewMode] = useState<'original' | 'translated'>('original');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const t = translations[lang];
  const isAr = lang === 'ar';

  const handleToggleTranslation = async () => {
    if (viewMode === 'original') {
      if (!translatedText && token) {
        setIsTranslating(true);
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: originalNote }),
          });
          const data = await res.json();
          if (data.translatedText) {
            setTranslatedText(data.translatedText);
          }
        } catch (err) {
          console.error('Translation error:', err);
        } finally {
          setIsTranslating(false);
        }
      }
      setViewMode('translated');
    } else {
      setViewMode('original');
    }
  };

  const displayText =
    viewMode === 'translated' && translatedText ? translatedText : originalNote;
  const isTextArabic = viewMode === 'original';

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 space-y-5">
      {/* Refraction highlight shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100">
            <MessageSquareQuote className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
              {t.teacherNotesTitle}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.teacherNotesSubtitle}
            </p>
          </div>
        </div>

        {/* Translation Toggle Button */}
        <button
          onClick={handleToggleTranslation}
          disabled={isTranslating}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-white transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50 shadow-2xs"
        >
          {isTranslating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
          ) : (
            <Languages className="w-3.5 h-3.5 text-[#C5A059]" />
          )}
          <span>
            {viewMode === 'original' ? t.viewTranslation : t.viewOriginal}
          </span>
        </button>
      </div>

      {/* Solid High-Contrast Note Container */}
      <div className="solid-content-surface rounded-2xl p-6 shadow-xs space-y-4">
        <p
          className={`text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed font-medium ${
            isTextArabic ? 'text-right dir-rtl font-arabic' : 'text-left dir-ltr'
          }`}
          dir={isTextArabic ? 'rtl' : 'ltr'}
        >
          {displayText}
        </p>

        {/* Verification and Signature Line */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#C5A059]" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {isAr ? 'معلمة الفصل ومعتمدة التقييم الأكاديمي' : 'Class Teacher & Certified Evaluator'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'ملاحظة تربوية رسمية معتمدة' : 'Official Verified Pedagogical Note'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
