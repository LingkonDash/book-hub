import LibrarianEarningsCharts from '@/components/dashboard/LibrarianEarningsCharts';
import { getLibrarianBooks } from '@/lib/api/librarian/getLibrarianBooks';
import { getLibrarianDeliveries } from '@/lib/api/librarian/getLibrarianDeliveries';
import { getLibrarianTransactions } from '@/lib/api/librarian/getLibrarianTransactions';
import { getUserSession } from '@/lib/core/session';
import Image from 'next/image';
import { CiReceipt } from 'react-icons/ci';
import { FaTruckMoving } from 'react-icons/fa6';
import { FiBook, FiBookOpen, FiClock } from 'react-icons/fi';

const LibrarianPage = async () => {
  const user = await getUserSession();

  // You'll need these 3 API helpers — same pattern as user side
  const { books } = await getLibrarianBooks(user?.id);
  const { deliveries } = await getLibrarianDeliveries(user?.id);
  const { transactions, totalEarnings } = await getLibrarianTransactions(user?.id);

  // Derived stats
  const totalBooks = books.length;
  const pendingApproval = books.filter((b) => b.status === 'pending').length;
  const openDeliveries = deliveries.filter(
    (d) => d.deliveryStatus === 'pending' || d.deliveryStatus === 'dispatched'
  ).length;

  const recentDeliveries = deliveries.slice(0, 4);
  const recentBooks = books.slice(0, 4);

  const stats = [
    {
      label: 'Total books',
      value: totalBooks,
      icon: FiBookOpen,
      accent: '#fc4a32',
      iconBg: '#FEE9E7',
      iconColor: '#fc4a32',
      pill: `${books.filter((b) => b.status === 'published').length} live`,
      pillStyle: 'bg-emerald-50 text-emerald-700',
      sub: 'in your library',
    },
    {
      label: 'Pending approval',
      value: pendingApproval,
      icon: FiClock,
      accent: '#854F0B',
      iconBg: '#FAEEDA',
      iconColor: '#854F0B',
      pill: pendingApproval > 0 ? 'Action needed' : 'All clear',
      pillStyle: pendingApproval > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
      sub: 'awaiting admin review',
    },
    {
      label: 'Open deliveries',
      value: openDeliveries,
      icon: FaTruckMoving,
      accent: '#185FA5',
      iconBg: '#E6F1FB',
      iconColor: '#185FA5',
      pill: `${openDeliveries} active`,
      pillStyle: 'bg-amber-50 text-amber-700',
      sub: 'pending or dispatched',
    },
    {
      label: 'Total earned',
      value: `$${totalEarnings.toFixed(2)}`,
      icon: CiReceipt,
      accent: '#3B6D11',
      iconBg: '#EAF3DE',
      iconColor: '#3B6D11',
      pill: 'All paid',
      pillStyle: 'bg-emerald-50 text-emerald-700',
      sub: 'delivery fees received',
    },
  ];

  const statusBadge = {
    delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dispatched: 'bg-blue-50 text-blue-700 border border-blue-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  const bookStatusBadge = {
    published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending: 'bg-orange-50 text-orange-700 border border-orange-200',
    unpublished: 'bg-gray-50 text-gray-600 border border-gray-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fad4de]/30 via-white to-white p-4 sm:p-6 md:p-8 pt-16 md:pt-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Hero banner */}
        <div className="relative overflow-hidden bg-primary rounded-2xl p-6 sm:p-8 flex items-center justify-between shadow-lg shadow-primary/10">
          <div className="absolute -right-5 -top-8 w-40 h-40 rounded-full bg-[#e03e27] opacity-40 pointer-events-none" />
          <div className="absolute right-14 top-10 w-20 h-20 rounded-full bg-[#e03e27] opacity-30 pointer-events-none" />
          <div className="relative z-10 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold">librarian dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Librarian'}
            </h1>
            <p className="text-sm text-white/85">
              {pendingApproval > 0
                ? `You have ${pendingApproval} book${pendingApproval > 1 ? 's' : ''} awaiting admin approval.`
                : `All your books are approved. Keep adding more!`}
            </p>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 border-2 overflow-hidden border-white/40 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.image
              ? <Image src={user.image} alt="avatar" width={50} height={50} className="rounded-full" />
              : user?.name?.slice(0, 2).toUpperCase() || 'LB'}
          </div>
        </div>

        {/* Section header */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Librarian'}
          </h1>
          <p className="text-sm text-gray-500">Here is your library and delivery activity at a glance.</p>
        </div>

        {/* Quick stats — 4 cols for librarian */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl px-4 py-4 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-[4px] h-full rounded-l" style={{ background: s.accent }} />
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.iconBg }}>
                    <Icon className="text-base" style={{ color: s.iconColor }} />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.pillStyle}`}>
                    {s.pill}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">{s.value}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Earnings activity</p>
          <LibrarianEarningsCharts
            transactions={transactions}
            deliveries={deliveries}
            books={books}
          />
        </div>

        {/* Books + Deliveries side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* My books */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">My books</p>
              <a href="/librarian/my-books" className="text-xs font-bold text-[#fc4a32] bg-[#fc4a32]/5 hover:bg-[#fc4a32]/10 px-3 py-1.5 rounded-xl transition-colors">
                Manage →
              </a>
            </div>
            <div className="flex flex-col">
              {recentBooks.map((b) => (
                <div key={b._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FEE9E7] flex items-center justify-center shrink-0">
                    <FiBook className="text-[#fc4a32] text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{b.bookTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">${b.deliveryFee?.toFixed(2)} fee</p>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${bookStatusBadge[b.status] ?? 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Open deliveries */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Open deliveries</p>
              <a href="/librarian/deliveries" className="text-xs font-bold text-[#fc4a32] bg-[#fc4a32]/5 hover:bg-[#fc4a32]/10 px-3 py-1.5 rounded-xl transition-colors">
                View all →
              </a>
            </div>
            <div className="flex flex-col">
              {recentDeliveries.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No deliveries yet.</p>
              ) : (
                recentDeliveries.map((d) => (
                  <div key={d._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F1FB] flex items-center justify-center shrink-0">
                      <FaTruckMoving className="text-[#185FA5] text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{d.deliveryAddress?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{d.bookTitle} · {d.deliveryAddress?.city}</p>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusBadge[d.deliveryStatus] ?? 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                      {d.deliveryStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LibrarianPage;