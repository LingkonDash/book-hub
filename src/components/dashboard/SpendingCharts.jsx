"use client";

import React from 'react';
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
  Legend 
} from 'recharts';

export default function SpendingCharts({ transactions = [], deliveries = [] }) {

  // --- Chart 1: Latest Book Spending Activity ---
  // Sort by date to get the latest transactions, slice to max 6 bars
  const latestSpendingData = [...transactions]
    .sort((a, b) => new Date(b.paidAt || 0) - new Date(a.paidAt || 0))
    .slice(0, 6)
    .map((t, index) => {
      // Find the corresponding book title from deliveries array using transactionId match if necessary
      const correspondingDelivery = deliveries.find(d => d.transactionId === t.transactionId);
      const rawTitle = correspondingDelivery?.bookTitle || t.bookTitle || "Delivery #" + (index + 1);
      
      return {
        name: rawTitle.length > 12 ? rawTitle.slice(0, 12) + "…" : rawTitle,
        amount: parseFloat(t.amount || 0),
      };
    });

  // --- Chart 2: Delivery Status Track ---
  let pendingCount = 0;
  let dispatchedCount = 0;
  let deliveredCount = 0;

  deliveries.forEach(item => {
    const status = item.deliveryStatus || item.status;
    if (status === 'pending') pendingCount++;
    else if (status === 'dispatched' || status === 'shipped') dispatchedCount++;
    else if (status === 'delivered') deliveredCount++;
  });

  const deliveryChartData = [
    { name: 'Pending',    value: pendingCount,    color: '#fc4a32' }, // Primary Brand Color
    { name: 'Dispatched', value: dispatchedCount, color: '#378ADD' },
    { name: 'Delivered',  value: deliveredCount,  color: '#1D9E75' }
  ].filter(d => d.value > 0);

  // Custom premium tooltip style
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
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px' 
      }}
    >
      
      {/* Chart 1 — Latest Deliveries Spending */}
      <div 
        style={{ 
          background: '#fff', 
          border: '0.5px solid #e5e7eb', 
          borderRadius: '14px', 
          padding: '20px' 
        }}
      >
        <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
          Latest Deliveries Spending
        </p>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#9ca3af' }}>
          Amount spent for individual recent deliveries
        </p>
        
        {latestSpendingData.length === 0 ? (
          noData("spending")
        ) : (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latestSpendingData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#6b7280' }} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6b7280' }} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip 
                  contentStyle={tooltipStyle}
                  cursor={{ fill: '#fad4de', opacity: 0.35 }} 
                  formatter={(v) => [`$${v.toFixed(2)}`, "Spent"]}
                />
                <Bar dataKey="amount" fill="#fc4a32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart 2 — Delivery Status Tracking */}
      <div 
        style={{ 
          background: '#fff', 
          border: '0.5px solid #e5e7eb', 
          borderRadius: '14px', 
          padding: '20px' 
        }}
      >
        <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
          Delivery Status
        </p>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#9ca3af' }}>
          Parcel fulfillment journey tracking
        </p>
        
        {deliveryChartData.length === 0 ? (
          noData("delivery")
        ) : (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {deliveryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{v}</span>
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