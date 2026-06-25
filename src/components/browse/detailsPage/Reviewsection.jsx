'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { postReview } from '@/lib/action/reviewsAction/postReview';
import { editReview } from '@/lib/action/reviewsAction/editReview';
import { deleteReview } from '@/lib/action/reviewsAction/deleteReview';

// ── Helpers ────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export function Avatar({ name = '', src, size = 36 }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-violet-100 text-violet-700', 'bg-teal-100 text-teal-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700'];
  const color = colors[name.charCodeAt(0) % colors.length];

  return src ? (
    <div style={{ width: size, height: size }} className="relative rounded-full overflow-hidden shrink-0">
      <Image src={src} alt={name} fill className="object-cover" sizes={`${size}px`} />
    </div>
  ) : (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`rounded-full shrink-0 flex items-center justify-center font-bold ${color}`}
    >
      {initials || '?'}
    </div>
  );
}

// ── Star picker ────────────────────────────────────────────
export function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
        >
          <svg
            className={`w-7 h-7 transition-colors ${n <= display ? 'text-amber-400' : 'text-slate-200'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" />
          </svg>
        </button>
      ))}
      <span className="ml-1 text-sm text-slate-400 font-medium">
        {display > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][display] : 'Tap to rate'}
      </span>
    </div>
  );
}

// ── Single review card ─────────────────────────────────────
function ReviewCard({ review, isOwn = false, onEdit, onDelete, isDeleting }) {
  const { rating, comment, user, createdAt } = review;
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className={`flex gap-3 py-5 border-b border-slate-100 last:border-0 ${isOwn ? 'bg-amber-50/60 -mx-4 px-4 rounded-2xl' : ''}`}>
      <Avatar name={user?.name ?? 'User'} src={user?.image} size={38} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">{user?.name ?? 'Anonymous'}</span>
            {isOwn && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 uppercase tracking-wide">
                Your review
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{timeAgo(createdAt)}</span>
            {/* Edit & Delete — only on own review card */}
            {isOwn && (
              <>
                <button
                  onClick={onEdit}
                  className="text-xs font-semibold text-[#fc4a32] hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500 hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mt-1.5 mb-2">
          {stars.map((n) => (
            <svg
              key={n}
              className={`w-3.5 h-3.5 ${n <= rating ? 'text-amber-400' : 'text-slate-200'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" />
            </svg>
          ))}
        </div>

        {comment && <p className="text-sm text-slate-600 leading-relaxed">{comment}</p>}
      </div>
    </div>
  );
}

// ── Write / Edit review form ───────────────────────────────
function WriteReviewForm({ bookId, currentUser, existingReview, onReviewSubmitted, onCancelEdit, book }) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const [charCount, setCharCount] = useState(existingReview?.comment?.length ?? 0);
  const MAX_CHARS = 600;

  const isEdit = Boolean(existingReview);

  function handleCommentChange(e) {
    if (e.target.value.length > MAX_CHARS) return;
    setComment(e.target.value);
    setCharCount(e.target.value.length);
  }

  async function handleSubmit() {
    if (rating === 0) { toast.error('Please select a star rating.'); return; }

    startTransition(async () => {
      try {
        if (isEdit) {
          // ── Edit path ──────────────────────────────────
          const updateInfo = { rating, comment };
          const res = await editReview(updateInfo, existingReview._id);

          if (res?.modifiedCount > 0) {
            toast.success('Review updated!');
            onReviewSubmitted({ ...existingReview, rating, comment });
          } else {
            toast.error('No changes were saved.');
          }
        } else {
          // ── Post path ──────────────────────────────────
          const reviewInfo = {
            bookId,
            bookTitle: book?.title,
            bookAuthor: book?.author,
            coverImage: book?.coverImage,
            rating,
            user: { _id: currentUser?.id, name: currentUser?.name, image: currentUser?.image },
            comment,
            userId: currentUser?.id
          };
          const res = await postReview(reviewInfo);

          if (res?.insertedId) {
            toast.success('Review submitted!');
            // Pass back a minimal review object so optimistic update works
            onReviewSubmitted({
              _id: res.insertedId,
              rating,
              comment,
              userId: currentUser?.id,
              user: { _id: currentUser?.id, name: currentUser?.name, image: currentUser?.image },
            });
          } else {
            toast.error('Failed to submit review.');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Something went wrong.');
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar name={currentUser?.name ?? ''} src={currentUser?.image} size={38} />
        <div>
          <p className="text-sm font-bold text-slate-800">{currentUser?.name ?? 'You'}</p>
          <p className="text-xs text-slate-400">
            {isEdit ? 'Edit your review' : 'Verified delivery · Leave a review'}
          </p>
        </div>
      </div>

      {/* Star picker */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Your rating</p>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Comment */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          Your thoughts <span className="normal-case font-normal text-slate-400">(optional)</span>
        </p>
        <div className="relative">
          <textarea
            required
            rows={4}
            placeholder="What did you think of this book?"
            value={comment}
            onChange={handleCommentChange}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300
              focus:border-[#fc4a32] focus:ring-2 focus:ring-[#fc4a32]/20 outline-none
              text-sm text-slate-700 placeholder:text-slate-300 resize-none transition-all"
          />
          <span className={`absolute bottom-2.5 right-3 text-[11px] font-medium ${charCount > MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-slate-300'}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Cancel only shown in edit mode */}
        {isEdit && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-sm text-slate-500
              hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}

        {/* Submit / Update */}
        <button
          onClick={handleSubmit}
          disabled={isPending || rating === 0}
          className={`flex items-center justify-center gap-2 flex-1 h-11 rounded-xl font-bold text-sm transition-all cursor-pointer
            ${isPending || rating === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-[#fc4a32] hover:bg-[#e03e28] active:scale-[0.98] text-white shadow-[0_4px_16px_rgba(252,74,50,0.28)]'
            }`}
        >
          {isPending ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {isEdit ? 'Updating…' : 'Submitting…'}
            </>
          ) : (
            isEdit ? 'Update review' : 'Submit review'
          )}
        </button>
      </div>
    </div>
  );
}

// ── Empty reviews ──────────────────────────────────────────
function EmptyReviews() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-3">⭐</div>
      <p className="text-sm font-bold text-slate-700">No reviews yet</p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs">
        Be the first to leave a review after your delivery is completed.
      </p>
    </div>
  );
}

// ── Review list ────────────────────────────────────────────
function ReviewList({ reviews, currentUserId, onEditRequest, deletingId, onDelete }) {
  const [visible, setVisible] = useState(5);
  const hasMore = visible < reviews.length;

  if (reviews.length === 0) return <EmptyReviews />;

  return (
    <div>
      <div className="divide-y divide-slate-50">
        {reviews.slice(0, visible).map((review) => {
          const isOwn = review.user?._id === currentUserId || review.userId === currentUserId;
          return (
            <ReviewCard
              key={review._id}
              review={review}
              isOwn={isOwn}
              onEdit={() => onEditRequest(review)}
              onDelete={() => onDelete(review._id)}
              isDeleting={deletingId === review._id}
            />
          );
        })}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisible((v) => v + 5)}
          className="mt-4 w-full h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600
            hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          Show more reviews
        </button>
      )}
    </div>
  );
}

// ── Locked state — guest / reader without delivery ─────────
function LockedReviewPrompt({ isGuest }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">
          {isGuest ? 'Sign in to leave a review' : 'Get your copy delivered first'}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {isGuest
            ? 'You need an account to write reviews.'
            : 'Only readers with a completed delivery can write a review for this book.'}
        </p>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────
export default function ReviewSection({ bookId, currentUser, initialReviews = [], initialAvgRating = 0, canReview, book }) {
  const router = useRouter();

  const [reviews, setReviews] = useState(initialReviews);
  const [avgRating, setAvgRating] = useState(initialAvgRating);
  const [editingReview, setEditingReview] = useState(null);   // review object being edited
  const [deletingId, setDeletingId] = useState(null);   // _id of review being deleted

  const currentUserId = currentUser?.id ?? null;
  const userReview = reviews.find((r) => r.user?._id === currentUserId || r.userId === currentUserId);
  const hasReviewed = Boolean(userReview);

  // ── Recalculate avg after change ───────────────────────
  function recalcAvg(updatedList) {
    if (updatedList.length === 0) { setAvgRating(0); return; }
    const total = updatedList.reduce((sum, r) => sum + r.rating, 0);
    setAvgRating(total / updatedList.length);
  }

  // ── After posting / editing ────────────────────────────
  function handleReviewSubmitted(updatedReview) {
    setEditingReview(null);
    setReviews((prev) => {
      const idx = prev.findIndex((r) => r._id === updatedReview._id);
      const next = idx !== -1
        ? prev.map((r) => r._id === updatedReview._id ? updatedReview : r)
        : [updatedReview, ...prev];
      recalcAvg(next);
      return next;
    });
    router.refresh();
  }

  // ── Delete ─────────────────────────────────────────────
  async function handleDelete(reviewId) {
    setDeletingId(reviewId);
    try {
      console.log(reviewId);
      const res = await deleteReview(reviewId)

      if (res.deletedCount > 0) {
        toast.success('Review deleted.');
        setReviews((prev) => {
          const next = prev.filter((r) => r._id !== reviewId);
          recalcAvg(next);
          return next;
        });
        router.refresh();
      } else {
        toast.error('Could not delete review.');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setDeletingId(null);
    }
  }

  // ── Rating summary bar ─────────────────────────────────
  function RatingSummary() {
    const counts = [5, 4, 3, 2, 1].map((n) => ({
      star: n,
      count: reviews.filter((r) => r.rating === n).length,
    }));
    const total = reviews.length;

    return (
      <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        {/* Big number */}
        <div className="text-center shrink-0">
          <p className="text-4xl font-black text-slate-900">{avgRating.toFixed(1)}</p>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <svg key={n} className={`w-3 h-3 ${n <= Math.round(avgRating) ? 'text-amber-400' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" />
              </svg>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">{total} review{total !== 1 ? 's' : ''}</p>
        </div>

        {/* Bars */}
        {total > 0 && (
          <div className="flex-1 space-y-1.5">
            {counts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-3 shrink-0">{star}</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-4 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900">
        Reviews {reviews.length > 0 && <span className="text-slate-400 font-normal text-base">({reviews.length})</span>}
      </h2>

      {/* Rating summary — shown when there are reviews */}
      {reviews.length > 0 && <RatingSummary />}

      {/* ── Write / Edit form OR locked prompt ── */}
      {canReview ? (
        // Show form only if user hasn't reviewed yet, OR if they're actively editing
        !hasReviewed || editingReview ? (
          <WriteReviewForm
            bookId={bookId}
            currentUser={currentUser}
            existingReview={editingReview ?? null}
            onReviewSubmitted={handleReviewSubmitted}
            onCancelEdit={editingReview ? () => setEditingReview(null) : null}
            book={book}
          />
        ) : null  // user already reviewed — their card has Edit button instead
      ) : (
        <LockedReviewPrompt isGuest={!currentUser} />
      )}

      {/* ── Review list ── */}
      <ReviewList
        reviews={reviews}
        currentUserId={currentUserId}
        onEditRequest={(review) => setEditingReview(review)}
        deletingId={deletingId}
        onDelete={handleDelete}
      />
    </div>
  );
}