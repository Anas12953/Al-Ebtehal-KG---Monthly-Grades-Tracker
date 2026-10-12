import React, { useState, useMemo } from 'react';
import { AssessmentGrade, AssessmentStandard, Language, SubjectDomain } from '../types/index.ts';
import { DOMAINS, GRADE_DEFINITIONS } from '../data/curriculum.ts';
import { translations } from '../utils/i18n.ts';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, BookOpen, X, SlidersHorizontal } from 'lucide-react';

interface StandardsTableProps {
  standards: AssessmentStandard[];
  lang: Language;
}

export const StandardsTable: React.FC<StandardsTableProps> = ({ standards, lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<AssessmentGrade | 'all'>('all');
  const [sortField, setSortField] = useState<'domain' | 'name' | 'grade'>('grade');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const t = translations[lang];
  const isAr = lang === 'ar';

  const gradeRank: Record<AssessmentGrade, number> = {
    EX: 4,
    M: 3,
    D: 2,
    E: 1,
  };

  const handleSort = (field: 'domain' | 'name' | 'grade') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedStandards = useMemo(() => {
    let result = [...standards];

    // Filter by domain
    if (selectedDomain !== 'all') {
      result = result.filter((s) => s.domain === selectedDomain);
    }

    // Filter by grade
    if (selectedGrade !== 'all') {
      result = result.filter((s) => s.grade === selectedGrade);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.nameAr.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q) ||
          s.domainAr.toLowerCase().includes(q) ||
          s.domainEn.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'grade') {
        comparison = gradeRank[a.grade] - gradeRank[b.grade];
      } else if (sortField === 'domain') {
        const domA = isAr ? a.domainAr : a.domainEn;
        const domB = isAr ? b.domainAr : b.domainEn;
        comparison = domA.localeCompare(domB);
      } else if (sortField === 'name') {
        const nameA = isAr ? a.nameAr : a.nameEn;
        const nameB = isAr ? b.nameAr : b.nameEn;
        comparison = nameA.localeCompare(nameB);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [standards, selectedDomain, selectedGrade, searchQuery, sortField, sortDirection, isAr]);

  // Helper to render 4-segment level progress bar
  const renderLevelMeter = (grade: AssessmentGrade) => {
    const level = gradeRank[grade];
    const config = GRADE_DEFINITIONS[grade];
    return (
      <div className="flex items-center gap-1.5" title={`${config.code}: ${level}/4`}>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((seg) => (
            <div
              key={seg}
              className={`w-3.5 h-1.5 rounded-full transition-all ${
                seg <= level
                  ? ''
                  : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
              style={{
                backgroundColor: seg <= level ? config.color : undefined,
              }}
            />
          ))}
        </div>
        <span
          className="text-xs font-extrabold px-1.5 py-0.5 rounded text-white text-[11px]"
          style={{ backgroundColor: config.color }}
        >
          {grade}
        </span>
      </div>
    );
  };

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 space-y-6">
      {/* Refraction highlight shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-900 dark:text-zinc-100">
            <BookOpen className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
              {t.standardsTableTitle}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.standardsTableSubtitle}
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span>{isAr ? 'المعروض:' : 'Showing:'} </span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {filteredAndSortedStandards.length}
          </span>{' '}
          / {standards.length} {t.standardsUnit}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-zinc-400 absolute start-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full ps-10 pe-9 py-2 text-xs rounded-xl border border-zinc-300/80 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Domain Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300/80 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer shadow-2xs"
          >
            <option value="all">{t.filterAllSubjects}</option>
            {Object.entries(DOMAINS).map(([key, dom]) => (
              <option key={key} value={key}>
                {isAr ? dom.nameAr : dom.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Grade Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300/80 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer shadow-2xs"
          >
            <option value="all">{isAr ? 'كافة المستويات' : 'All Performance Levels'}</option>
            <option value="EX">EX — {isAr ? 'يفوق التوقعات' : 'Exceeding'}</option>
            <option value="M">M — {isAr ? 'متمكن' : 'Mastery'}</option>
            <option value="D">D — {isAr ? 'في طور التطور' : 'Developing'}</option>
            <option value="E">E — {isAr ? 'في مرحلة النمو' : 'Emerging'}</option>
          </select>
        </div>
      </div>

      {/* Sorting Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
        <span className="font-semibold">{isAr ? 'ترتيب النتائج:' : 'Sort by:'}</span>
        <button
          onClick={() => handleSort('grade')}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            sortField === 'grade'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
          }`}
        >
          <span>{isAr ? 'مستوى الإتقان' : 'Performance Level'}</span>
          {sortField === 'grade' && (
            sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={() => handleSort('domain')}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            sortField === 'domain'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
          }`}
        >
          <span>{isAr ? 'المجال الأكاديمي' : 'Domain'}</span>
          {sortField === 'domain' && (
            sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={() => handleSort('name')}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            sortField === 'name'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
          }`}
        >
          <span>{isAr ? 'اسم المعيار' : 'Standard Name'}</span>
          {sortField === 'name' && (
            sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Solid High-Contrast Table Container (Desktop) */}
      <div className="hidden md:block overflow-hidden rounded-2xl solid-content-surface shadow-xs">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-zinc-100/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <th className="py-3.5 px-4 text-start">{t.colDomain}</th>
              <th className="py-3.5 px-4 text-start">{t.colStandard}</th>
              <th className="py-3.5 px-4 text-start">{t.colGrade}</th>
              <th className="py-3.5 px-4 text-start">{t.colStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 text-xs">
            {filteredAndSortedStandards.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-zinc-400">
                  {t.noStandardsFound}
                </td>
              </tr>
            ) : (
              filteredAndSortedStandards.map((std) => {
                const dom = DOMAINS[std.domain];
                const gradeDef = GRADE_DEFINITIONS[std.grade];
                return (
                  <tr
                    key={std.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: dom?.color || '#71717A' }}
                        />
                        <span>{isAr ? std.domainAr : std.domainEn}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-zinc-900 dark:text-zinc-100 max-w-xs">
                      <div>{isAr ? std.nameAr : std.nameEn}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {isAr ? std.nameEn : std.nameAr}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderLevelMeter(std.grade)}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-sm">
                      {isAr ? gradeDef.descriptionAr : gradeDef.descriptionEn}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid with Progress Meters */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredAndSortedStandards.length === 0 ? (
          <div className="solid-content-surface rounded-2xl p-8 text-center text-zinc-400 text-xs">
            {t.noStandardsFound}
          </div>
        ) : (
          filteredAndSortedStandards.map((std) => {
            const dom = DOMAINS[std.domain];
            const gradeDef = GRADE_DEFINITIONS[std.grade];
            return (
              <div
                key={std.id}
                className="solid-content-surface rounded-2xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: dom?.color || '#71717A' }}
                    />
                    <span>{isAr ? std.domainAr : std.domainEn}</span>
                  </div>
                  {renderLevelMeter(std.grade)}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-950 dark:text-white leading-snug">
                    {isAr ? std.nameAr : std.nameEn}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {isAr ? std.nameEn : std.nameAr}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-300">
                  {isAr ? gradeDef.descriptionAr : gradeDef.descriptionEn}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
