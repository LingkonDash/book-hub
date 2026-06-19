"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiTruck, FiShield, FiHeart } from 'react-icons/fi';
import bannerBg from '@/images/bannerBG.png';
import bannerImg from '@/images/bannerImage.png';
import HeroImageWithRings from './HeroImageWithRings';

export default function Banner() {
  return (
    <div className="relative w-full flex items-center overflow-hidden pb-24 pt-40 md:pt-35 bg-slate-50">

      {/* 1. Single Background Image Container */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 scale-110 transform animate-[subtle-zoom_10s_ease-out_infinite]"
        style={{
          backgroundImage: `url(${bannerBg.src})`
        }}
      />

      {/* 2. Light & Subtle Brand Overlay for Perfect Contrast (No Dark Screen) */}
      <div className="absolute inset-0 bg-linear-to-l from-primary/20 via-primary/10 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-primary/20 z-10" />

      {/* 3. Hero Content Grid */}
      <div className="w-full max-w-400 mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-12 items-center h-full sm:gap-15 md:gap-10 gap-22">
        
        {/* LEFT SIDE - Hero Image Container with Rings (Visible on mobile & desktop) */}
        <div className="flex lg:col-span-6 relative items-center justify-center h-100 sm:h-125">

          {/* Centered Main Image Container with Soft Floating Animation */}
          <HeroImageWithRings />

          {/* Floating Note Chunk 1: Fast Deliveries */}
          <motion.div
            animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-12 left-4 z-20 flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-sm shadow-md rounded-2xl border border-slate-100"
          >
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <FiTruck className="text-sm" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">Fast Delivery</span>
              <span className="text-[10px] text-slate-500 font-medium">To your doorstep</span>
            </div>
          </motion.div>

          {/* Floating Note Chunk 2: Secure Payments */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-16 left-8 z-20 flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-sm shadow-md rounded-2xl border border-slate-100"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FiShield className="text-sm" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">Stripe Secured</span>
              <span className="text-[10px] text-slate-500 font-medium">Safe transactions</span>
            </div>
          </motion.div>

          {/* Floating Note Chunk 3: Catalog Count */}
          <motion.div
            animate={{ y: [0, 12, 0], x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-1/2 -right-2 z-20 flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-sm shadow-md rounded-2xl border border-slate-100"
          >
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <FiHeart className="text-sm" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">10,000+ Books</span>
              <span className="text-[10px] text-slate-500 font-medium">Academic & Fiction</span>
            </div>
          </motion.div>

        </div>

        {/* RIGHT SIDE - Content remains locked into right alignment block, internally centered */}
        <div className="col-span-1 lg:col-span-6 space-y-4 text-center flex flex-col items-center justify-center">

          {/* Subtle Tagline Badge incorporating your brand color tint */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: 'rgba(242, 34, 83, 0.1)', color: '#f22253' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20 tracking-wide"
          >
            <FiTruck className="text-base" />
            <span>Doorstep Book Deliveries Across the Network</span>
          </motion.div>

          {/* Main Typography Header - High Contrast Dark Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-[55px] font-extrabold tracking-tight leading-[1.15] max-w-2xl text-slate-900"
          >
            Your Local Library, <br />
            <span style={{ color: '#f22253' }}>
              Delivered Straight to You.
            </span>
          </motion.h1>

          {/* Descriptive Body Paragraph - Warm Soft Dark Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-700 text-lg md:text-xl max-w-xl font-medium leading-relaxed opacity-95"
          >
            Skip the physical commute. Dive into vast academic resources, literary classics, and modern titles on BookHub—Secured with Stripe and delivered quickly to your doorstep.
          </motion.p>

          {/* 4. Action Button with specialized Dark UI Hover Logic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/browse"
              style={{ borderColor: '#f22253' }}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#fad4de] hover:bg-primary/80 text-slate-900 text-base font-bold rounded-2xl shadow-md border transition-all duration-300 transform active:scale-98"
            >
              {/* Dynamic Dark Shift UI hover layer */}
              <span className="absolute inset-0 w-full h-full bg-slate-950 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300 ease-out -z-10" />

              <FiBookOpen className="text-lg group-hover:text-white transition-colors duration-200" />
              <span className="group-hover:text-white transition-colors duration-200">Browse Book Catalog</span>
              <FiArrowRight className="text-lg group-hover:text-white transition-all duration-200 transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Embedded style tag to handle background image subtle pan animation */}
      <style jsx global>{`
        @keyframes subtle-zoom {
          0%, 100% { transform: scale(1.02) translate(0px, 0px); }
          50% { transform: scale(1.05) translate(-3px, -3px); }
        }
      `}</style>
    </div>
  );
}