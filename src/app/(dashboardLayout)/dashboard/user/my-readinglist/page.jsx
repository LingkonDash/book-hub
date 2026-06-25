import { getUserDeliveries } from '@/lib/api/getUserDeliveries';
import { getUserSession } from '@/lib/core/session';
import React from 'react';
import { TbPackages, TbClock, TbTruck, TbCircleCheck, TbTruckOff, TbBook, TbBookmark, TbCalendarCheck } from 'react-icons/tb';

// --- Status Badge ---
const StatusBadge = ({ status }) => {
  const styles = {
    pending:    'bg-amber-50/80 text-amber-700 border-amber-200/60',
    dispatched: 'bg-sky-50/80 text-sky-700 border-sky-200/60',
    delivered:  'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
  };
  const dots = {
    pending:    'bg-amber-500 animate-pulse',
    dispatched: 'bg-sky-500',
    delivered:  'bg-emerald-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold tracking-wide border backdrop-blur-sm capitalize ${styles[status] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? 'bg-slate-400'}`} />
      {status}
    </span>
  );
};

// --- Format date ---
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-BD', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

// --- Reading List Gallery Card (Desktop & Tablet) ---
const ReadingBookCard = ({ delivery, index }) => (
  <div className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex flex-col h-full">
    {/* Book Top Aesthetic Container */}
    <div className="relative aspect-[4/3] bg-gradient-to-br from-[#fad4de]/40 via-[#fad4de]/10 to-transparent flex items-center justify-center border-b border-slate-50 overflow-hidden shrink-0">
      <div className="absolute top-4 right-4 z-10">
        <StatusBadge status={delivery.deliveryStatus} />
      </div>
      <div className="absolute top-4 left-4 text-xs font-bold font-mono text-[#fc4a32] bg-[#fc4a32]/10 px-2.5 py-1 rounded-xl">
        #{String(index + 1).padStart(2, '0')}
      </div>
      
      {/* Decorative Book UI Icon Badge instead of heavy assets */}
      <div className="w-16 h-20 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-lg">
        <TbBook className="text-3xl text-[#fc4a32]" />
      </div>

      {/* Ribbon Banner */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-md py-1.5 px-3 rounded-xl border border-white/60 flex items-center gap-2 text-[11px] font-semibold text-slate-600">
        <TbCalendarCheck className="text-emerald-600 text-sm" />
        <span>Arrived {formatDate(delivery.requestedAt)}</span>
      </div>
    </div>

    {/* Content Area */}
    <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
      <div className="space-y-1.5">
        <h3 className="font-bold text-slate-800 text-base leading-snug tracking-tight line-clamp-2 group-hover:text-[#fc4a32] transition-colors duration-200">
          {delivery.bookTitle}
        </h3>
        <p className="text-xs text-slate-400 font-medium truncate">
          By Librarian: <span className="text-slate-500 font-mono">{delivery.librarianEmail}</span>
        </p>
      </div>

      <div className="pt-3 border-t border-slate-50 space-y-2 text-xs text-slate-500">
        <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
          <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Delivered To</p>
          <p className="font-bold text-slate-800 truncate mb-0.5">{delivery.deliveryAddress.name}</p>
          <p className="text-slate-600 truncate font-medium">{delivery.deliveryAddress.city}, {delivery.deliveryAddress.postal}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Fee</span>
          <span className="text-sm font-black text-slate-900 font-mono">${delivery.deliveryFee.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- General Pipeline Mobile Card (For overall activity stream tracking on mobile views) ---
const DeliveryCard = ({ delivery, index }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)]">
    <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-[#fad4de]/20 to-transparent border-b border-slate-100">
      <span className="text-xs font-bold text-[#fc4a32] tracking-wider font-mono bg-[#fc4a32]/10 px-2 py-0.5 rounded-lg">
        {String(index + 1).padStart(2, '0')}
      </span>
      <StatusBadge status={delivery.deliveryStatus} />
    </div>

    <div className="p-4 space-y-4">
      <p className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 tracking-tight">
        {delivery.bookTitle}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2 border-t border-slate-50 text-xs text-slate-500">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Fee</p>
          <p className="font-extrabold text-sm text-slate-900 font-mono">${delivery.deliveryFee.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Requested</p>
          <p className="font-semibold text-slate-700">{formatDate(delivery.requestedAt)}</p>
        </div>
        <div className="col-span-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Destination Address</p>
          <p className="font-medium text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-800 block mb-0.5">{delivery.deliveryAddress.name}</span>
            {delivery.deliveryAddress.city}, {delivery.deliveryAddress.postal}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- Empty State ---
const EmptyState = ({ message, desc }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fad4de]/60 to-[#fad4de]/10 flex items-center justify-center mb-5 shadow-sm border border-white">
      <TbTruckOff className="text-3xl text-[#fc4a32]" />
    </div>
    <p className="text-lg font-bold text-slate-800 tracking-tight">{message}</p>
    <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);

// --- Stat Card ---
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className={`rounded-2xl p-5 flex items-center gap-4 border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 ${accent}`}>
    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100/50">
      <Icon className="text-2xl text-[#fc4a32]" />
    </div>
    <div className="space-y-0.5">
      <p className="text-2xl font-black text-slate-900 font-mono tracking-tight leading-none">{value}</p>
      <p className="text-xs font-semibold text-slate-500 tracking-tight">{label}</p>
    </div>
  </div>
);

// --- Page Component ---
const MyReadingListPage = async () => {
  const user = await getUserSession();
  const { deliveries, totalDelivery } = await getUserDeliveries(user?.id);
  
  // Isolate successfully delivered items for the curated grid gallery
  const readingList = deliveries ? deliveries.filter(d => d.deliveryStatus === 'delivered') : [];
  const readingCount = readingList.length;

  const dispatched = deliveries ? deliveries.filter(d => d.deliveryStatus === 'dispatched').length : 0;
  const delivered  = deliveries ? deliveries.filter(d => d.deliveryStatus === 'delivered').length : 0;
  const pending    = deliveries ? deliveries.filter(d => d.deliveryStatus === 'pending').length : 0;

  return (
    <div className="min-h-screen bg-[#fcfbfc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fc4a32] font-mono">
              Dashboard Overview
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Reading List
            </h1>
          </div>
          <div className="inline-flex items-center bg-[#fad4de]/30 px-3.5 py-1.5 rounded-xl border border-[#fad4de]/50 gap-2">
            <TbBookmark className="text-[#fc4a32] text-sm" />
            <p className="text-xs font-bold text-slate-700 tracking-tight">
              {readingCount} Book{readingCount !== 1 ? 's' : ''} Finished
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={TbPackages}    label="Total Orders" value={totalDelivery} accent="border-slate-100 bg-white" />
          <StatCard icon={TbClock}       label="Pending"      value={pending}       accent="border-amber-100 bg-amber-50/40" />
          <StatCard icon={TbTruck}       label="Dispatched"   value={dispatched}    accent="border-sky-100 bg-sky-50/40" />
          <StatCard icon={TbCircleCheck} label="Delivered"    value={delivered}     accent="border-emerald-100 bg-emerald-50/40" />
        </div>

        {/* Content Section */}
        {!deliveries?.length ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
            <EmptyState 
              message="No deliveries listed yet" 
              desc="When you borrow and request your next physical copy, your doorstep tracking timeline will appear right here." 
            />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* View Title */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <span>Completed Collection ({readingCount})</span>
              </h2>
            </div>

            {/* Mobile View: Shows fallback dynamic stream list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {deliveries.map((delivery, i) => (
                <DeliveryCard key={delivery._id} delivery={delivery} index={i} />
              ))}
            </div>

            {/* Premium Desktop & Tablet View: 100% Pure CSS responsive gallery instead of a flat structural table */}
            <div className="hidden md:block">
              {!readingList.length ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-6">
                  <EmptyState 
                    message="Your reading list is empty" 
                    desc="Books will populate in this grid gallery view as soon as their tracking status is updated to successfully Delivered." 
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {readingList.map((delivery, i) => (
                    <ReadingBookCard key={delivery._id} delivery={delivery} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Grid Pagination Summary Footer */}
            <div className="hidden md:flex px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/40 items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 tracking-tight">
                Showing <span className="text-slate-700 font-bold font-mono">{readingCount}</span> delivered book{readingCount !== 1 ? 's' : ''} out of <span className="text-slate-700 font-bold font-mono">{totalDelivery}</span> pipelines
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MyReadingListPage;