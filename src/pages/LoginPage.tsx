import React, { useState } from 'react';
import { Language, Theme, UserSession } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { LogoTarbia, LogoMithaq } from '../components/OfficialLogos.tsx';
import { AmbientBackground } from '../components/AmbientBackground.tsx';
import {
  ShieldCheck,
  UserCheck,
  Globe,
  Sun,
  Moon,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
}) => {
  const [emiratesId, setEmiratesId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[lang];
  const isAr = lang === 'ar';

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!emiratesId.trim()) {
      setErrorMessage(
        isAr
          ? 'يرجى إدخال رقم الهوية الإماراتية الخاص بالطالب.'
          : 'Please enter the student Emirates ID.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emiratesId: emiratesId.trim(),
        }),
      });

      if (!res.ok) {
        setErrorMessage(
          isAr
            ? 'رقم الهوية غير مسجل في سجلات روضة الابتهال للعام الدراسي 2026–2027. يرجى التحقق من الرقم والمحاولة مجدداً.'
            : 'Emirates ID not found in Al Ebtehal Kindergarten 2026–2027 records. Please check the ID and try again.'
        );
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (data.token && data.student) {
        onLoginSuccess(data);
      } else {
        setErrorMessage(
          isAr
            ? 'تعذر التحقق من السجل الأكاديمي. يرجى المحاولة مرة أخرى.'
            : 'Failed to verify student record. Please try again.'
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(
        isAr
          ? 'حدث خطأ في الاتصال بالبوابة. يرجى المحاولة بعد قليل.'
          : 'Connection error. Please try again shortly.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 relative overflow-x-hidden">
      {/* Ambient Light Mesh for Liquid Glass Refraction */}
      <AmbientBackground />

      {/* Top Banner with Official Administrative Logos in Opposite Corners */}
      <header className="w-full px-4 sm:px-10 py-3.5 flex items-center justify-between liquid-glass-nav relative z-10">
        {/* Left Corner: Official Logo 1 */}
        <div className="flex items-center gap-2">
          <LogoTarbia inverted={theme === 'dark'} className="h-10 sm:h-12" />
        </div>

        {/* Center: UAE & Ministry Identity */}
        <div className="hidden sm:flex flex-col items-center text-center">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-wider">
            دولة الإمارات العربية المتحدة
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            United Arab Emirates · Ministry of Education
          </span>
        </div>

        {/* Right Corner: Official Logo 2 */}
        <div className="flex items-center gap-2">
          <LogoMithaq inverted={theme === 'dark'} className="h-10 sm:h-12" />
        </div>
      </header>

      {/* Main Login Experience */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Controls: Language and Theme pills */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium liquid-glass-interactive text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-300 liquid-glass-interactive transition-all cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-[#C5A059]" />
              )}
            </button>
          </div>

          {/* School Name & Welcome Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-sm border border-zinc-800 dark:border-zinc-300">
              <GraduationCap className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              {t.schoolName}
            </h2>
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              {t.loginSubtitle}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              {t.loginDescription}
            </p>
          </div>

          {/* Login Card Container with Liquid Glass Aesthetic */}
          <div className="liquid-glass p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300 space-y-5">
            {/* Edge refraction highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl solid-content-surface text-zinc-900 dark:text-zinc-100 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Only Field: Emirates ID */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {t.emiratesIdLabel}
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-zinc-400 absolute start-3.5 top-3.5" />
                  <input
                    type="text"
                    value={emiratesId}
                    onChange={(e) => setEmiratesId(e.target.value)}
                    placeholder="784-202X-XXXXXXX-X"
                    className="w-full ps-10 pe-4 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-300/80 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition-all font-mono"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {isAr
                    ? 'أدخل رقم الهوية الإماراتية الخاص بطفلك المكون من 15 رقماً (مع أو بدون فواصل).'
                    : 'Enter your child’s 15-digit Emirates ID (with or without dashes).'}
                </p>
              </div>

              {/* Secure Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 active:scale-[0.99] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>{isLoading ? t.loggingIn : t.loginButton}</span>
              </button>
            </form>

            {/* Portal Framework Stat Chips */}
            <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 grid grid-cols-3 gap-2 text-center">
              <div className="solid-content-surface p-2 rounded-xl">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A059] mx-auto mb-1" />
                <span className="block text-[10px] font-bold text-zinc-900 dark:text-white">6 مجالات</span>
                <span className="block text-[9px] text-zinc-400">Domains</span>
              </div>
              <div className="solid-content-surface p-2 rounded-xl">
                <Layers className="w-3.5 h-3.5 text-blue-600 mx-auto mb-1" />
                <span className="block text-[10px] font-bold text-zinc-900 dark:text-white">13 معياراً</span>
                <span className="block text-[9px] text-zinc-400">Standards</span>
              </div>
              <div className="solid-content-surface p-2 rounded-xl">
                <Award className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
                <span className="block text-[10px] font-bold text-zinc-900 dark:text-white">فصل 1 و 2</span>
                <span className="block text-[9px] text-zinc-400">Terms</span>
              </div>
            </div>

            <div className="pt-1 text-center">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                {isAr
                  ? 'سجل آمن مشفر لمتابعة أداء الطالب · روضة الابتهال'
                  : 'Encrypted official student portal · Al Ebtehal Kindergarten'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Official Bottom Line with Liquid Glass */}
      <footer className="py-4 text-center text-[11px] text-zinc-500 dark:text-zinc-400 liquid-glass border-t border-x-0 border-b-0 relative z-10">
        روضة الابتهال · العام الدراسي 2026–2027 · مديرة الروضة: الأستاذة خديجة الشحي
      </footer>
    </div>
  );
};
