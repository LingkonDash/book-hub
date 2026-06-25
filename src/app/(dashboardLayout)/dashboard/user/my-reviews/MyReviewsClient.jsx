'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Avatar, StarPicker } from '@/components/browse/detailsPage/Reviewsection';
import { editReview } from '@/lib/action/reviewsAction/editReview';
import { deleteReview } from '@/lib/action/reviewsAction/deleteReview';

const MAX_CHARS = 500;

// ─── Star display (read-only) ─────────────────────────────────────────────────
function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditReviewModal({ review, onClose }) {
  const router = useRouter();
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? '');
  const [isPending, startTransition] = useTransition();

  const charCount = comment.length;

  function handleCommentChange(e) {
    if (e.target.value.length <= MAX_CHARS) setComment(e.target.value);
  }

  function handleSubmit() {
    if (rating === 0) return;
    startTransition(async () => {
      const res = await editReview({ rating, comment }, review._id);
      // res is the raw MongoDB updateOne result
      if (res?.modifiedCount === 1) {
        toast.success('Review updated!');
        onClose();
        router.refresh();
      } else if (res?.matchedCount === 1 && res?.modifiedCount === 0) {
        toast.info('No changes were made.');
        onClose();
      } else {
        toast.error('Failed to update review.');
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {review.coverImage ? (
              <div className="shrink-0 w-9 h-12 rounded-md overflow-hidden border border-slate-100">
                <Image
                  src={review.coverImage}
                  alt={review.bookTitle}
                  width={36}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="shrink-0 w-9 h-12 rounded-md bg-[#fad4de] flex items-center justify-center">
                <span className="text-[#fc4a32] font-bold text-sm">{review.bookTitle?.charAt(0) ?? 'B'}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm leading-snug line-clamp-1">{review.bookTitle}</p>
              {review.bookAuthor && (
                <p className="text-xs text-slate-400 line-clamp-1">{review.bookAuthor}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 ml-3 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Reviewer info */}
        <div className="flex items-center gap-3">
          <Avatar name={review.user?.name ?? ''} src={review.user?.image} size={38} />
          <div>
            <p className="text-sm font-bold text-slate-800">{review.user?.name ?? 'You'}</p>
            <p className="text-xs text-slate-400">Edit your review</p>
          </div>
        </div>

        {/* Rating */}
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Your rating</p>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Comment */}
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            Your thoughts{' '}
            <span className="normal-case font-normal text-slate-400">(optional)</span>
          </p>
          <div className="relative">
            <textarea
              rows={4}
              placeholder="What did you think of this book?"
              value={comment}
              onChange={handleCommentChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300
                focus:border-[#fc4a32] focus:ring-2 focus:ring-[#fc4a32]/20 outline-none
                text-sm text-slate-700 placeholder:text-slate-300 resize-none transition-all"
            />
            <span
              className={`absolute bottom-2.5 right-3 text-[11px] font-medium
                ${charCount > MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-slate-300'}`}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-sm text-slate-500
              hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Cancel
          </button>
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
                Updating…
              </>
            ) : (
              'Update review'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ review, onClose }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteReview(review._id);
      // res is the raw MongoDB deleteOne result
      if (res?.deletedCount === 1) {
        toast.success('Review deleted.');
        onClose();
        router.refresh();
      } else {
        toast.error('Failed to delete review.');
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-[#fc4a32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="font-bold text-slate-800 text-base">Delete this review?</p>
          <p className="text-sm text-slate-400">
            Your review on{' '}
            <span className="font-semibold text-slate-600">{review.bookTitle}</span>{' '}
            will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-sm text-slate-500
              hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className={`flex items-center justify-center gap-2 flex-1 h-11 rounded-xl font-bold text-sm transition-all cursor-pointer
              ${isPending
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
                Deleting…
              </>
            ) : (
              'Yes, delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, onEdit, onDelete }) {
  const date = review.createdAt?.$date
    ? new Date(review.createdAt.$date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : review.createdAt
      ? new Date(review.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        })
      : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 hover:shadow-md hover:border-slate-200 transition-all">
      {/* Book cover */}
      <div className="shrink-0 w-14 h-20 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
        {review.coverImage ? (
          <Image
            src={review.coverImage}
            alt={review.bookTitle}
            width={56}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#fad4de] flex items-center justify-center">
            <span className="text-[#fc4a32] font-bold text-xl leading-none">
              {review.bookTitle?.charAt(0) ?? 'B'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Book title + author */}
        <div>
          <p className="font-bold text-slate-800 text-sm leading-snug">{review.bookTitle}</p>
          {review.bookAuthor && (
            <p className="text-xs text-slate-400 mt-0.5">{review.bookAuthor}</p>
          )}
        </div>

        {/* Rating + date */}
        <div className="flex items-center gap-2 flex-wrap">
          <StarDisplay rating={review.rating} />
          <span className="text-[11px] text-slate-300">·</span>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
            {review.rating}/5
          </span>
          {date && (
            <>
              <span className="text-[11px] text-slate-300 hidden sm:inline">·</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">{date}</span>
            </>
          )}
        </div>

        {/* Full comment — no line clamp */}
        {review.comment ? (
          <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
        ) : (
          <p className="text-xs text-slate-300 italic">No comment left</p>
        )}

        {/* Date on mobile */}
        {date && (
          <p className="text-[11px] text-slate-400 sm:hidden">{date}</p>
        )}
      </div>

      {/* Action buttons — always visible */}
      <div className="shrink-0 flex flex-col gap-2">
        <button
          onClick={() => onEdit(review)}
          title="Edit review"
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center
            text-slate-400 hover:text-[#fc4a32] hover:border-[#fc4a32]/40 hover:bg-[#fc4a32]/5
            active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(review)}
          title="Delete review"
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center
            text-slate-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50
            active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <div className="w-16 h-16 rounded-2xl bg-[#fad4de] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#fc4a32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M7 8h10M7 12h6m-6 4h4M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
        </svg>
      </div>
      <p className="font-bold text-slate-700">No reviews yet</p>
      <p className="text-sm text-slate-400 max-w-xs">
        Reviews you leave on books will show up here. Borrow a book and share your thoughts!
      </p>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
const MyReviewsClient = ({ reviews }) => {
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <>
      {!reviews || reviews.length === 0 ? (
        <EmptyState />
      ) : (
        // Single column on mobile, 2-column grid on lg+
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map((review, i) => (
            <ReviewCard
              key={review._id ?? i}
              review={review}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <EditReviewModal
          review={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          review={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};

export default MyReviewsClient;