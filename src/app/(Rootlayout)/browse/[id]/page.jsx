'use server';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getBookById } from '@/lib/api/getBooks';
import { getReviews } from '@/lib/api/getReviews';
import DeliveryModal from '@/components/browse/detailsPage/Deliverymodal';
import ReviewSection from '@/components/browse/detailsPage/Reviewsection';
import { getUserSession } from '@/lib/core/session';
import { getUserDeliveries } from '@/lib/api/getUserDeliveries';

// ── tiny helpers ───────────────────────────────────────────
function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-600 border border-red-200',
    primary: 'bg-[#fff0ee] text-[#fc4a32] border border-[#fad4de]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0 overflow-hidden">
      <span className="text-sm text-slate-400 shrink-0 w-32">{label}</span>
      <span className="text-sm text-slate-800 font-medium text-right overflow-hidden">{value || '—'}</span>
    </div>
  );
}

function StarRating({ rating = 0, count = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => <StarIcon key={`f${i}`} fill />)}
        {half && <StarIcon half />}
        {Array.from({ length: empty }).map((_, i) => <StarIcon key={`e${i}`} />)}
      </div>
      <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-xs text-slate-400">({count} review{count !== 1 ? 's' : ''})</span>}
    </div>
  );
}

function StarIcon({ fill = false, half = false }) {
  if (fill) return (
    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" />
    </svg>
  );
  if (half) return (
    <svg className="w-4 h-4" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" />
    </svg>
  );
  return (
    <svg className="w-4 h-4 text-slate-200" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" />
    </svg>
  );
}

// ── status badge helper ────────────────────────────────────
function statusBadge(status) {
  if (status === 'available') return <Badge variant="success">Available</Badge>;
  if (status === 'unavailable') return <Badge variant="danger">Unavailable</Badge>;
  if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
  return <Badge variant="default">{status}</Badge>;
}

// ── derived availability from status ──────────────────────
function isBookAvailable(status) {
  return status === 'published';
}

// ── page ───────────────────────────────────────────────────
export default async function BookDetailPage({ params }) {
  const { id } = await params;

  // ── Auth (optional — page visible to guests, actions gated) ─
  const currentUser = await getUserSession();

  // ── Data — fetch book and reviews in parallel ──────────
  const [book, reviewsData] = await Promise.all([
    getBookById(id),
    getReviews(id),   // { reviews: [...], avgRating: number }
  ]);

  if (!book) notFound();

  const userDeliveries = await getUserDeliveries(currentUser?.id);
  const deliveredData = userDeliveries.deliveries.filter(d => d.status === 'delivered')
  const canReview = !!deliveredData.find(d => d.bookId === id);

  // if(book && currentUser) canReview 

  const {
    _id,
    title = 'Untitled',
    author = 'Unknown Author',
    coverImage,
    description,
    category,
    deliveryFee = 0,
    status = 'pending',
    librarianId,
    librarianEmail,
    createdAt,
    totalDeliveries,
  } = book;

  // Derive availability from status field
  const isAvailable = isBookAvailable(status);

  // Pull review stats from the pre-fetched reviews data
  const initialReviews = reviewsData?.reviews ?? [];
  const avgRating = reviewsData?.avgRating ?? 0;
  const reviewCount = initialReviews.length;

  return (
    <main className="min-h-screen pt-20 bg-[#fafaf9]">

      {/* ── Hero band ──────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Cover */}
            <div className="shrink-0 flex justify-center lg:justify-start">
              <div className="relative w-52 lg:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.13)] ring-1 ring-black/5">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={`Cover of ${title}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width:1024px) 208px, 256px"
                  />
                ) : (
                  // Placeholder cover
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs text-slate-400 font-medium leading-tight">{title}</span>
                  </div>
                )}

                {/* Status ribbon */}
                <div className="absolute top-3 left-3">
                  {statusBadge(status)}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* Eyebrow */}
              <div className="flex flex-wrap items-center gap-2">
                {category && <Badge variant="primary">{category}</Badge>}
              </div>

              {/* Title + author */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                  {title}
                </h1>
                <p className="mt-1.5 text-base text-slate-500">
                  by <span className="font-semibold text-slate-700">{author}</span>
                </p>
              </div>

              {/* Rating — derived from fetched reviews */}
              <StarRating rating={avgRating} count={reviewCount} />

              {/* Description */}
              {description && (
                <p className="text-sm text-slate-600 leading-relaxed max-w-prose line-clamp-4">
                  {description}
                </p>
              )}

              {/* Delivery fee + CTA ── client island */}
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Delivery fee</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ${Number(deliveryFee).toFixed(2)}
                  </p>
                </div>

                {/* Delivery button — client component handles modal */}
                <DeliveryModal
                  book={{
                    _id,
                    title,
                    author,
                    coverImage,
                    deliveryFee,
                    available: isAvailable,
                    librarianId,
                    librarianEmail,
                  }}
                  currentUser={currentUser}
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — description + reviews */}
          <div className="lg:col-span-2 space-y-10">

            {/* Full description */}
            {description && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3">About this book</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}

            <hr className="border-slate-100" />

            {/* Reviews — client component, seeded with SSR data */}
            <ReviewSection
              bookId={String(_id)}
              currentUser={currentUser}
              initialReviews={initialReviews}
              initialAvgRating={avgRating}
              canReview={canReview}
            />
          </div>

          {/* RIGHT — metadata card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm sticky top-6">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Book details</h3>
              <div className="divide-y divide-slate-50">
                <InfoRow label="Author" value={author} />
                <InfoRow label="Category" value={category} />
                <InfoRow label="Status" value={status ? status.charAt(0).toUpperCase() + status.slice(1) : undefined} />
                <InfoRow label="Delivery fee" value={`$${Number(deliveryFee).toFixed(2)}`} />
                {librarianEmail && <InfoRow label="Librarian" value={librarianEmail} />}
                {createdAt && <InfoRow label="Added on" value={new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}