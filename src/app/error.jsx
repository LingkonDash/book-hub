// app/error.js
'use client';

import { useEffect } from 'react';
import { BiBookOpen } from 'react-icons/bi';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { TbReload } from 'react-icons/tb';
import { MdOutlineHome } from 'react-icons/md';
import Link from 'next/link';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('[BiblioDropp Error]:', error);
  }, [error]);

  const message = error?.message || 'Something went wrong on our end.';
  const digest  = error?.digest;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6">

      {/* ── Decorative bg blobs ───────────────────────────────── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#fad4de]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[320px] h-[320px] rounded-full bg-[#fc4a32]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

        {/* ── Icon mark ─────────────────────────────────────────── */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer ring */}
          <div className="absolute w-[88px] h-[88px] rounded-full border-[1.5px] border-[#fad4de]" />
          {/* Icon bg */}
          <div className="w-[68px] h-[68px] rounded-full bg-[#fff0ee] flex items-center justify-center">
            <BiBookOpen className="text-[#fc4a32] text-[28px]" />
          </div>
          {/* Error badge */}
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#fc4a32] flex items-center justify-center shadow-sm shadow-[#fc4a32]/30">
            <HiOutlineExclamationTriangle className="text-white text-[13px]" />
          </div>
        </div>

        {/* ── Wordmark ──────────────────────────────────────────── */}
        <p className="text-[13px] font-bold uppercase tracking-widest text-slate-400 mb-5">
          Book<span className="text-[#fc4a32]">Hub</span>
        </p>

        {/* ── Heading ───────────────────────────────────────────── */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Oops. Something broke.
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          We hit an unexpected error while loading this page.
          Try refreshing — it usually fixes itself.
        </p>

        {/* ── Error message box ─────────────────────────────────── */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 mb-8 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Error detail
          </p>
          <p className="text-xs text-slate-600 font-medium leading-relaxed break-words">
            {message}
          </p>
          {digest && (
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              ID: {digest}
            </p>
          )}
        </div>

        {/* ── Actions ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#fc4a32] hover:bg-[#e03e28] active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all duration-150 cursor-pointer"
          >
            <TbReload className="text-base" />
            Try again
          </button>

          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-sm font-bold rounded-xl transition-all duration-150"
          >
            <MdOutlineHome className="text-base" />
            Go home
          </Link>
        </div>

        {/* ── Footer note ───────────────────────────────────────── */}
        <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
          If this keeps happening, reach out at{' '}
          <a
            href="mailto:support@bibliodrop.com"
            className="text-[#fc4a32] font-medium hover:underline underline-offset-2"
          >
            support@bookhub.com
          </a>
        </p>
      </div>
    </div>
  );
}