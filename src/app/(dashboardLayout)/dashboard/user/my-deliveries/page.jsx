import { getUserDeliveries } from '@/lib/api/getUserDeliveries';
import { getUserSession } from '@/lib/core/session';
import React from 'react';
import { TbPackages, TbClock, TbTruck, TbCircleCheck, TbTruckOff } from 'react-icons/tb';

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

// --- Mobile Card ---
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

// --- Table Row ---
const DeliveryRow = ({ delivery, index }) => (
  <tr className="group hover:bg-[#fad4de]/10 transition-all duration-300 border-b border-slate-100 last:border-b-0">
    <td className="px-5 py-4 text-xs font-bold text-[#fc4a32] font-mono">
      <span className="bg-[#fc4a32]/5 px-2 py-1 rounded-lg group-hover:bg-[#fc4a32]/10 transition-colors duration-300">
        {String(index + 1).padStart(2, '0')}
      </span>
    </td>
    <td className="px-5 py-4">
      <p className="text-sm font-bold text-slate-800 max-w-[240px] truncate tracking-tight transition-transform duration-300 group-hover:translate-x-0.5">{delivery.bookTitle}</p>
      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px] font-medium font-mono">{delivery.librarianEmail}</p>
    </td>
    <td className="px-5 py-4">
      <p className="text-sm text-slate-700 font-semibold">{delivery.deliveryAddress.name}</p>
      <p className="text-xs text-slate-400 mt-0.5 tracking-tight font-medium">
        {delivery.deliveryAddress.city}, {delivery.deliveryAddress.postal}
      </p>
    </td>
    <td className="px-5 py-4 text-sm font-extrabold text-slate-900 font-mono">
      ${delivery.deliveryFee.toFixed(2)}
    </td>
    <td className="px-5 py-4">
      <StatusBadge status={delivery.deliveryStatus} />
    </td>
    <td className="px-5 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap font-mono">
      {formatDate(delivery.requestedAt)}
    </td>
  </tr>
);

// --- Empty State ---
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-4">
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fad4de]/60 to-[#fad4de]/10 flex items-center justify-center mb-5 shadow-sm border border-white">
      <TbTruckOff className="text-3xl text-[#fc4a32]" />
    </div>
    <p className="text-lg font-bold text-slate-800 tracking-tight">No deliveries listed yet</p>
    <p className="text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed font-medium">
      When you borrow and request your next physical copy, your doorstep tracking timeline will appear right here.
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

// --- Page ---
const MyDeliveriesPage = async () => {
  const user = await getUserSession();
  const { deliveries, totalDelivery } = await getUserDeliveries(user?.id);

  const dispatched = deliveries.filter(d => d.deliveryStatus === 'dispatched').length;
  const delivered  = deliveries.filter(d => d.deliveryStatus === 'delivered').length;
  const pending    = deliveries.filter(d => d.deliveryStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-[#fcfbfc]">
      <div className=" mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fc4a32] font-mono">
              Dashboard Overview
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Delivery History
            </h1>
          </div>
          <div className="inline-flex items-center bg-[#fad4de]/30 px-3.5 py-1.5 rounded-xl border border-[#fad4de]/50">
            <p className="text-xs font-bold text-slate-700 tracking-tight">
              {totalDelivery} Total Order{totalDelivery !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={TbPackages}    label="Total Orders" value={totalDelivery} accent="border-slate-100 bg-white" />
          <StatCard icon={TbClock}       label="Pending"      value={pending}       accent="border-amber-100 bg-amber-50/40" />
          <StatCard icon={TbTruck}       label="Dispatched"   value={dispatched}    accent="border-sky-100 bg-sky-50/40" />
          <StatCard icon={TbCircleCheck} label="Delivered"    value={delivered}     accent="border-emerald-100 bg-emerald-50/40" />
        </div>

        {/* Content */}
        {!deliveries?.length ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
            <EmptyState />
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {deliveries.map((delivery, i) => (
                <DeliveryCard key={delivery._id} delivery={delivery} index={i} />
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      {['Serial', 'Book Details', 'Delivery Address', 'Delivery Fee', 'Status', 'Date Requested'].map((h, i) => (
                        <th key={i} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 select-none">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {deliveries.map((delivery, i) => (
                      <DeliveryRow key={delivery._id} delivery={delivery} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 tracking-tight">
                  Showing <span className="text-slate-700 font-bold font-mono">{deliveries.length}</span> of <span className="text-slate-700 font-bold font-mono">{totalDelivery}</span> recorded pipelines
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyDeliveriesPage;