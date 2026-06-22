'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BiBookOpen } from 'react-icons/bi';
import { TbBooks, TbArrowLeft, TbHome } from 'react-icons/tb';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center px-6 relative overflow-hidden antialiased">
      
      {/* ── Background decorative blobs ────────────────────────── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#fad4de]/30 to-transparent blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#fc4a32]/10 to-transparent blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        
        {/* ── Brand mark ────────────────────────────────────────── */}
        <div className="flex items-center gap-2  bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-[#fff0ee] flex items-center justify-center">
            <BiBookOpen className="text-[#fc4a32] text-xs" />
          </div>
          <span className="text-xs font-bold text-slate-600 tracking-wide">
            Book<span className="text-[#fc4a32]">Hub</span>
          </span>
        </div>

        {/* ── Big 404 Hero display ──────────────────────────────── */}
        <div className="relative mb-4 select-none pointer-events-none mix-blend-multiply opacity-80">
          <p className="text-[130px] sm:text-[160px] font-black bg-linear-to-b from-slate-500 to-slate-200 bg-clip-text text-transparent leading-none tracking-tighter">
            404
          </p>
        </div>

        {/* ── Copy ──────────────────────────────────────────────── */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Lost in the stacks?
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-sm">
          The page you are looking for does not exist or may have been moved. 
          Let&apos;s get you back on track to finding your next read.
        </p>

        {/* ── Suggestion Card ───────────────────────────────────── */}
        <div className="w-full bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 text-left group hover:border-[#fc4a32]/20 transition-colors duration-200">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#fff0ee] flex items-center justify-center shrink-0">
              <TbBooks className="text-[#fc4a32] text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 mb-0.5">Browse the marketplace</p>
              <p className="text-[11px] text-slate-400 leading-normal max-w-[200px] truncate sm:whitespace-normal">
                Thousands of titles ready for doorstep delivery.
              </p>
            </div>
          </div>
          <Link
            href="/browse"
            className="shrink-0 text-xs font-bold text-[#fc4a32] bg-[#fff0ee] hover:bg-[#fc4a32] hover:text-white px-3.5 py-2 rounded-xl transition-all duration-200"
          >
            Explore
          </Link>
        </div>

        {/* ── Primary Navigation Actions ────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          <Link
            href="/"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-[#fc4a32] hover:bg-[#e03e28] shadow-sm shadow-[#fc4a32]/10 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all duration-150"
          >
            <TbHome className="text-base" />
            Go home
          </Link>
          <button
            onClick={() => router.back()}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer"
          >
            <TbArrowLeft className="text-base" />
            Go back
          </button>
        </div>

      </div>
    </div>
  );
}