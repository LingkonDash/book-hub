'use client'

import { useState, useRef, useEffect } from 'react'
import { TiEye, TiEdit, TiTrash, TiChevronRight } from 'react-icons/ti'
import { HiDotsVertical } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { unpublishBook } from '@/lib/action/librarianAction/unpublishBook'
import { publishBook } from '@/lib/action/librarianAction/publishBook'

const BookActionMenu = ({ book, onActionComplete }) => {
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
      await unpublishBook(book._id)
      toast.success('Book unpublished.')
      onActionComplete()
    } catch {
      toast.error('Failed to unpublish.')
    } finally {
      setLoading(null)
    }
  }

  const handlePublish = async () => {
    setOpen(false)
    setLoading('publish')
    try {
      await publishBook(book._id)
      toast.success('Book published!')
      onActionComplete()
    } catch {
      toast.error('Failed to publish.')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async () => {
    setOpen(false)
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"? This cannot be undone.`
    )
    if (!confirmed) return

    try {
      await deleteBook(book._id)
      toast.success('Book deleted.')
      onActionComplete()
    } catch {
      toast.error('Failed to delete.')
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
        <div className="absolute right-2 top-full mt-1 z-100 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1">
          {/* View — always available */}
          <button
            onClick={() => {
              setOpen(false)
              router.push(`/browse/${book._id}`)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <TiEye className="w-4 h-4 text-gray-400" />
            View details
          </button>

          {/* Edit — always available */}
          <button
            onClick={() => {
              setOpen(false)
              router.push(`/dashboard/librarian/edit/${book._id}`)
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <TiEdit className="w-4 h-4 text-gray-400" />
            Edit book
          </button>

          <div className="my-1 border-t border-gray-100" />

          {/* Unpublish — only for published */}
          {book.status === 'published' && (
            <button
              onClick={handleUnpublish}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </span>
              Unpublish
            </button>
          )}

          {/* Publish — only for unpublished (NOT pending) */}
          {book.status === 'unpublished' && (
            <button
              onClick={handlePublish}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              Publish
            </button>
          )}

          {/* Pending — disabled info row, no action */}
          {book.status === 'pending' && (
            <div className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-400 cursor-default select-none">
              <span className="w-4 h-4 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-amber-300" />
              </span>
              Awaiting review
            </div>
          )}

          <div className="my-1 border-t border-gray-100" />

          {/* Delete — always available */}
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <TiTrash className="w-4 h-4" />
            Delete book
          </button>
        </div>
      )}
    </div>
  )
}

export default BookActionMenu