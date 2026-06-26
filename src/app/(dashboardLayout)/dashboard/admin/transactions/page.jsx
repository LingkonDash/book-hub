import { getAllTransactions } from '@/lib/api/admin/getAdminApi';
import {
  TbReceipt2,
  TbUser,
  TbBook,
  TbCurrencyTaka,
  TbCalendarEvent,
  TbCircleCheckFilled,
  TbHash,
} from 'react-icons/tb';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function shortId(id = '') {
  return id.slice(-8).toUpperCase();
}

// ─── row badge ────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-green-200 whitespace-nowrap">
      <TbCircleCheckFilled className="text-green-500" />
      {status}
    </span>
  );
}

// ─── desktop row ──────────────────────────────────────────────────────────────

function TransactionRow({ tx, index }) {
  return (
    <tr className="group border-b border-gray-100 transition-colors hover:bg-[#fad4de]/20">
      {/* # */}
      <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-400">
        {String(index + 1).padStart(2, '0')}
      </td>

      {/* Transaction ID */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-2 min-w-[160px]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fc4a32]/10">
            <TbReceipt2 className="text-[#fc4a32]" size={15} />
          </span>
          <div>
            <p className="font-mono text-xs font-semibold text-gray-800">
              …{shortId(tx.transactionId)}
            </p>
            <p className="font-mono text-[10px] text-gray-400">{tx.sessionId?.slice(0, 18)}…</p>
          </div>
        </div>
      </td>

      {/* User */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-1.5 min-w-[150px]">
          <TbUser className="shrink-0 text-gray-400" size={14} />
          <span className="text-sm text-gray-700 truncate">{tx.userEmail}</span>
        </div>
      </td>

      {/* Librarian */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-1.5 min-w-[150px]">
          <TbBook className="shrink-0 text-gray-400" size={14} />
          <span className="text-sm text-gray-700 truncate">{tx.librarianEmail}</span>
        </div>
      </td>

      {/* Amount */}
      <td className="px-3 py-4">
        <span className="inline-flex items-center gap-0.5 rounded-md bg-[#fc4a32] px-2.5 py-1 text-sm font-bold text-white whitespace-nowrap">
          <TbCurrencyTaka size={15} />
          {Number(tx.amount).toFixed(2)}
        </span>
      </td>

      {/* Date */}
      <td className="py-4 pl-3 pr-6 text-sm text-gray-500">
        <div className="flex items-center gap-1.5 min-w-[140px] whitespace-nowrap">
          <TbCalendarEvent className="shrink-0 text-gray-400" size={14} />
          {formatDate(tx.paidAt)}
        </div>
      </td>
    </tr>
  );
}

// ─── mobile card ──────────────────────────────────────────────────────────────

function TransactionCard({ tx }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* card header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fc4a32]/10">
            <TbReceipt2 className="text-[#fc4a32]" size={18} />
          </span>
          <div>
            <p className="font-mono text-xs font-bold text-gray-800">
              …{shortId(tx.transactionId)}
            </p>
            <p className="font-mono text-[10px] text-gray-400">{tx.sessionId?.slice(0, 22)}…</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#fc4a32] px-2.5 py-1.5 text-sm font-bold text-white">
          <TbCurrencyTaka size={14} />
          {Number(tx.amount).toFixed(2)}
        </span>
      </div>

      {/* divider */}
      <div className="mb-4 h-px bg-gray-100" />

      {/* details */}
      <div className="space-y-2.5">
        <Row icon={<TbUser size={14} />} label="Reader" value={tx.userEmail} />
        <Row icon={<TbBook size={14} />} label="Librarian" value={tx.librarianEmail} />
        <Row
          icon={<TbHash size={14} />}
          label="Book ID"
          value={`…${tx.bookId?.slice(-8).toUpperCase()}`}
          mono
        />
        <Row
          icon={<TbCalendarEvent size={14} />}
          label="Paid at"
          value={formatDate(tx.paidAt)}
        />
      </div>

      {/* footer */}
      <div className="mt-4 flex justify-end">
        <StatusBadge status={tx.paymentStatus} />
      </div>
    </div>
  );
}

function Row({ icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-gray-400">{icon}</span>
      <span className="w-20 shrink-0 text-xs font-semibold text-gray-400">{label}</span>
      <span
        className={`flex-1 break-all text-xs text-gray-700 ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── summary bar ──────────────────────────────────────────────────────────────

function SummaryBar({ transactions }) {
  const total = transactions.reduce((s, t) => s + Number(t.amount), 0);
  const paid = transactions.filter((t) => t.paymentStatus === 'paid').length;

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <Stat label="Total Transactions" value={transactions.length} />
      <Stat label="Confirmed Paid" value={paid} />
      <Stat
        label="Revenue Collected"
        value={
          <span className="flex items-center gap-0.5">
            <TbCurrencyTaka />
            {total.toFixed(2)}
          </span>
        }
        accent
      />
    </div>
  );
}

function Stat({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        accent
          ? 'bg-[#fc4a32] text-white'
          : 'border border-gray-100 bg-white text-gray-800'
      }`}
    >
      <p className={`mb-1 text-xs font-semibold uppercase tracking-widest ${accent ? 'text-white/70' : 'text-gray-400'}`}>
        {label}
      </p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

const ManageTransactionsPage = async () => {
  const transactions = await getAllTransactions();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* page header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-[#fc4a32]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#fc4a32]">
            Admin Panel
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          All payment records across BookHub
        </p>
      </div>

      {/* summary */}
      <SummaryBar transactions={transactions} />

      {/* ── desktop table (md+) ─────────────────────────── */}
      <div className="hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                <th className="py-4 pl-6 pr-3 whitespace-nowrap">#</th>
                <th className="px-3 py-4 whitespace-nowrap">Transaction</th>
                <th className="px-3 py-4 whitespace-nowrap">Reader</th>
                <th className="px-3 py-4 whitespace-nowrap">Librarian</th>
                <th className="px-3 py-4 whitespace-nowrap">Amount</th>
                <th className="py-4 pl-3 pr-6 whitespace-nowrap">Paid At</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx, i) => (
                  <TransactionRow key={tx._id} tx={tx} index={i} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── mobile cards (< md) ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
        {transactions.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-gray-400">
            No transactions found.
          </p>
        ) : (
          transactions.map((tx) => <TransactionCard key={tx._id} tx={tx} />)
        )}
      </div>
    </div>
  );
};

export default ManageTransactionsPage;