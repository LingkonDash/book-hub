'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineTruck } from 'react-icons/hi2';
import { FaGhost, FaBookOpen, FaFlask, FaMasksTheater, FaHandHoldingHeart, FaBriefcase, FaMicrochip, FaMountain } from 'react-icons/fa6';
import { PiArrowRightBold } from 'react-icons/pi';

const CATEGORY_META = {
  'fiction':           { label: 'Fiction',              icon: FaBookOpen,         accent: '#7c3aed' },
  'sci-fi-fantasy':    { label: 'Sci-Fi & Fantasy',     icon: FaFlask,            accent: '#2563eb' },
  'mystery-thriller':  { label: 'Mystery & Thriller',   icon: FaGhost,            accent: '#475569' },
  'biography-history': { label: 'Biography & History',  icon: FaMasksTheater,     accent: '#d97706' },
  'self-help':         { label: 'Self-Help',            icon: FaHandHoldingHeart, accent: '#16a34a' },
  'business-finance':  { label: 'Business & Finance',   icon: FaBriefcase,        accent: '#0d9488' },
  'tech-science':      { label: 'Technology & Science', icon: FaMicrochip,        accent: '#0284c7' },
  'action-adventure':  { label: 'Action & Adventure',   icon: FaMountain,         accent: '#ea580c' },
};

const DEFAULT_META = { label: 'Book', icon: FaBookOpen, accent: '#64748b' };

export default function BookCard({ book }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);

  const {
    _id,
    title       = 'Untitled',
    author      = 'Unknown Author',
    description = '',
    category    = '',
    coverImage,
    deliveryFee = 0,
    status      = 'published',
    stock,
  } = book ?? {};

  const imageUrl  = Array.isArray(coverImage) ? coverImage[0] : coverImage;
  const meta      = CATEGORY_META[category] ?? DEFAULT_META;
  const CatIcon   = meta.icon;

  // Availability — treat any stock === 0 or status !== 'published' as unavailable
  const isAvailable = status === 'published' && (stock === undefined || stock > 0);
  const stockCount  = typeof stock === 'number' ? stock : null;

  return (
    <Link
      href={`/browse/${_id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc4a32]/40 rounded-2xl"
    >
      <motion.div
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:shadow-slate-200/60 transition-shadow duration-300"
      >

        {/* ── Cover ────────────────────────────────────────── */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-50 shrink-0">

          {/* Image */}
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={`Cover of ${title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-2">
              <FaBookOpen className="text-3xl text-slate-300" />
              <span className="text-[10px] text-slate-300 font-medium">No cover</span>
            </div>
          )}

          {/* Persistent dark scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 pointer-events-none" />

          {/* ── Top badges row ──────────────────────────────── */}
          <div className="absolute top-0 inset-x-0 flex items-start justify-between p-2.5 gap-2">

            {/* Availability badge */}
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm border ${
                isAvailable
                  ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/50'
              }`}
            >
              {/* Pulse dot — only when available */}
              {isAvailable && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              )}
              {isAvailable
                ? stockCount !== null ? `${stockCount} Available` : 'Available'
                : 'Unavailable'
              }
            </motion.div>

            {/* Category badge */}
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wide backdrop-blur-sm bg-black/40 text-white border border-white/10 uppercase"
            >
              <CatIcon className="text-[10px]" />
              {meta.label}
            </span>
          </div>

          {/* ── Bottom info strip over scrim ────────────────── */}
          <div className="absolute bottom-0 inset-x-0 p-3">

            {/* Author */}
            <p className="text-[11px] text-white/60 font-medium mb-0.5 truncate">
              {author}
            </p>

            {/* Title */}
            <h3 className="text-sm font-black text-white leading-snug line-clamp-2 tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* ── Card body ────────────────────────────────────── */}
        <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-3">

          {/* Description — always visible, not hidden behind hover */}
          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
            {description || 'No description available for this title.'}
          </p>

          {/* ── Footer row ─────────────────────────────────── */}
          <div className="mt-auto flex items-center justify-between gap-2">

            {/* Delivery fee */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">
                Delivery fee
              </p>
              <p className="text-base font-black text-slate-900 leading-none">
                <span className="text-xs font-semibold text-slate-400 mr-0.5">$</span>
                {deliveryFee.toFixed(2)}
              </p>
            </div>

            {/* CTA button */}
            <motion.div
              animate={{
                backgroundColor: hovered ? '#fc4a32' : '#fff5f3',
                color:           hovered ? '#ffffff' : '#fc4a32',
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-[#fad4de] cursor-pointer"
            >
              <HiOutlineTruck className="text-sm shrink-0" />
              <span className="whitespace-nowrap">
                {isAvailable ? 'Request' : 'Notify me'}
              </span>
              <motion.span
                animate={{ x: hovered ? 2 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <PiArrowRightBold className="text-xs" />
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}