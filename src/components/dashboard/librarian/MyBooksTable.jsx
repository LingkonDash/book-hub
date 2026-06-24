'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Image from 'next/image'
import BookStatusBadge from './BookStatusBadge'
import BookActionMenu from './BookActionMenu'
import { TiBook } from 'react-icons/ti'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { getLibrarianBooks } from '@/lib/api/librarian/getLibrarianBooks'

const COLUMNS = [
  { key: 'cover',   label: '',          width: 'w-14' },
  { key: 'title',   label: 'Title',     width: 'w-auto' },
  { key: 'category',label: 'Category',  width: 'w-32' },
  { key: 'fee',     label: 'Fee',       width: 'w-24' },
  { key: 'status',  label: 'Status',    width: 'w-28' },
  { key: 'actions', label: 'Actions',   width: 'w-16' },
]

const MyBooksTable = ({ initialBooks, totalPage, currentPage, librarianId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [books, setBooks] = useState(initialBooks)
  const [page, setPage] = useState(currentPage)
  const [total, setTotal] = useState(totalPage)
  const [isPending, startTransition] = useTransition()

  const fetchPage = (newPage) => {
    startTransition(async () => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', newPage)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })

      const res = await getLibrarianBooks(librarianId, newPage)
      setBooks(res.data)
      setPage(res.currentPage)
      setTotal(res.totalPage)
    })
  }

  const refreshCurrent = () => {
    fetchPage(page);
  }

  const hasPrev = page > 1
  const hasNext = page < total

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">

      {/* Empty State Handler */}
      {books?.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <TiBook className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No books yet. Start by adding your first book.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card List View (Visible below md) */}
          <div className={`md:hidden divide-y divide-gray-100 p-2 space-y-3 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {books?.map((book) => (
              <div key={book._id} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex gap-4 items-start relative">
                
                {/* Mobile Cover image container */}
                <div className="w-16 h-22 rounded-md overflow-hidden bg-[#fad4de] flex-shrink-0 relative shadow-sm">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TiBook className="w-5 h-5 text-[#fc4a32]" />
                    </div>
                  )}
                </div>

                {/* Mobile Details Text Wrapper */}
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{book.title}</h3>
                  <p className="text-xs text-gray-400 truncate mb-2">{book.author}</p>
                  
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                      {book.category}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                      ${book.deliveryFee}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <BookStatusBadge status={book.status} />
                  </div>
                </div>

                {/* Mobile Floating Actions Absolute Anchor */}
                <div className="absolute top-2 right-2">
                  <BookActionMenu book={book} onActionComplete={refreshCurrent} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Spreadsheet View (Visible on md and above) */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className={`${col.width} px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 ${
                        col.key === 'actions' ? 'text-right' : ''
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className={`divide-y divide-gray-50 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {books?.map((book) => (
                  <BookRow
                    key={book._id}
                    book={book}
                    onActionComplete={refreshCurrent}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination Wrapper Frame */}
      {total > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-white rounded-b-2xl mt-4 sm:mt-0">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            Page <span className="font-medium text-gray-600">{page}</span> of{' '}
            <span className="font-medium text-gray-600">{total}</span>
          </p>

          <div className="flex items-center justify-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => fetchPage(page - 1)}
              disabled={!hasPrev || isPending}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 max-w-[240px] sm:max-w-none overflow-x-auto px-1 scrollbar-none">
              {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => fetchPage(n)}
                  disabled={isPending}
                  className={`w-7 h-7 flex-shrink-0 rounded-lg text-xs font-medium transition-colors ${
                    n === page
                      ? 'bg-[#fc4a32] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchPage(page + 1)}
              disabled={!hasNext || isPending}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const BookRow = ({ book, onActionComplete }) => (
  <tr className="hover:bg-gray-50/60 transition-colors group">
    {/* Cover */}
    <td className="px-4 py-3 w-14">
      <div className="w-9 h-12 rounded-md overflow-hidden bg-[#fad4de] flex-shrink-0 relative shadow-sm">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
            sizes="36px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TiBook className="w-4 h-4 text-[#fc4a32]" />
          </div>
        )}
      </div>
    </td>

    {/* Title + Author */}
    <td className="px-4 py-3">
      <p className="font-medium text-gray-800 leading-tight line-clamp-1">{book.title}</p>
      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{book.author}</p>
    </td>

    {/* Category */}
    <td className="px-4 py-3 w-32">
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full line-clamp-1">
        {book.category}
      </span>
    </td>

    {/* Delivery Fee */}
    <td className="px-4 py-3 w-24">
      <span className="text-sm font-medium text-gray-700">
        $ {book.deliveryFee}
      </span>
    </td>

    {/* Status */}
    <td className="px-4 py-3 w-28">
      <BookStatusBadge status={book.status} />
    </td>

    {/* Actions */}
    <td className="px-4 py-3 w-16 text-right overflow-visible">
      <BookActionMenu book={book} onActionComplete={onActionComplete} />
    </td>
  </tr>
)

export default MyBooksTable