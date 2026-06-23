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

export default function SpendingCharts({ transactions = [], deliveryData = [] }) {
  // 1. Format transaction array straight for the bar chart
  const spendingData = transactions.map(item => ({
    name: item.bookTitle || "Book",
    amount: item.amount
  }));

  // 2. Count delivery statuses directly
  let pendingCount = 0;
  let shippedCount = 0;
  let deliveredCount = 0;

  deliveryData.forEach(item => {
    if (item.deliveryStatus === 'pending') pendingCount++;
    else if (item.deliveryStatus === 'shipped') shippedCount++;
    else if (item.deliveryStatus === 'delivered') deliveredCount++;
  });

  const deliveryChartData = [
    { name: 'Pending', value: pendingCount || 1, color: '#fc4a32' },   // Primary Color
    { name: 'Shipped', value: shippedCount, color: '#fca132' },
    { name: 'Delivered', value: deliveredCount, color: '#10b981' }
  ].filter(d => d.value > 0); // Hide empty slices

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', padding: '16px' }}>
      
      {/* Chart 1: Spending Track */}
      <div style={{ background: '#white', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>Book Spending Activity</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#9ca3af' }}>Amount spent per book item</p>
        
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} />
              <Tooltip cursor={{ fill: '#fad4de', opacity: 0.4 }} />
              <Bar dataKey="amount" fill="#fc4a32" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Delivery Status Track */}
      <div style={{ background: '#white', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>Delivery Status</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#9ca3af' }}>Parcel fulfillment journey tracking</p>
        
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deliveryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
              >
                {deliveryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}