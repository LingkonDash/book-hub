// components/shared/LoadingScreen.jsx
'use client';

import { useEffect, useState } from 'react';
import { BiBookOpen } from 'react-icons/bi';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Page is ready — wait 500ms before unmounting
    const timer = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white
                  transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >

      {/* ── Logo mark ─────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center mb-8">

        {/* Pulse ring 1 — slowest, largest spread */}
        <div className="absolute w-[72px] h-[72px] rounded-full bg-[#fc4a32]/10"
          style={{ animation: 'bd-pulse-ring 2s ease-out infinite' }} />

        {/* Pulse ring 2 — offset by 0.66s */}
        <div className="absolute w-[72px] h-[72px] rounded-full bg-[#fc4a32]/10"
          style={{ animation: 'bd-pulse-ring 2s ease-out 1s infinite' }} />

        {/* Pulse ring 3 — offset by 1.33s */}
        <div className="absolute w-[72px] h-[72px] rounded-full bg-[#fc4a32]/10"
          style={{ animation: 'bd-pulse-ring 2s ease-out 2s infinite' }} />

        {/* Spinning arc track */}
        <div className="absolute w-[72px] h-[72px] rounded-full border-[2.5px] border-[#fad4de]" />

        {/* Spinning arc */}
        <div
          className="absolute w-[72px] h-[72px] rounded-full border-[2.5px] border-transparent"
          style={{
            borderTopColor: '#fc4a32',
            borderRightColor: '#fc4a32',
            animation: 'bd-spin 1.1s cubic-bezier(0.4,0,0.2,1) infinite',
          }}
        />

        {/* Icon container — static, light brand bg */}
        <div className="relative w-[52px] h-[52px] rounded-full bg-[#fff0ee] flex items-center justify-center">
          <BiBookOpen className="text-[#fc4a32] text-[24px]" />
        </div>
      </div>

      {/* ── Wordmark ──────────────────────────────────────────── */}
      <p className="text-[22px] font-bold tracking-tight text-slate-900 mb-1 leading-none">
        Book<span className="text-[#fc4a32]">Hub</span>
      </p>

      {/* ── Tagline ───────────────────────────────────────────── */}
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400 mb-10">
        Delivering · Books
      </p>

      {/* ── Sliding progress bar ──────────────────────────────── */}
      <div className="w-[140px] h-[3px] bg-[#fad4de] rounded-full overflow-hidden">
        <div
          className="h-full w-[45%] bg-[#fc4a32] rounded-full"
          style={{ animation: 'bd-slide 1.4s ease-in-out infinite' }}
        />
      </div>

      {/* ── Keyframes ─────────────────────────────────────────── */}
      <style>{`
        @keyframes bd-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bd-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(2.4);  opacity: 0;   }
        }
        @keyframes bd-slide {
          0%   { transform: translateX(-120%); }
          50%  { transform: translateX(80%);   }
          100% { transform: translateX(260%);  }
        }
      `}</style>
    </div>
  );
}