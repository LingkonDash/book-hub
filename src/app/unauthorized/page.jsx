// app/unauthorized/page.jsx  (or wherever you route unauthorized users)
import Link from 'next/link';
import { BiBookOpen } from 'react-icons/bi';
import { TbLock, TbLogin, TbHome, TbShieldOff } from 'react-icons/tb';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* ── Background blobs ──────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#fad4de]/25 blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#fc4a32]/5 blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">

        {/* ── Icon mark ─────────────────────────────────────────── */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Pulsing outer ring */}
          <div className="absolute w-[100px] h-[100px] rounded-full bg-[#fad4de]/40 animate-ping" />
          <div className="absolute w-[88px] h-[88px] rounded-full border-[1.5px] border-[#fad4de]" />
          <div className="w-[68px] h-[68px] rounded-full bg-[#fff0ee] flex items-center justify-center">
            <TbShieldOff className="text-[#fc4a32] text-[28px]" />
          </div>
          {/* Lock badge */}
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
            <TbLock className="text-white text-[13px]" />
          </div>
        </div>

        {/* ── Brand mark ────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#fff0ee] flex items-center justify-center">
            <BiBookOpen className="text-[#fc4a32] text-base" />
          </div>
          <span className="text-sm font-bold text-slate-400 tracking-wide">
            Book<span className="text-[#fc4a32]">Hub</span>
          </span>
        </div>

        {/* ── Copy ──────────────────────────────────────────────── */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Access restricted
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xs">
          You do not have permission to view this page.
          Sign in to your account or return to the homepage.
        </p>

        {/* ── What you need box ─────────────────────────────────── */}
        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 mb-8 text-left space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            This page requires
          </p>

          {[
            { label: 'An active BookHub account', met: false },
            { label: 'Correct role permissions (Reader / Librarian / Admin)', met: false },
            { label: 'A valid session — yours may have expired', met: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#fad4de] flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#fc4a32]" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>

        {/* ── Actions ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 w-full mb-4">
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#fc4a32] hover:bg-[#e03e28] active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all duration-150"
          >
            <TbLogin className="text-base" />
            Sign in
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-sm font-bold rounded-xl transition-all duration-150"
          >
            <TbHome className="text-base" />
            Go home
          </Link>
        </div>

        {/* ── Register nudge ────────────────────────────────────── */}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Do not have an account?{' '}
          <Link
            href="/register"
            className="text-[#fc4a32] font-semibold hover:underline underline-offset-2"
          >
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
}