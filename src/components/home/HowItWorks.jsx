"use client";

import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    id: 1,
    title: "Browse & Discover",
    description:
      "Explore our curated library of books across genres. Search, filter, and find your next great read with ease.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reader1&backgroundColor=fad4de",
    avatarName: "Amara",
    avatarRole: "Book Enthusiast",
    tag: "Step 1",
  },
  {
    id: 2,
    title: "Request Delivery",
    description:
      "Pick your books and place a delivery order. Pay securely via Stripe — simple, fast, and reliable.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
      </svg>
    ),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=librarian2&backgroundColor=fad4de",
    avatarName: "Selin",
    avatarRole: "Librarian",
    tag: "Step 2",
  },
  {
    id: 3,
    title: "Track Your Order",
    description:
      "Watch live status updates — Pending → Dispatched → Delivered — right from your personal dashboard.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tracker3&backgroundColor=fad4de",
    avatarName: "Rafi",
    avatarRole: "Regular Reader",
    tag: "Step 3",
  },
  {
    id: 4,
    title: "Read & Review",
    description:
      "Once delivered, enjoy your books and leave a verified review. Your voice shapes the community.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer4&backgroundColor=fad4de",
    avatarName: "Nadia",
    avatarRole: "Top Reviewer",
    tag: "Step 4",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.14,
      type: "spring",
      stiffness: 55,
      damping: 14,
    },
  }),
};

function StepCard({ step, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col bg-white rounded-2xl border border-[#fad4de] p-6 w-full cursor-default overflow-hidden group transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(252,74,50,0.13)]"
    >
      {/* Subtle background glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-[#fff5f4] to-white pointer-events-none rounded-2xl"
      />

      {/* Top row: step tag + avatar */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full bg-[#fad4de] text-[#fc4a32]">
          {step.tag}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#fad4de] bg-[#fad4de] flex-shrink-0">
            <img
              src={step.avatar}
              alt={step.avatarName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-right leading-none">
            <p className="text-[12px] font-semibold text-[#fc4a32] m-0">{step.avatarName}</p>
            <p className="text-[10px] text-gray-400 m-0">{step.avatarRole}</p>
          </div>
        </div>
      </div>

      {/* Icon */}
      <motion.div
        animate={{
          backgroundColor: hovered ? "#fc4a32" : "#fff5f4",
          color: hovered ? "#ffffff" : "#fc4a32",
          scale: hovered ? 1.08 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center mb-4"
      >
        {step.icon}
      </motion.div>

      {/* Text */}
      <div className="relative z-10">
        <h3 className="text-[17px] font-bold text-gray-900 mb-2 tracking-tight m-0">
          {step.title}
        </h3>
        <p className="text-[13.5px] leading-relaxed text-gray-500 m-0">
          {step.description}
        </p>
      </div>

      {/* Bottom accent line on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#fc4a32] to-[#fad4de] origin-left rounded-b-2xl"
      />
    </motion.div>
  );
}

function FloatingNumber({ n, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="text-[11px] font-bold text-[#fc4a32] bg-[#fad4de] rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
    >
      {n}
    </motion.span>
  );
}

function ProcessTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const rows = [
    { n: 1, label: "Browse books", sub: "Search & filter the catalog" },
    { n: 2, label: "Pay delivery fee", sub: "Secured by Stripe" },
    { n: 3, label: "Get it dispatched", sub: "Librarian ships your order" },
    { n: 4, label: "Leave a review", sub: "Only after delivery confirmed" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="bg-white border border-[#fad4de] rounded-2xl p-6"
    >
      <p className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4 m-0">
        Quick Overview
      </p>
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <motion.div
            key={r.n}
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <FloatingNumber n={r.n} delay={0.35 + i * 0.1} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-800 m-0 truncate">{r.label}</p>
              <p className="text-[11px] text-gray-400 m-0">{r.sub}</p>
            </div>
            {i < rows.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                className="absolute left-[30px] w-[2px] h-3 bg-[#fad4de] translate-y-5"
                style={{ marginLeft: "11px", position: "absolute" }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function StatBadge({ value, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, type: "spring", stiffness: 120 }}
      className="flex flex-col items-center bg-white border border-[#fad4de] rounded-2xl py-4 px-6"
    >
      <span className="text-2xl font-extrabold text-[#fc4a32]">{value}</span>
      <span className="text-[12px] text-gray-500 mt-0.5 text-center leading-tight">{label}</span>
    </motion.div>
  );
}

export default function HowItWorks() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="howItWorks" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#fdfcfc]">

      {/* Decorative blobs — purely visual, no layout impact */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#fad4de]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#fc4a32]/10 blur-3xl" />

      <div className="relative max-w-380 mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 mb-4 text-[11px] font-bold tracking-widest uppercase bg-[#fad4de] text-[#fc4a32] rounded-full">
            Simple Process
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            How{" "}
            <span className="text-[#fc4a32]">BookHub</span>{" "}
            Works
          </h2>

          <p className="mx-auto text-[15px] text-gray-500 max-w-md leading-relaxed">
            From discovery to your doorstep — books you love, delivered in four simple steps.
          </p>

          {/* Animated dot trail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-1.5 mt-5"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                className={`h-1.5 rounded-full bg-[#fc4a32] ${i === 2 ? "w-6" : "w-1.5"}`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ── STAT BADGES ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          <StatBadge value="2,400+" label="Books Available" delay={0.1} />
          <StatBadge value="98%" label="On-Time Delivery" delay={0.18} />
          <StatBadge value="4.9★" label="Avg. Rating" delay={0.26} />
          <StatBadge value="12k+" label="Happy Readers" delay={0.34} />
        </div>

        {/* ── MAIN CONTENT: Cards + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Step Cards — 2-col grid on md, stacked on sm */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <StepCard key={step.id} step={step} index={i} />
            ))}
          </div>

          {/* Sidebar: Timeline + CTA stacked */}
          <div className="w-full lg:w-[280px] flex flex-col gap-4 flex-shrink-0">
            <ProcessTimeline />

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.55 }}
              className="bg-linear-to-br from-[#fc4a32] to-[#ff6e54] rounded-2xl p-6 flex flex-col gap-4"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl"
              >
                📚
              </motion.div>
              <div>
                <p className="text-white font-bold text-[17px] mb-1 m-0">Start Reading Today</p>
                <p className="text-white/75 text-[13px] m-0 leading-snug">
                  Join thousands of readers already on BiblioDropp.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="block text-center text-[13px] font-bold text-[#fc4a32] bg-white rounded-xl py-2.5 px-4 no-underline transition-shadow hover:shadow-md"
                >
                  Get Started Free
                </motion.a>
                <motion.a
                  href="/browse"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.97 }}
                  className="block text-center text-[13px] font-semibold text-white border border-white/40 rounded-xl py-2.5 px-4 no-underline transition-colors"
                >
                  Browse Books
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}