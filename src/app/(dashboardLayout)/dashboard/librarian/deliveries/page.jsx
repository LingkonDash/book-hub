import React from 'react';
import DeliveriesComponent from './DeliveriesComponent';
import { getLibrarianDeliveries } from '@/lib/api/librarian/getLibrarianDeliveries';

const DeliveriesPage = async () => {
  const res = await getLibrarianDeliveries();
  const deliveries = res?.deliveries ?? [];

  return (
    <div className="px-6 py-8 mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3 mb-7">
        <div>
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#fc4a32] mb-1">
            Librarian Dashboard
          </p>
          <h1 className="text-[26px] font-bold text-slate-900 tracking-tight leading-none">
            Manage Deliveries
          </h1>
        </div>

        {/* Count pill */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fce8e5] text-[#fc4a32] text-sm font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fc4a32]" />
          {deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'}
        </span>
      </div>

      {/* Table */}
      <DeliveriesComponent deliveries={deliveries} />
    </div>
  );
};

export default DeliveriesPage;