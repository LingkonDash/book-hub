import { getUserDeliveries } from '@/lib/api/getUserDeliveries';
import { getUserTransactions } from '@/lib/api/getUserTransactions';
import { getUserSession } from '@/lib/core/session';
import Image from 'next/image';
// import SpendingCharts from './_components/SpendingCharts'; // your client component slot
import React from 'react';
import { CiReceipt } from 'react-icons/ci';
import { FaTruckMoving } from 'react-icons/fa6';
import { FiBook, FiBookOpen } from 'react-icons/fi';

const UserPage = async () => {
  const user = await getUserSession();
  const { deliveries, totalDelivery } = await getUserDeliveries(user?.id);
  const { transactions, totalSpending } = await getUserTransactions(user?.id);

  // Derived stats
  const booksRead = deliveries.filter((d) => d.status === 'Delivered').length;
  const pendingDeliveries = deliveries.filter(
    (d) => d.status === 'Pending' || d.status === 'Dispatched'
  ).length;
  const recentDeliveries = deliveries.slice(0, 5);

  const stats = [
    {
      label: 'Total books read',
      value: booksRead,
      icon: FiBookOpen,
      accent: '#fc4a32',
      sub: 'from delivered orders',
    },
    {
      label: 'Pending deliveries',
      value: pendingDeliveries,
      icon: FaTruckMoving,
      accent: '#185FA5',
      sub: 'awaiting dispatch',
    },
    {
      label: 'Total spent on fees',
      value: `$${totalSpending.toFixed(2)}`,
      icon: CiReceipt,
      accent: '#3B6D11',
      sub: 'delivery fees paid',
    },
  ];

  // High contrast custom bordered pills style mapping
  const statusBadge = {
    Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold shadow-sm',
    Dispatched: 'bg-blue-50 text-blue-700 border border-blue-300 font-semibold shadow-sm',
    Pending: 'bg-amber-50 text-amber-700 border border-amber-300 font-semibold shadow-sm',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fad4de]/30 via-white to-white p-4 sm:p-6 md:p-8 pt-16 md:pt-6 mx-auto transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero banner */}
        <div className="relative overflow-hidden bg-primary rounded-2xl p-6 sm:p-8 flex items-center justify-between shadow-lg shadow-primary/10">
          <div className="absolute -right-5 -top-8 w-40 h-40 rounded-full bg-[#e03e27] opacity-40 pointer-events-none" />
          <div className="absolute right-14 top-10 w-20 h-20 rounded-full bg-[#e03e27] opacity-30 pointer-events-none" />

          <div className="relative z-10 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold">reader dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Reader'}
            </h1>
            <p className="text-sm text-white/85 max-w-sm">
              You have read {booksRead} books. Keep it up!
            </p>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 border-2 overflow-hidden border-white/40 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner">
            {
              user?.image ?
              <Image src={user?.image} alt='image' width={50} height={50} className='rounded-full'/> 
              :
              user?.name?.slice(0, 2).toUpperCase() || 'RE'
            }
          </div>
        </div>

        {/* Greeting / Context header */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Reader'} 👋
          </h1>
          <p className="text-sm text-gray-500">Heres a snapshot of your reading activity.</p>
        </div>

        {/* Quick stats container */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-2xl px-5 py-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className="absolute top-0 left-0 w-[4px] h-full"
                  style={{ background: s.accent }}
                />
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
                  <IconComponent className="text-xl text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Chart slot — client component background wrapper */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">spending activity</p>
          <div className="bg-gray-50/60 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400 font-medium">
            {/* <SpendingCharts transactions={transactions} deliveries={deliveries} /> */}
            Spending Analytics Panel
          </div>
        </div>

        {/* Recent deliveries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">recent deliveries</p>
            <a
              href="/user/deliveries"
              className="text-xs font-bold text-[#fc4a32] hover:text-[#fc4a32]/80 transition-colors bg-[#fc4a32]/5 hover:bg-[#fc4a32]/10 px-3 py-1.5 rounded-xl"
            >
              View all →
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {recentDeliveries.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-12 text-center shadow-sm">
                <p className="text-sm text-gray-400 font-medium">No deliveries yet.</p>
              </div>
            ) : (
              recentDeliveries.map((d) => (
                <div
                  key={d._id}
                  className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-sm hover:border-gray-200/80 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-400 shadow-inner">
                      <FiBook className="text-lg" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{d.bookTitle}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">${d.deliveryFee.toFixed(2)} fee</p>
                    </div>
                  </div>

                  {/* Custom Bordered High-Contrast Pill */}
                  <span
                    className={`text-[11px] tracking-wide uppercase px-3 py-1 rounded-full whitespace-nowrap shrink-0 ${statusBadge[d.deliveryStatus] ?? 'bg-gray-100 text-gray-900 border border-gray-300'
                      }`}
                  >
                    {d.deliveryStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserPage;