'use client';

import { updateDeliveryStatus } from '@/lib/action/librarianAction/updateDeliveryStatus';
import React, { useState, useTransition } from 'react';
import { toast } from 'react-toastify';

const STATUS_FLOW = {
  pending: 'dispatched',
  dispatched: 'delivered',
  delivered: null,
};

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    badge: 'bg-orange-50 text-orange-500 border border-orange-200',
    dot: 'bg-orange-400',
    btn: 'bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 hover:border-sky-300',
    btnLabel: 'Mark Dispatched',
    spinner: 'border-sky-200 border-t-sky-500',
  },
  dispatched: {
    label: 'Dispatched',
    badge: 'bg-sky-50 text-sky-600 border border-sky-200',
    dot: 'bg-sky-400',
    btn: 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
    btnLabel: 'Mark Delivered',
    spinner: 'border-emerald-200 border-t-emerald-500',
  },
  delivered: {
    label: 'Delivered',
    badge: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    dot: 'bg-emerald-400',
    btn: null,
    btnLabel: null,
    spinner: null,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ActionButton({ cfg, nextStatus, isPending, handleAdvance }) {
  if (!nextStatus) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
        Delivered ✓
      </span>
    );
  }
  return (
    <button
      onClick={handleAdvance}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold
        transition-all duration-150 active:scale-[0.97]
        disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer whitespace-nowrap
        ${cfg.btn}`}
    >
      {isPending ? (
        <>
          <span className={`w-3 h-3 border-2 rounded-full inline-block animate-spin shrink-0 ${cfg.spinner}`} />
          Updating…
        </>
      ) : (
        cfg.btnLabel
      )}
    </button>
  );
}

// ── Mobile card ───────────────────────────────────────────────
function DeliveryCard({ delivery, currentStatus, cfg, nextStatus, isPending, handleAdvance, formattedDate }) {
  return (
    <div className="bg-white border border-[#fce8e5] rounded-2xl p-4 flex flex-col gap-3">

      {/* Top row: name + status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-700 leading-snug">
            {delivery.deliveryAddress?.name}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{delivery.userEmail}</div>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {/* Book */}
      <div>
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#fc4a32]">Book</span>
        <div className="text-sm text-slate-600 font-medium mt-0.5 line-clamp-1">
          {delivery.bookTitle}
        </div>
      </div>

      {/* Address + date + fee row */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#fc4a32]">Address</span>
          <div className="text-xs text-slate-500 mt-0.5">
            {delivery.deliveryAddress?.city}, {delivery.deliveryAddress?.street}
          </div>
          <div className="text-xs text-slate-400 font-mono">{delivery.deliveryAddress?.postal}</div>
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#fc4a32]">Date</span>
          <div className="text-xs text-slate-500 mt-0.5">{formattedDate}</div>
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#fc4a32]">Fee</span>
          <div className="text-sm font-semibold text-slate-700 mt-0.5">${delivery.deliveryFee?.toFixed(2)}</div>
        </div>
      </div>

      {/* Action */}
      <div className="pt-1 border-t border-[#fce8e5]">
        <ActionButton cfg={cfg} nextStatus={nextStatus} isPending={isPending} handleAdvance={handleAdvance} />
      </div>
    </div>
  );
}

// ── Shared row logic ──────────────────────────────────────────
function DeliveryRow({ delivery }) {
  const [currentStatus, setCurrentStatus] = useState(delivery.deliveryStatus);
  const [isPending, startTransition] = useTransition();

  const nextStatus = STATUS_FLOW[currentStatus];
  const cfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.pending;

  const handleAdvance = () => {
    if (!nextStatus) return;

    startTransition(async () => {
      try {
        // 1. Await the response from your backend API
        const response = await updateDeliveryStatus(delivery._id, nextStatus);

        // 2. Use the exact message from the backend if available, or fallback to your default
        const successMsg = response?.message || `Delivery status updated to ${nextStatus}`;
        if (response?.result?.modifiedCount > 0) {
          toast.success(successMsg)
        } else {
          toast.error('Something went wrong try again')
        }

        setCurrentStatus(nextStatus);
      } catch (err) {
        console.error('Failed to update delivery status:', err);

        // 3. Extract the backend error message (adjust based on your API client wrapper, e.g., err.response?.data?.message for Axios)
        const errorMsg = err.response?.data?.message || err.message || 'Failed to update delivery status';

        toast.error(errorMsg);
      }
    });
  };

  const formattedDate = new Date(delivery.requestedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const sharedProps = { delivery, currentStatus, cfg, nextStatus, isPending, handleAdvance, formattedDate };

  return (
    <>
      {/* Mobile card — visible below md */}
      <div className="md:hidden">
        <DeliveryCard {...sharedProps} />
      </div>

      {/* Desktop table row — visible from md up */}
      <tr className="hidden md:table-row border-b border-slate-100 hover:bg-[#fff5f4] transition-colors duration-150">

        <td className="px-5 py-4 align-middle whitespace-nowrap">
          <div className="text-sm font-semibold text-slate-700 leading-snug">
            {delivery.deliveryAddress?.name}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{delivery.userEmail}</div>
        </td>

        <td className="px-5 py-4 align-middle min-w-[160px] max-w-[220px]">
          <div className="text-sm text-slate-600 font-medium line-clamp-2" title={delivery.bookTitle}>
            {delivery.bookTitle}
          </div>
        </td>

        <td className="px-5 py-4 align-middle min-w-[180px]">
          <div className="text-xs text-slate-500 line-clamp-2">
            {delivery.deliveryAddress?.city}, {delivery.deliveryAddress?.street}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">{delivery.deliveryAddress?.postal}</div>
        </td>

        <td className="px-5 py-4 align-middle whitespace-nowrap">
          <span className="text-xs text-slate-500">{formattedDate}</span>
        </td>

        <td className="px-5 py-4 align-middle whitespace-nowrap">
          <span className="text-sm font-semibold text-slate-700">${delivery.deliveryFee?.toFixed(2)}</span>
        </td>

        <td className="px-5 py-4 align-middle whitespace-nowrap">
          <StatusBadge status={currentStatus} />
        </td>

        <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
          <ActionButton cfg={cfg} nextStatus={nextStatus} isPending={isPending} handleAdvance={handleAdvance} />
        </td>
      </tr>
    </>
  );
}

// ── Main component ────────────────────────────────────────────
const DeliveriesComponent = ({ deliveries = [] }) => {
  const headers = ['Client', 'Book Title', 'Address', 'Date', 'Fee', 'Status', 'Action'];

  if (deliveries.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-[#fce8e5] bg-white shadow-sm py-16 flex flex-col items-center gap-2 text-slate-400">
        <span className="text-2xl">📦</span>
        <span className="text-sm font-medium">No deliveries yet.</span>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {deliveries.map((delivery) => (
          <DeliveryRow key={delivery._id} delivery={delivery} />
        ))}
      </div>

      {/* Desktop/Tablet table wrapper — added overflow-x-auto here */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-[#fce8e5] bg-white shadow-sm">
        <table className="w-full border-collapse text-left min-w-[800px]">
          <thead>
            <tr className="bg-[#fff5f4] border-b border-[#fce8e5]">
              {headers.map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-[#fc4a32] select-none whitespace-nowrap ${h === 'Action' ? 'text-right' : 'text-left'
                    }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <DeliveryRow key={delivery._id} delivery={delivery} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DeliveriesComponent;