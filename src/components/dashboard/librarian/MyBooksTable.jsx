'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BookStatusBadge from './BookStatusBadge'
import BookActionMenu from './BookActionMenu'
import { TiBook } from 'react-icons/ti'
import BookActionMenuAdmin from '../admin/BookActionMenuAdmin'

const COLUMNS = [
  { key: 'cover', label: '', width: 'w-14' },
  { key: 'title', label: 'Title', width: 'w-auto' },
  { key: 'category', label: 'Category', width: 'w-32' },
  { key: 'fee', label: 'Fee', width: 'w-24' },
  { key: 'status', label: 'Status', width: 'w-28' },
  { key: 'actions', label: 'Actions', width: 'w-16' },
]

const MyBooksTable = ({ initialBooks, isAdmin = false }) => {
  const [books, setBooks] = useState(initialBooks)

  // Sync state cleanly whenever router.refresh() yields updated server arrays
  useEffect(() => {
    setBooks(initialBooks)
  }, [initialBooks])

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
          <div className="md:hidden divide-y divide-gray-100 p-2 space-y-3">
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
                  {isAdmin === true ?
                    <BookActionMenuAdmin book={book} isAdmin={isAdmin} />
                    :
                    <BookActionMenu book={book} />
                  }
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
                      className={`${col.width} px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 ${col.key === 'actions' ? 'text-right' : ''
                        }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {books?.map((book) => (
                  <BookRow
                    key={book._id}
                    book={book}
                    isAdmin={isAdmin}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

const BookRow = ({ book, isAdmin }) => (
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
      {isAdmin ?
        <BookActionMenuAdmin book={book} isAdmin={isAdmin} />
        :
        <BookActionMenu book={book} />
      }
    </td>
  </tr>
)

export default MyBooksTable;