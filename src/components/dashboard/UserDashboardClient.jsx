"use client";

import { MdLocalShipping, MdCheckCircle, MdPending, MdStar } from "react-icons/md";
import StatusBadge from "./StatusBadge";

export default function UserDashboardClient({ session, deliveries, stats }) {
  const name = session?.user?.name || "Reader";
  const firstName = name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="text-[#fc4a32]">{firstName}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here is whats happening with your orders.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: MdLocalShipping,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Delivered",
            value: stats.delivered,
            icon: MdCheckCircle,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            label: "In Progress",
            value: stats.pending,
            icon: MdPending,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
          {
            label: "Reviews Given",
            value: stats.reviews,
            icon: MdStar,
            color: "text-yellow-500",
            bg: "bg-yellow-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={`${stat.color} size-6`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Deliveries</h2>
          <span className="text-xs text-gray-400">{deliveries.length} total</span>
        </div>

        {deliveries.length === 0 ? (
          <div className="py-16 text-center">
            <MdLocalShipping className="size-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No deliveries yet</p>
            <p className="text-gray-300 text-sm mt-1">Request a book delivery to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deliveries.map((d) => (
                  <tr key={d._id?.toString()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {d.bookCover && (
                          <img
                            src={d.bookCover}
                            alt={d.bookTitle}
                            className="w-9 h-12 object-cover rounded-lg shadow-sm shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{d.bookTitle || "Unknown Book"}</p>
                          <p className="text-xs text-gray-400">{d.bookAuthor || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="font-semibold text-gray-900">${(d.amount / 100).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={d.deliveryStatus} />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-xs">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
