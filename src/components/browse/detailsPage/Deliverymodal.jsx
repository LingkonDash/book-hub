'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';

// ── small UI atoms ─────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
    </svg>
  );
}

function Input({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800
          placeholder:text-slate-300 bg-white outline-none transition-all
          focus:ring-2 focus:ring-[#fc4a32]/30 focus:border-[#fc4a32]
          ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ── Modal overlay ──────────────────────────────────────────
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dim */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-[slide-up_0.22s_ease]">
        {children}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Steps ──────────────────────────────────────────────────
// Step 1: confirm book + address
// Step 2: Stripe payment (redirect or embedded — here we redirect to checkout)
// Step 3: success

function StepConfirm({ book, address, setAddress, errors, onNext, onClose }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Request delivery</p>
          <h2 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">Confirm your order</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Book preview */}
      <div className="flex items-center gap-3 mx-5 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="relative w-12 aspect-[3/4] rounded-lg overflow-hidden shrink-0 shadow-sm">
          {book.coverImage ? (
            <Image src={book.coverImage} alt={book.title} fill className="object-cover" sizes="48px"/>
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{book.title}</p>
          <p className="text-xs text-slate-500 truncate">by {book.author}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-slate-400">Delivery fee</p>
          <p className="text-base font-bold text-[#fc4a32]">${Number(book.deliveryFee).toFixed(2)}</p>
        </div>
      </div>

      {/* Address form */}
      <div className="px-5 mt-5 space-y-3">
        <Input
          label="Full name"
          id="name"
          placeholder="Lingkon Das"
          value={address.name}
          onChange={(e) => setAddress((p) => ({ ...p, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          label="Phone"
          id="phone"
          type="tel"
          placeholder="+880 17xx xxx xxx"
          value={address.phone}
          onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))}
          error={errors.phone}
        />
        <Input
          label="Delivery address"
          id="street"
          placeholder="House, road, area"
          value={address.street}
          onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
          error={errors.street}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            id="city"
            placeholder="Dhaka"
            value={address.city}
            onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
            error={errors.city}
          />
          <Input
            label="Postal code"
            id="postal"
            placeholder="1215"
            value={address.postal}
            onChange={(e) => setAddress((p) => ({ ...p, postal: e.target.value }))}
            error={errors.postal}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 mt-5">
        <button
          onClick={onNext}
          className="w-full h-12 rounded-2xl bg-[#fc4a32] hover:bg-[#e03e28] active:scale-[0.98] text-white font-bold text-sm transition-all cursor-pointer shadow-[0_4px_16px_rgba(252,74,50,0.35)]"
        >
          Continue to payment
        </button>
        <p className="text-xs text-center text-slate-400 mt-3">
          You will be redirected to our secure payment page.
        </p>
      </div>
    </>
  );
}

function StepPaying({ onClose }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      <div className="w-14 h-14 rounded-full bg-[#fff0ee] flex items-center justify-center">
        <Spinner />
      </div>
      <div>
        <p className="font-bold text-slate-800">Redirecting to payment…</p>
        <p className="text-sm text-slate-400 mt-1">Please do not close this window.</p>
      </div>
      <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 mt-2">
        Cancel
      </button>
    </div>
  );
}

function StepSuccess({ book, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
        <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900">Delivery requested!</p>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          Your request for <span className="font-semibold text-slate-700">{book.title}</span> has been placed.
          A librarian will dispatch it soon.
        </p>
      </div>
      <button
        onClick={onClose}
        className="mt-2 px-6 h-11 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold transition-colors cursor-pointer"
      >
        Got it
      </button>
    </div>
  );
}

// ── Validate address ───────────────────────────────────────
function validate(address) {
  const errors = {};
  if (!address.name.trim())   errors.name   = 'Required';
  if (!address.phone.trim())  errors.phone  = 'Required';
  if (!address.street.trim()) errors.street = 'Required';
  if (!address.city.trim())   errors.city   = 'Required';
  if (!address.postal.trim()) errors.postal = 'Required';
  return errors;
}

// ── Main export ────────────────────────────────────────────
export default function DeliveryModal({ book, currentUser }) {
  const router = useRouter();

  const [open, setOpen]   = useState(false);
  const [step, setStep]   = useState('confirm'); // confirm | paying | success
  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState({
    name:   currentUser?.name  ?? '',
    phone:  currentUser?.phone ?? '',
    street: '',
    city:   '',
    postal: '',
  });

  function handleOpen() {
    if (!currentUser) {
      toast.info('Please sign in to request a delivery.');
      router.push('/login');
      return;
    }
    if (!book.available) {
      toast.error('This book is currently unavailable.');
      return;
    }
    setStep('confirm');
    setErrors({});
    setOpen(true);
  }

  async function handleNext() {
    const errs = validate(address);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep('paying');

    try {
      // 1. Create a delivery record on your backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bookId:  book._id,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? 'Failed to create delivery');

      // 2. If you get a Stripe checkout URL back, redirect
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return; // page will navigate away
      }

      // 3. If no Stripe (free book or COD), go straight to success
      setStep('success');

    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
      setStep('confirm');
    }
  }

  function handleClose() {
    setOpen(false);
    // Small delay so animation plays
    setTimeout(() => setStep('confirm'), 300);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        disabled={!book.available}
        className={`flex items-center gap-2 px-7 h-12 rounded-2xl font-bold text-sm transition-all cursor-pointer
          ${book.available
            ? 'bg-[#fc4a32] hover:bg-[#e03e28] active:scale-[0.98] text-white shadow-[0_4px_20px_rgba(252,74,50,0.35)]'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
      >
        {/* Truck icon */}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m0 0h3l3 4v4h-6m-3 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
        </svg>
        {book.available ? 'Request delivery' : 'Unavailable'}
      </button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        {step === 'confirm' && (
          <StepConfirm
            book={book}
            address={address}
            setAddress={setAddress}
            errors={errors}
            onNext={handleNext}
            onClose={handleClose}
          />
        )}
        {step === 'paying'  && <StepPaying  onClose={handleClose} />}
        {step === 'success' && <StepSuccess book={book} onClose={handleClose} />}
      </Modal>
    </>
  );
}