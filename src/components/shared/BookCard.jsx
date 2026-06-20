import Link from 'next/link';
import React from 'react';
import { FiBookOpen, FiDollarSign, FiUser } from 'react-icons/fi';

const BookCard = ({ book }) => {
  
  return (
    <div
      key={book.id}
      className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 overflow-hidden"
    >
      {/* Top Section: Media Asset & Sticky Indicator Layers */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* Dynamic Interactive Stock Badge */}
        <span className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md transition-colors duration-300 ${isAvailable
          ? "bg-emerald-500/90 dark:bg-emerald-600/90 text-white"
          : "bg-rose-500/90 dark:bg-rose-600/90 text-white"
          }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {isAvailable ? `${book.status.count} Available` : 'Checked Out'}
        </span>

        {/* Category Identifier */}
        <span className="absolute top-3 right-3 z-10 bg-slate-900/70 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-xs">
          {book.category}
        </span>

        {/* Core Book Image Asset with Clean Tailwind Hover Scale Animation */}
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Modern Overlay Gradient Mask on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Bottom Section: Text Content & Primary Call to Actions */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
            <FiUser className="shrink-0" />
            <span className="truncate">{book.author}</span>
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1 tracking-tight group-hover:text-primary transition-colors duration-150">
            {book.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Structural Info & Call to Action Trigger */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Delivery Fee
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white flex items-center">
              <FiDollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 -mr-0.5" />
              {book.deliveryFee.toFixed(2)}
            </span>
          </div>

          <Link
            href={`/browse/${book.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-colors duration-150 shadow-sm shadow-primary/10 active:scale-98"
          >
            <FiBookOpen className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default BookCard;