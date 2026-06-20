import Link from "next/link";
import { FaChevronRight, FaStar, FaTruck, FaUser } from "react-icons/fa";
import { motion } from 'framer-motion';

export default function BookCard({ book, index }) {
  const isAvailable = book.status?.availableCount > 0;
  const isFreeDelivery = book.deliveryFee === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group h-full flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover Image */}
      <div  className="relative w-full overflow-hidden aspect-[3/3.4] sm:aspect-3/4">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-left: Category badge */}
        <span
          className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
          }}
        >
          {book.category}
        </span>

        {/* Top-right: Rating pill */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 shadow-sm border border-zinc-100">
          <FaStar className="text-amber-400 shrink-0" size={11} />
          <span className="text-xs font-bold text-zinc-800">
            {book.rating?.average?.toFixed(1) ?? '0.0'}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            ({book.rating?.count ?? 0})
          </span>
        </div>

        {/* Bottom-left: Stock badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg"
            style={{
              background: isAvailable ? '#059669' : '#dc2626',
              color: '#fff',
            }}
          >
            {isAvailable ? `${book.status.availableCount} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Soft gradient overlay at bottom for legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Title + Author */}
        <div className="flex-1">
          <h3
            className="font-bold text-zinc-900 line-clamp-1 text-sm sm:text-base transition-colors duration-150"
            style={{ '--tw-text-opacity': 1 }}
          >
            <span className="group-hover:text-[var(--color-primary)] transition-colors duration-150">
              {book.title}
            </span>
          </h3>

          <div className="flex items-center gap-1.5 mt-1">
            <FaUser size={9} className="text-zinc-400 shrink-0" />
            <span className="text-xs text-zinc-500 font-medium truncate">{book.author}</span>
          </div>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-2.5 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-100" />

        {/* Footer: Delivery fee + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <FaTruck
              size={12}
              className="shrink-0"
              style={{ color: 'var(--color-primary)' }}
            />
            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-400 block leading-none">
                Delivery
              </span>
              <span className="text-sm font-black text-zinc-900 leading-tight block">
                {isFreeDelivery ? (
                  <span style={{ color: '#059669' }}>Free</span>
                ) : (
                  `$${book.deliveryFee?.toFixed(2)}`
                )}
              </span>
            </div>
          </div>

          <Link
            href={`/browse/${book.id}`}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 active:scale-[0.97]"
            style={{
              color: 'var(--color-primary)',
              background: 'var(--color-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
          >
            Details
            <FaChevronRight size={9} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
