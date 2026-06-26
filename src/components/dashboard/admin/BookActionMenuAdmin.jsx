'use client'

import { useState, useRef, useEffect } from 'react'
import { TiEye, TiEdit } from 'react-icons/ti'
import { HiDotsVertical } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { unpublishBook } from '@/lib/action/librarianAction/unpublishBook'
import { DeleteBookModal } from '../librarian/DeleteBookModal'
import { adminPublishBook } from '@/lib/action/admin/adminPublishBook'

const BookActionMenuAdmin = ({ book, isAdmin }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(null)
  const menuRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUnpublish = async () => {
    setOpen(false)
    setLoading('unpublish')
    try {
      const res = await unpublishBook(book._id)
      if (res?.modifiedCount > 0) {
        toast.info('Book has been unpublished.')
      } else {
        toast.error('Failed to unpublish, try again.')
      }
      router.refresh()
    } catch {
      toast.error('Failed to unpublish, try again.')
    } finally {
      setLoading(null)
    }
  }

  const handlePublish = async () => {
    setOpen(false)
    setLoading('publish')
    try {
      const res = await adminPublishBook(book._id)
      if (res?.modifiedCount > 0) {
        toast.success('Book has been published!')
      } else {
        toast.error('Failed to publish, try again.')
      }
      router.refresh()
    } catch {
      toast.error('Failed to publish, try again.')
    } finally {
      setLoading(null)
    }
  }

  const isLoading = loading !== null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={isLoading}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40"
        aria-label="Book actions"
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-[#fc4a32] rounded-full animate-spin" />
        ) : (
          <HiDotsVertical className="w-4 h-4" />
        )}
      </button>

      {open && (
        <div className="absolute right-2 top-full mt-1 z-20 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1">
          {/* View */}
          <button
            onClick={() => { setOpen(false); router.push(`/browse/${book._id}`) }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <TiEye className="w-4 h-4 text-gray-400" />
            View details
          </button>

          {/* Edit */}
          <button
            onClick={() => { setOpen(false); router.push(`/dashboard/librarian/edit/${book._id}`) }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <TiEdit className="w-4 h-4 text-gray-400" />
            Edit book
          </button>

          <div className="my-1 border-t border-gray-100" />

          {/* Unpublish — published only */}
          {book.status === 'published' && (
            <button
              onClick={handleUnpublish}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </span>
              Unpublish
            </button>
          )}

          {/* Publish — unpublished OR pending (admin can approve either) */}
          {(book.status === 'unpublished' || book.status === 'pending') && (
            <button
              onClick={handlePublish}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              {book.status === 'pending' ? 'Approve & publish' : 'Publish'}
            </button>
          )}

          <div className="my-1 border-t border-gray-100" />

          {/* Delete */}
          <DeleteBookModal book={book} isAdmin={isAdmin} />
        </div>
      )}
    </div>
  )
}

export default BookActionMenuAdmin