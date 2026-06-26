import AdminOverviewCharts from '@/components/dashboard/AdminOverviewCharts';
import { getAdminStats, getAllBooks, getAllTransactions, getAllUsers } from '@/lib/api/admin/getAdminApi';
import { getUserSession } from '@/lib/core/session';
import Image from 'next/image';
import Link from 'next/link';
import { CiReceipt } from 'react-icons/ci';
import { FaTruckMoving } from 'react-icons/fa6';
import { FiBook, FiBookOpen, FiClock, FiUsers } from 'react-icons/fi';

const AdminPage = async () => {
  const user = await getUserSession();

  const adminStats = await getAdminStats();
  const users = await getAllUsers();
  const books = await getAllBooks();
  const transactions = await getAllTransactions();

  // For chart — we need deliveries too; pass empty array if not available
  const deliveries = books.flatMap((b) => []).slice(0, 0); // placeholder if no delivery fetch

  const {
    totalUsers,
    totalBooks,
    pendingBooks,
    totalDeliveries,
    totalRevenue,
  } = adminStats;

  const pendingBooksList = books.filter((b) => b.status === 'pending').slice(0, 4);
  const recentUsers = users.slice(0, 4);

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: FiUsers,
      accent: '#185FA5',
      iconBg: '#E6F1FB',
      iconColor: '#185FA5',
      pill: 'Registered',
      pillStyle: 'bg-blue-50 text-blue-700',
      sub: 'across all roles',
    },
    {
      label: 'Total Books',
      value: totalBooks,
      icon: FiBookOpen,
      accent: '#fc4a32',
      iconBg: '#FEE9E7',
      iconColor: '#fc4a32',
      pill: `${books.filter((b) => b.status === 'published').length} live`,
      pillStyle: 'bg-emerald-50 text-emerald-700',
      sub: 'in the system',
    },
    {
      label: 'Pending Books',
      value: pendingBooks,
      icon: FiClock,
      accent: '#854F0B',
      iconBg: '#FAEEDA',
      iconColor: '#854F0B',
      pill: pendingBooks > 0 ? 'Action needed' : 'All clear',
      pillStyle: pendingBooks > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
      sub: 'awaiting your approval',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: CiReceipt,
      accent: '#3B6D11',
      iconBg: '#EAF3DE',
      iconColor: '#3B6D11',
      pill: `${totalDeliveries} deliveries`,
      pillStyle: 'bg-emerald-50 text-emerald-700',
      sub: 'all-time earnings',
    },
  ];

  const bookStatusBadge = {
    published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending: 'bg-orange-50 text-orange-700 border border-orange-200',
    unpublished: 'bg-gray-50 text-gray-600 border border-gray-200',
  };

  const roleBadge = {
    admin: 'bg-red-50 text-red-700 border border-red-200',
    librarian: 'bg-blue-50 text-blue-700 border border-blue-200',
    reader: 'bg-gray-50 text-gray-600 border border-gray-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fad4de]/30 via-white to-white p-4 sm:p-6 pt-5 md:pt-18 lg:pt-4 transition-colors duration-300">
      <div className="mx-auto space-y-8">

        {/* Hero banner */}
        <div className="relative overflow-hidden bg-primary rounded-2xl p-6 sm:p-8 flex items-center justify-between shadow-lg shadow-primary/10">
          <div className="absolute -right-5 -top-8 w-40 h-40 rounded-full bg-[#e03e27] opacity-40 pointer-events-none" />
          <div className="absolute right-14 top-10 w-20 h-20 rounded-full bg-[#e03e27] opacity-30 pointer-events-none" />
          <div className="relative z-10 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold">admin dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
            </h1>
            <p className="text-sm text-white/85">
              {pendingBooks > 0
                ? `You have ${pendingBooks} book${pendingBooks > 1 ? 's' : ''} pending approval.`
                : `Everything is up to date. The system is running smoothly!`}
            </p>
          </div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 border-2 overflow-hidden border-white/40 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.image
              ? <Image src={user.image} alt="avatar" width={50} height={50} className="rounded-full object-cover h-full" />
              : user?.name?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
        </div>

        {/* Quick stats */}
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
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Platform activity</p>
          <AdminOverviewCharts
            transactions={transactions}
            books={books}
          />
        </div>

        {/* Pending Books + Recent Users side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Pending books */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Pending approval</p>
              <Link
                href="/dashboard/admin/manage-books"
                className="text-xs font-bold text-[#fc4a32] bg-[#fc4a32]/5 hover:bg-[#fc4a32]/10 px-3 py-1.5 rounded-xl transition-colors"
              >
                See all →
              </Link>
            </div>
            <div className="flex flex-col">
              {pendingBooksList.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No pending books right now.</p>
              ) : (
                pendingBooksList.map((b) => (
                  <div key={b._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FAEEDA] flex items-center justify-center shrink-0">
                      <FiBook className="text-[#854F0B] text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{b.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">by {b.author} · ${b.deliveryFee?.toFixed(2)} fee</p>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${bookStatusBadge[b.status] ?? 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                      {b.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent users */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Recent users</p>
              <Link
                href="/dashboard/admin/manage-users"
                className="text-xs font-bold text-[#fc4a32] bg-[#fc4a32]/5 hover:bg-[#fc4a32]/10 px-3 py-1.5 rounded-xl transition-colors"
              >
                Manage →
              </Link>
            </div>
            <div className="flex flex-col">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No users found.</p>
              ) : (
                recentUsers.map((u) => (
                  <div key={u._id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center shrink-0 text-xs font-bold text-[#185FA5]">
                      {u.image
                        ? <Image src={u.image} alt={u.name} width={32} height={32} className="rounded-full" />
                        : u.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{u.email}</p>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${roleBadge[u.userRole] ?? 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                      {u.userRole}
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

export default AdminPage;