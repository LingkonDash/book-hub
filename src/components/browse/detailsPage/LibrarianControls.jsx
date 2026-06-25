'use client';

import { DeleteBookModal } from "@/components/dashboard/librarian/DeleteBookModal";
import { deleteBook } from "@/lib/action/librarianAction/deleteBook";
import { publishBook } from "@/lib/action/librarianAction/publishBook";
import { unpublishBook } from "@/lib/action/librarianAction/unpublishBook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiBookOpen } from "react-icons/bi";
import { FiCheckCircle, FiEdit3, FiEyeOff, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

export default function LibrarianControls({ book }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null); // 'unpublish' | 'publish' | 'delete' | null

  // ── Unpublish Action ──────────────────────────────────────
  const handleUnpublish = async () => {
    setLoading('unpublish');
    try {
      const res = await unpublishBook(book._id);
      if (res?.modifiedCount > 0) {
        toast.info('Your book has been Unpublished!');
      } else {
        toast.error('Failed to unpublish try again!');
      }
      router.refresh();
    } catch {
      toast.error('Failed to unpublish try again!');
    } finally {
      setLoading(null);
    }
  };

  // ── Publish (Request Approval) Action ─────────────────────
  const handlePublish = async () => {
    setLoading('publish');
    try {
      const res = await publishBook(book._id);
      if (res?.modifiedCount > 0) {
        toast.info('Waiting for admin approval to Publish!');
      } else {
        toast.error('Failed to publish try again!');
      }
      router.refresh();
    } catch {
      toast.error('Failed to publish, try again!');
    } finally {
      setLoading(null);
    }
  };

  const isPublished = book.status === 'published';
  const isPending = book.status === 'pending';

  return (
    <div className=" gap-2 p-2 border-t border-slate-100 w-full">
        {/* Role Context Label */}
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2 select-none">
          <BiBookOpen className="w-3.5 h-3.5 text-slate-400" />
          Librarian Controls
        </span>
      <div className="grid grid-cols-1 items-stretch md:grid-cols-3  gap-2 space-y-1 mt-2">
        {/* Left side actions (Controls Title & Primary triggers) */}

        {/* Redirect Edit Button Layout */}
        <Link
          href={`/dashboard/librarian/edit/${book._id}`}
          className="flex justify-center items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all active:scale-[0.98]"
        >
          <FiEdit3 className="w-3.5 h-3.5 text-slate-500" />
          Edit Details
        </Link>

        {/* Toggle Status Actions (Publish vs Unpublish) */}
        {isPublished ? (
          <button
            onClick={handleUnpublish}
            disabled={loading !== null}
            className="flex justify-center cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60 text-xs font-medium transition-all disabled:opacity-60 active:scale-[0.98]"
          >
            {loading === 'unpublish' ? (
              <FiLoader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FiEyeOff className="w-3.5 h-3.5" />
            )}
            Unpublish
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={loading !== null || isPending}
            className={`inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isPending
              ? 'bg-slate-50 text-slate-400 border border-slate-200/60 cursor-not-allowed'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 active:scale-[0.98] disabled:opacity-60'
              }`}
          >
            {loading === 'publish' ? (
              <FiLoader className="w-3.5 h-3.5 animate-spin" />
            ) : isPending ? (
              <FiCheckCircle className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <FiCheckCircle className="w-3.5 h-3.5" />
            )}
            {isPending ? 'Pending Approval' : 'Publish'}
          </button>
        )}
        {/* Right side alignment for delete modal on desktop, stacks beautifully on mobile */}
        <div className="flex items-center rounded-sm">
          <DeleteBookModal book={book} />
        </div>
      </div>

    </div>
  );
}