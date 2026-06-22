// app/browse/page.jsx  —  Server Component
import BooksBody from '@/components/browse/BooksBody';
import SearchAndFiltering from '@/components/browse/SearchAndFiltering';
import { getBooks } from '@/lib/api/getBooks';
import { BiBookOpen } from 'react-icons/bi';
import { FaRegStar } from 'react-icons/fa6';
import { HiOutlineTruck } from 'react-icons/hi2';

// Category slug → display name map (mirrors your CATEGORIES array)
const CATEGORY_LABELS = {
  'fiction':           'Fiction',
  'sci-fi-fantasy':    'Sci-Fi & Fantasy',
  'mystery-thriller':  'Mystery & Thriller',
  'biography-history': 'Biography & History',
  'self-help':         'Self-Help',
  'business-finance':  'Business & Finance',
  'tech-science':      'Technology & Science',
  'action-adventure':  'Action & Adventure',
};

const LIMIT = 12;

// ── Stat pill ───────────────────────────────────────────────
function StatPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
      <Icon className="text-[#fc4a32] text-sm" />
      {label}
    </div>
  );
}

export default async function AllBooksPage({ searchParams }) {
  // Next.js 15: searchParams is a Promise — await it
  const params = await searchParams;

  const q        = params?.q        || '';
  const category = params?.category || '';
  const sort     = params?.sort     || 'latest';
  const page     = Math.max(1, parseInt(params?.page || '1', 10));

  // Server-side prefetch for the first render
  const res = await getBooks(`page=${page || 1}&limit=${LIMIT}&${category ? `category=${category}&` : ''}${sort ? `sort=${sort}&` : ''}${q ? `search=${q}` : ''}`);
  const initialData = res.books

  // Heading copy
  const categoryLabel = category ? CATEGORY_LABELS[category] : null;

  const headingTitle = categoryLabel
    ? `${categoryLabel} Books`
    : q
      ? `Results for "${q}"`
      : 'Browse the Marketplace';

  const headingDesc = categoryLabel
    ? `Explore our curated ${categoryLabel} collection — request delivery straight to your door.`
    : q
      ? `Showing books matching your search. Use filters to narrow it down further.`
      : 'Discover thousands of titles across every genre. Order any book delivered to your doorstep.';

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-380 mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* ── Page header banner ──────────────────────────── */}
        <div className="mb-8 rounded-2xl bg-linear-to-br from-[#fff5f3] to-[#fad4de]/40 border border-[#fad4de] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">

            {/* Left: label + heading + description */}
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#fc4a32] bg-white px-3 py-1 rounded-full border border-[#fad4de] shadow-xs mb-3">
                {categoryLabel ? 'Category' : q ? 'Search Results' : 'Explore Collection'}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {headingTitle}
              </h1>

              <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
                {headingDesc}
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <StatPill icon={BiBookOpen}    label={`${res.total} books available`} />
                <StatPill icon={HiOutlineTruck} label="Doorstep delivery" />
                <StatPill icon={FaRegStar}      label="Verified reviews only" />
              </div>
            </div>

            {/* Right: result count */}
            <div className="shrink-0 self-start sm:self-center bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-center shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Showing
              </p>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {res.total === 0
                  ? '0'
                  : `${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, res.total)}`
                }
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                of <span className='font-bold text-black/80'>{res.total}</span> books
              </p>
            </div>
          </div>
        </div>

        {/* ── Search + Filters ────────────────────────────── */}
        <SearchAndFiltering />

        {/* ── Book grid + Pagination ──────────────────────── */}
        <BooksBody getData={getBooks} initialData={res} />
      </div>
    </div>
  );
}