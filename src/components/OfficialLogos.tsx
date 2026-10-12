import React from 'react';

/**
 * Official Administrative Logo 1:
 * "تربية وتعليم." — Ministry of Education identity image
 * Loads from /logos/tarbia-taleem.png (or SVG fallback)
 */
export const LogoTarbia: React.FC<{ className?: string; inverted?: boolean }> = ({
  className = 'h-10 sm:h-12 w-auto',
  inverted = false,
}) => {
  return (
    <div className="flex items-center justify-center select-none">
      <img
        src="/logos/tarbia-taleem.png"
        onError={(e) => {
          // Fallback to SVG image if user hasn't copied the PNG yet
          const target = e.currentTarget;
          if (!target.src.endsWith('.svg')) {
            target.src = '/logos/tarbia-taleem.svg';
          }
        }}
        alt="تربية وتعليم - Ministry of Education"
        className={`object-contain max-h-11 sm:max-h-13 w-auto ${className} ${
          inverted ? 'dark:brightness-0 dark:invert' : ''
        }`}
        loading="eager"
      />
    </div>
  );
};

/**
 * Official Administrative Logo 2:
 * "الميثاق الوطني للتعليم" — UAE National Education Charter identity image
 * Loads from /logos/mithaq.png (or SVG fallback)
 */
export const LogoMithaq: React.FC<{ className?: string; inverted?: boolean }> = ({
  className = 'h-10 sm:h-12 w-auto',
  inverted = false,
}) => {
  return (
    <div className="flex items-center justify-center select-none">
      <img
        src="/logos/mithaq.png"
        onError={(e) => {
          // Fallback to SVG image if user hasn't copied the PNG yet
          const target = e.currentTarget;
          if (!target.src.endsWith('.svg')) {
            target.src = '/logos/mithaq.svg';
          }
        }}
        alt="الميثاق الوطني للتعليم - National Education Charter"
        className={`object-contain max-h-11 sm:max-h-13 w-auto ${className}`}
        loading="eager"
      />
    </div>
  );
};

export const SchoolOfficialHeaderLogos: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3 bg-white dark:bg-[#121214] border-b border-zinc-200 dark:border-zinc-800 shadow-2xs">
      {/* Top Left: Logo 1 */}
      <div className="flex items-center gap-3">
        <LogoTarbia inverted={isDark} className="h-10 sm:h-12" />
      </div>

      {/* Center school emblem / title badge */}
      <div className="text-center">
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
          دولة الإمارات العربية المتحدة
        </span>
        <span className="mx-2 text-zinc-300 dark:text-zinc-700">·</span>
        <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          United Arab Emirates
        </span>
      </div>

      {/* Top Right: Logo 2 */}
      <div className="flex items-center gap-3">
        <LogoMithaq inverted={isDark} className="h-10 sm:h-12" />
      </div>
    </div>
  );
};
