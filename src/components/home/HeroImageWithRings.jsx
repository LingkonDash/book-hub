"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import bannerImg from '@/images/bannerImage.png';


export default function HeroImageWithRings() {
  return (
    <div className="relative w-full flex items-center justify-center py-20 px-10 overflow-visible">
      {/* --- BACKGROUND ORBITAL RINGS --- */}
      {/* Outer Ring */}
      <motion.div
        className="absolute rounded-full border-2 border-dashed border-primary/20 pointer-events-none"
        style={{ width: "120%", height: "120%", maxWidth: "600px", maxHeight: "600px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle Ring */}
      <motion.div
        className="absolute rounded-full border border-double border-secondary/30 pointer-events-none"
        style={{ width: "105%", height: "105%", maxWidth: "520px", maxHeight: "520px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Glowing Ring */}
      <motion.div
        className="absolute rounded-full border border-primary/40 bg-linear-to-r from-primary/5 to-secondary/5 blur-sm pointer-events-none"
        style={{ width: "90%", height: "90%", maxWidth: "450px", maxHeight: "450px" }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* --- CENTRAL IMAGE CONTAINER --- */}
      {/* We use an explicit height/width frame with explicit margins 
        to isolate the image from the expansive floating rings.
      */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-95 aspect-4/5 rounded-3xl p-3 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl"
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
          <Image
            src={bannerImg} // Swap with your exact asset path
            alt="BookHub Premium Showcase"
            fill
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
            priority
          />
          {/* Elegant Dark Subtle Vignette Layer */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}