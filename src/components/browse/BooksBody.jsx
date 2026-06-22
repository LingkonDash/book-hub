'use client';

import { useState, useEffect, useTransition, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookCard from '../shared/BookCard';
import { toast } from 'react-toastify';
import { getBooks } from '@/lib/api/getBooks';

const LIMIT = 12;

// ── Skeleton card ──────────────────────────────────────────
function BookCardSkeleton() {
  return (
    <div className="bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-slate-300 dark:bg-slate-700 aspect-3/4 w-full" />
      <div className="p-3 space-y-2">
        <div className="bg-slate-300 dark:bg-slate-700 h-3.5 rounded-full w-3/4" />
        <div className="bg-slate-300 dark:bg-slate-700 h-3 rounded-full w-1/2" />
        <div className="bg-slate-300 dark:bg-slate-700 h-3 rounded-full w-1/3 mt-1" />
      </div>
    </div>
  );
}

// ── Pagination button ──────────────────────────────────────
function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-9 h-9 px-2 rounded-xl text-sm font-semibold transition-all cursor-pointer
        ${active
          ? 'bg-[#fc4a32] text-white shadow-sm'
          : disabled
            ? 'text-slate-300 cursor-not-allowed'
            : 'text-slate-600 hover:bg-slate-100 active:scale-95'
        }`}
    >
      {children}
    </button>
  );
}

// ── Page number range builder ──────────────────────────────
// Always shows: first, last, current ± 1, with "…" gaps
function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…');
    result.push(sorted[i]);
  }
  return result;
}

export default function BooksBody({ getData, initialData }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [books, setBooks] = useState(initialData.books ?? []);
  const [totalCount, setTotalCount] = useState(initialData.total ?? 0);
  const [isPending, startTransition] = useTransition();

  // If SSR gave us data, mark first load as "already done" so we skip the mount fetch
  const [firstLoad, setFirstLoad] = useState(
    !(initialData?.books?.length > 0)
  );

  const isFirstRender = useRef(true);
  // Read params
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const totalPages = Math.ceil(totalCount / LIMIT);

  // ── Fetch ────────────────────────────────────────────────

  const fetchBooks = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await getBooks(
          `page=${page || 1}&limit=${LIMIT}&${category ? `category=${category}&` : ''}${sort ? `sort=${sort}&` : ''}${q ? `search=${q}` : ''}`
        );
        setBooks(result?.books ?? []);
        setTotalCount(result?.total ?? 0);
      } catch (err) {
        toast.error('Failed to fetch books:', err);
        setBooks([]);
        setTotalCount(0);
      } finally {
        setFirstLoad(false);
      }
    });
  }, [q, category, sort, page, getData]);

  useEffect(() => {
    // On mount: if SSR already gave us fresh data, just clear the flag and bail
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialData?.books?.length > 0) {
        setFirstLoad(false);
        return;          // ← skip the network call
      }
    }
    fetchBooks();
  }, [fetchBooks]);


  // ── Page navigation ──────────────────────────────────────
  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`?${params.toString()}`, { scroll: false });
    // Smooth scroll back up to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Result range label ───────────────────────────────────
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * LIMIT + 1;
  const rangeEnd = Math.min(page * LIMIT, totalCount);

  const pageRange = buildPageRange(page, totalPages);

  const isLoading = isPending || firstLoad;

  // ── Empty state ──────────────────────────────────────────
  const isEmpty = !isLoading && books.length === 0;

  return (
    <div className="w-full space-y-6">

      {/* ── Result count header ──────────────────────────── */}
      <div className="flex items-center justify-between min-h-[28px]">
        {isLoading ? (
          <div className="h-4 w-52 bg-black-100 rounded-full animate-pulse" />
        ) : isEmpty ? (
          <p className="text-sm text-slate-400">No books found</p>
        ) : (
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-800">{rangeStart}–{rangeEnd}</span>
            {' '}of{' '}
            <span className="font-semibold text-slate-800">{totalCount}</span>
            {' '}books
            {category && (
              <>
                {' '}in{' '}
                <span className="font-semibold text-[#fc4a32] capitalize">
                  {category.replace(/-/g, ' ')}
                </span>
              </>
            )}
          </p>
        )}

        {/* Active page indicator on the right */}
        {!isLoading && totalPages > 1 && (
          <p className="text-xs text-slate-400 font-medium">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* ── Book grid ────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-base font-bold text-slate-700 mb-1">No books found</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Try adjusting your search or clearing some filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────── */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2 flex-wrap">

          {/* Prev */}
          <PageBtn
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            ←
          </PageBtn>

          {/* Page numbers */}
          {pageRange.map((item, i) =>
            item === '…' ? (
              <span
                key={`ellipsis-${i}`}
                className="min-w-9 h-9 flex items-center justify-center text-slate-400 text-sm select-none"
              >
                …
              </span>
            ) : (
              <PageBtn
                key={item}
                active={item === page}
                onClick={() => item !== page && goToPage(item)}
              >
                {item}
              </PageBtn>
            )
          )}

          {/* Next */}
          <PageBtn
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            →
          </PageBtn>
        </div>
      )}
    </div>
  );
}