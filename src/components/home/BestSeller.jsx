"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useAnimation, useMotionValue, animate } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiUser, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const bestSellersMock = [
  {
    id: 1,
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    description: "An epic high-fantasy novel that sets off an incredible adventure across Middle-earth.",
    category: "Fantasy",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400",
    deliveryFee: 4.50,
    status: { stage: "Available", count: 5 }
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel focusing on the dangers of totalitarianism and extreme surveillance.",
    category: "Dystopian",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400",
    deliveryFee: 3.00,
    status: { stage: "Available", count: 3 }
  },
  {
    id: 3,
    title: "Neuromancer",
    author: "William Gibson",
    description: "The seminal cyberpunk novel following a washed-up computer hacker hired for one last ultimate corporate heist.",
    category: "Sci-Fi",
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400",
    deliveryFee: 5.00,
    status: { stage: "Checked Out", count: 0 }
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A profound exploration of racial injustice and destroyed innocence in the American Deep South.",
    category: "Classic Literature",
    coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400",
    deliveryFee: 3.50,
    status: { stage: "Available", count: 2 }
  },
  {
    id: 5,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A critique of the disillusioned post-war American Dream set amid the roaring jazz age of Long Island.",
    category: "Classics",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
    deliveryFee: 2.50,
    status: { stage: "Available", count: 4 }
  },
  {
    id: 6,
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A visionary dystopian novel exploring a genetically engineered, highly automated caste society.",
    category: "Sci-Fi",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400",
    deliveryFee: 4.00,
    status: { stage: "Checked Out", count: 0 }
  }
];

const CARD_WIDTH = 300;
const CARD_GAP = 24;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const AUTO_INTERVAL = 2200;

// Triple-clone the list so we can jump seamlessly
const tripled = [...bestSellersMock, ...bestSellersMock, ...bestSellersMock];

export default function BestSeller() {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const dragStartX = useRef(0);
  const dragStartMotionX = useRef(0);
  const autoRef = useRef(null);
  const loopRef = useRef(null);

  const touchStartX = useRef(0);
  const touchStartMotionX = useRef(0);

  // The "home" offset = start of the middle set of cards
  const originOffset = -(bestSellersMock.length * CARD_STEP);

  // Section boundary for loop detection
  const sectionWidth = bestSellersMock.length * CARD_STEP;

  useEffect(() => {
    // Start at the middle clone so we can go both directions infinitely
    x.set(originOffset);
  }, []);

  // Loop check — called after every x change
  const checkLoop = () => {
    const current = x.get();
    // If we've drifted into the first clone region or past the last clone region, jump silently
    if (current > originOffset + sectionWidth - CARD_STEP) {
      x.set(current - sectionWidth);
    } else if (current < originOffset - sectionWidth + CARD_STEP) {
      x.set(current + sectionWidth);
    }
  };

  // Subscribe to motion value changes for loop detection
  useEffect(() => {
    const unsub = x.on('change', checkLoop);
    return () => unsub();
  }, []);

  // Auto-scroll ticker
  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(() => {
      if (isDragging.current || isHovered.current) return;
      animate(x, x.get() - CARD_STEP, {
        duration: 0.7,
        ease: [0.32, 0.72, 0, 1],
      });
    }, AUTO_INTERVAL);
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  // Manual nav buttons
  const stepTo = (dir) => {
    stopAuto();
    animate(x, x.get() + dir * -CARD_STEP, {
      duration: 0.55,
      ease: [0.32, 0.72, 0, 1],
    });
    startAuto();
  };

  // Pointer drag handlers (works on mouse + touch for desktop grab feel)
  const onPointerDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartMotionX.current = x.get();
    stopAuto();
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    x.set(dragStartMotionX.current + delta * 1.2);
  };

  const onPointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Snap to nearest card
    const snapped = Math.round(x.get() / CARD_STEP) * CARD_STEP;
    animate(x, snapped, {
      duration: 0.45,
      ease: [0.32, 0.72, 0, 1],
    });
    startAuto();
  };


  // Add these touch handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartMotionX.current = x.get();
    stopAuto();
    isHovered.current = true;
  };

  const onTouchMove = (e) => {
    const delta = e.touches[0].clientX - touchStartX.current;
    x.set(touchStartMotionX.current + delta * 1.2);
  };

  const onTouchEnd = () => {
    isHovered.current = false;
    const snapped = Math.round(x.get() / CARD_STEP) * CARD_STEP;
    animate(x, snapped, {
      duration: 0.45,
      ease: [0.32, 0.72, 0, 1],
    });
    startAuto();
  };


  const onMouseEnter = () => {
    isHovered.current = true;
  };

  const onMouseLeave = () => {
    isHovered.current = false;
    if (isDragging.current) {
      isDragging.current = false;
      const snapped = Math.round(x.get() / CARD_STEP) * CARD_STEP;
      animate(x, snapped, { duration: 0.45, ease: [0.32, 0.72, 0, 1] });
    }
  };

  // Section header entrance animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "backOut" }
    }
  };

  return (
    <section className="w-full py-16 bg-secondary/20 overflow-hidden">
      <div className="max-w-380 mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <motion.span
              variants={badgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full"
            >
              Curated Collections
            </motion.span>

            <motion.h2
              variants={headerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3 tracking-tight"
            >
              Trending Best Sellers
            </motion.h2>

            <motion.p
              variants={headerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-sm md:text-base"
            >
              Explore the most requested books this week. Reserve your copy instantly and get safe doorstep delivery managed securely via Stripe.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end"
          >
            <Link
              href="/browse"
              className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors duration-150"
            >
              <span>View Entire Catalog</span>
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => stepTo(-1)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                aria-label="Scroll left"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => stepTo(1)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                aria-label="Scroll right"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="overflow-hidden"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <motion.div
            ref={trackRef}
            style={{ x, display: 'flex', gap: CARD_GAP, willChange: 'transform', touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`select-none ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {tripled.map((book, index) => {
              const isAvailable = book.status.stage === "Available";
              // Only animate entrance for the first render pass of the middle clone
              const isMiddleSet = index >= bestSellersMock.length && index < bestSellersMock.length * 2;

              return (
                <motion.div
                  key={`${book.id}-${index}`}
                  style={{ minWidth: CARD_WIDTH, width: CARD_WIDTH }}
                  initial={isMiddleSet ? { opacity: 0, y: 40, scale: 0.95 } : false}
                  whileInView={isMiddleSet ? { opacity: 1, y: 0, scale: 1 } : false}
                  viewport={{ once: true, margin: "0px -80px" }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: (index - bestSellersMock.length) * 0.07
                  }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between group overflow-hidden shrink-0"
                >
                  {/* Image Block */}
                  <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ aspectRatio: '4/5' }}>
                    <span className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${isAvailable
                      ? "bg-emerald-500/90 dark:bg-emerald-600/90 text-white"
                      : "bg-rose-500/90 dark:bg-rose-600/90 text-white"
                      }`}>
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {isAvailable ? `${book.status.count} Available` : 'Checked Out'}
                    </span>

                    <span className="absolute top-3 right-3 z-10 bg-slate-900/70 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-xs">
                      {book.category}
                    </span>

                    <motion.img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover pointer-events-none"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      loading="lazy"
                    />

                    {/* Overlay shimmer on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Content Block */}
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

                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Link
                          href={`/browse/${book.id}`}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-colors duration-150 shadow-sm shadow-primary/10"
                        >
                          <FiBookOpen className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}