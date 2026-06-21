'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosSearch } from 'react-icons/io';
import { FiSliders } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { CiCircleCheck } from 'react-icons/ci';
import {
  FaBookOpen,
  FaFlask,
  FaGhost,
  FaMasksTheater,
  FaHandHoldingHeart,
  FaBriefcase,
  FaMicrochip,
  FaMountain,
} from 'react-icons/fa6';

const CATEGORIES = [
  { id: 1, name: 'Fiction',              slug: 'fiction',            count: 120, icon: FaBookOpen },
  { id: 2, name: 'Sci-Fi & Fantasy',     slug: 'sci-fi-fantasy',     count: 85,  icon: FaFlask },
  { id: 3, name: 'Mystery & Thriller',   slug: 'mystery-thriller',   count: 64,  icon: FaGhost },
  { id: 4, name: 'Biography & History',  slug: 'biography-history',  count: 92,  icon: FaMasksTheater },
  { id: 5, name: 'Self-Help',            slug: 'self-help',          count: 45,  icon: FaHandHoldingHeart },
  { id: 6, name: 'Business & Finance',   slug: 'business-finance',   count: 73,  icon: FaBriefcase },
  { id: 7, name: 'Technology & Science', slug: 'tech-science',       count: 110, icon: FaMicrochip },
  { id: 8, name: 'Action & Adventure',   slug: 'action-adventure',   count: 50,  icon: FaMountain },
];

const SORT_OPTIONS = [
  { id: 'latest',     label: 'Latest Arrivals' },
  { id: 'price-low',  label: 'Fee: Low → High' },
  { id: 'price-high', label: 'Fee: High → Low' },
  { id: 'available',  label: 'In Stock First' },
];

// Helper: slug → display name
const slugToName = (slug) =>
  CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export default function SearchAndFiltering() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Read initial values from URL
  const [searchInput,   setSearchInput]   = useState(searchParams.get('q')        || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');   // stores slug or ''
  const [activeSort,    setActiveSort]    = useState(searchParams.get('sort')      || 'latest');

  // Temp (uncommitted) values inside the drawer
  const [tempCategory, setTempCategory] = useState(activeCategory);
  const [tempSort,     setTempSort]     = useState(activeSort);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef(null);

  // ── URL helper ──────────────────────────────────────────
  const pushParams = ({ q, category, sort }) => {
    const params = new URLSearchParams();
    if (q?.trim())               params.set('q',        q.trim());
    if (category)                params.set('category', category);   // slug value
    if (sort && sort !== 'latest') params.set('sort',   sort);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // ── Search ──────────────────────────────────────────────
  const handleSearch = () =>
    pushParams({ q: searchInput, category: activeCategory, sort: activeSort });

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  // ── Drawer ──────────────────────────────────────────────
  const openDrawer = () => {
    setTempCategory(activeCategory);
    setTempSort(activeSort);
    setIsFilterOpen(true);
  };

  const handleApply = () => {
    setActiveCategory(tempCategory);
    setActiveSort(tempSort);
    pushParams({ q: searchInput, category: tempCategory, sort: tempSort });
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setTempCategory('');
    setTempSort('latest');
  };

  const handleClearAll = () => {
    setSearchInput('');
    setActiveCategory('');
    setActiveSort('latest');
    setTempCategory('');
    setTempSort('latest');
    router.push('?', { scroll: false });
  };

  // ── Derived ─────────────────────────────────────────────
  const hasActiveFilters = activeCategory || activeSort !== 'latest' || searchInput.trim();
  const activeSortLabel  = SORT_OPTIONS.find((o) => o.id === activeSort)?.label;
  const filterDotVisible = activeCategory || activeSort !== 'latest';

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFilterOpen]);

  return (
    <div className="w-full space-y-3 mb-8">

      {/* ── Search Row ──────────────────────────────────── */}
      <div className="flex items-center gap-2 w-full">

        {/* Text input */}
        <div className="relative flex-1 min-w-0">
          <IoIosSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by title, author, keyword…"
            className="w-full bg-white text-slate-800 text-sm border border-slate-200 focus:border-[#fc4a32] rounded-xl pl-10 pr-4 py-3 outline-none transition-colors duration-150"
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-3 bg-[#fc4a32] hover:bg-[#e03e28] text-white text-sm font-semibold rounded-xl transition-colors duration-150 active:scale-95 cursor-pointer"
        >
          <IoIosSearch className="text-lg" />
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* Filter button */}
        <button
          onClick={openDrawer}
          className={`shrink-0 relative flex items-center justify-center gap-1.5 px-4 py-3 border rounded-xl text-sm font-semibold transition-colors duration-150 active:scale-95 cursor-pointer ${
            filterDotVisible
              ? 'bg-[#fc4a32]/8 border-[#fc4a32]/40 text-[#fc4a32]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <FiSliders className="text-lg" />
          <span className="hidden sm:inline">Filters</span>
          {filterDotVisible && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#fc4a32] rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* ── Active filter pills ──────────────────────────── */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-wrap items-center gap-2 overflow-hidden"
          >
            {searchInput.trim() && (
              <ActivePill
                label={`"${searchInput.trim()}"`}
                onRemove={() => {
                  setSearchInput('');
                  pushParams({ q: '', category: activeCategory, sort: activeSort });
                }}
              />
            )}
            {activeCategory && (
              <ActivePill
                label={slugToName(activeCategory)}
                onRemove={() => {
                  setActiveCategory('');
                  pushParams({ q: searchInput, category: '', sort: activeSort });
                }}
              />
            )}
            {activeSort !== 'latest' && (
              <ActivePill
                label={activeSortLabel}
                onRemove={() => {
                  setActiveSort('latest');
                  pushParams({ q: searchInput, category: activeCategory, sort: 'latest' });
                }}
              />
            )}
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-[#fc4a32] transition-colors underline underline-offset-2 cursor-pointer"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter Drawer ────────────────────────────────── */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="
                fixed z-50 bg-white
                bottom-0 left-0 right-0 rounded-t-2xl
                sm:bottom-auto sm:top-1/2 sm:left-1/2
                sm:-translate-x-1/2 sm:-translate-y-1/2
                sm:rounded-2xl sm:w-[540px] sm:max-w-[calc(100vw-2rem)]
                flex flex-col max-h-[90dvh] sm:max-h-[82vh]
                shadow-2xl border border-slate-100 overflow-hidden
              "
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Filters & Sorting</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Refine your book search</p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <RxCross2 className="text-xl" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-5 space-y-7">

                {/* Sort section */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Sort by
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {SORT_OPTIONS.map((opt) => {
                      const active = tempSort === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setTempSort(opt.id)}
                          className={`flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl border text-sm text-left transition-all cursor-pointer ${
                            active
                              ? 'border-[#fc4a32] bg-[#fc4a32]/5 text-[#fc4a32] font-semibold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="leading-snug">{opt.label}</span>
                          {active && <CiCircleCheck className="text-base shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Category section */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Category
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => {
                      const active  = tempCategory === cat.slug;
                      const CatIcon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() =>
                            // toggle off if already selected
                            setTempCategory(active ? '' : cat.slug)
                          }
                          className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-sm text-left transition-all cursor-pointer ${
                            active
                              ? 'border-[#fc4a32] bg-[#fc4a32]/5 text-[#fc4a32] font-semibold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {/* Icon */}
                          <span
                            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                              active
                                ? 'bg-[#fc4a32]/15 text-[#fc4a32]'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            <CatIcon />
                          </span>

                          {/* Name + count */}
                          <span className="flex-1 min-w-0">
                            <span className="block truncate leading-snug">{cat.name}</span>
                            <span
                              className={`text-[11px] font-bold ${
                                active ? 'text-[#fc4a32]/70' : 'text-slate-400'
                              }`}
                            >
                              {cat.count} books
                            </span>
                          </span>

                          {/* Checkmark */}
                          {active && <CiCircleCheck className="text-base shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-100 flex items-center gap-3 shrink-0 bg-white">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 text-sm font-bold text-white bg-[#fc4a32] hover:bg-[#e03e28] rounded-xl transition-colors active:scale-[0.98] cursor-pointer"
                >
                  Apply filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Active pill chip ────────────────────────────────────────
function ActivePill({ label, onRemove }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fc4a32]/8 text-[#fc4a32] text-xs font-semibold rounded-full border border-[#fc4a32]/25"
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-[#fc4a32]/15 rounded-full p-0.5 transition-colors cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        <RxCross2 className="text-xs" />
      </button>
    </motion.span>
  );
}