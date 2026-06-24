"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function LibrarianEarningsCharts({
  transactions = [],
  deliveries = [],
  books = [],
}) {
  
  // --- Chart 1: Latest Deliveries Earnings ---
  // Sort by date to get the latest transactions/deliveries, slice to max 6 bars
  const latestEarningsData = [...transactions]
    .sort((a, b) => new Date(b.paidAt || 0) - new Date(a.paidAt || 0))
    .slice(0, 6)
    .map((t, index) => {
      // Find the corresponding book title from books array or deliveries array for identification
      const correspondingDelivery = deliveries.find(d => d.transactionId === t.transactionId);
      const rawTitle = correspondingDelivery?.bookTitle || "Delivery #" + (index + 1);
      
      return {
        name: rawTitle.length > 12 ? rawTitle.slice(0, 12) + "…" : rawTitle,
        amount: parseFloat(t.amount || 0),
      };
    });

  // --- Chart 2: Delivery status breakdown ---
  let pending = 0, dispatched = 0, delivered = 0;
  deliveries.forEach((d) => {
    // Check both standard deliveryStatus or state properties to be completely safe
    const status = d.deliveryStatus || d.status;
    if (status === "pending") pending++;
    else if (status === "dispatched") dispatched++;
    else if (status === "delivered") delivered++;
  });

  const deliveryData = [
    { name: "Pending",    value: pending,    color: "#fc4a32" },
    { name: "Dispatched", value: dispatched, color: "#378ADD" },
    { name: "Delivered",  value: delivered,  color: "#1D9E75" },
  ].filter((d) => d.value > 0);

  // --- Chart 3: Book status breakdown ---
  let published = 0, pendingApproval = 0, unpublished = 0;
  books.forEach((b) => {
    if (b.status === "published") published++;
    else if (b.status === "pending") pendingApproval++;
    else if (b.status === "unpublished") unpublished++;
  });

  const bookStatusData = [
    { name: "Published",   value: published,       color: "#3B6D11" },
    { name: "Pending",     value: pendingApproval, color: "#854F0B" },
    { name: "Unpublished", value: unpublished,     color: "#888780" },
  ].filter((d) => d.value > 0);

  // Custom tooltip styles
  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#374151",
  };

  const noData = (label) => (
    <div
      style={{
        height: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9ca3af",
        fontSize: "13px",
        border: "0.5px dashed #e5e7eb",
        borderRadius: "10px",
      }}
    >
      No {label} data yet
    </div>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      {/* Chart 1 — Earnings per latest deliveries */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e5e7eb",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Latest Deliveries Earnings
        </p>
        <p
          style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}
        >
          Revenue details for individual recent deliveries
        </p>
        {latestEarningsData.length === 0 ? (
          noData("earnings")
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latestEarningsData} margin={{ left: -20 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#fad4de", opacity: 0.35 }}
                  formatter={(v) => [`$${v.toFixed(2)}`, "Earned"]}
                />
                <Bar dataKey="amount" fill="#fc4a32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart 2 — Delivery status */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e5e7eb",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Delivery status
        </p>
        <p
          style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}
        >
          Fulfilment journey across your orders
        </p>
        {deliveryData.length === 0 ? (
          noData("delivery")
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {deliveryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => [v, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart 3 — Book status */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e5e7eb",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Book catalogue status
        </p>
        <p
          style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}
        >
          Approval state across your listed books
        </p>
        {bookStatusData.length === 0 ? (
          noData("book")
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {bookStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, name) => [v, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}