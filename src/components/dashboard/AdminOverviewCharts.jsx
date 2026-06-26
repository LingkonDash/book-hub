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

const CATEGORIES = [
  { name: "Fiction",              slug: "fiction",           color: "#fc4a32" },
  { name: "Sci-Fi & Fantasy",     slug: "sci-fi-fantasy",    color: "#378ADD" },
  { name: "Mystery & Thriller",   slug: "mystery-thriller",  color: "#854F0B" },
  { name: "Biography & History",  slug: "biography-history", color: "#185FA5" },
  { name: "Self-Help",            slug: "self-help",         color: "#1D9E75" },
  { name: "Business & Finance",   slug: "business-finance",  color: "#3B6D11" },
  { name: "Technology & Science", slug: "tech-science",      color: "#6D3B9E" },
  { name: "Action & Adventure",   slug: "action-adventure",  color: "#C4790A" },
];

export default function AdminOverviewCharts({
  transactions = [],
  books = [],
}) {

  // --- Chart 1: Latest transactions earnings — title from books array ---
  const latestEarningsData = [...transactions]
    .sort((a, b) => new Date(b.paidAt || 0) - new Date(a.paidAt || 0))
    .slice(0, 6)
    .map((t, index) => {
      const matchedBook = books.find((b) => b._id === t.bookId || b._id?.toString() === t.bookId);
      const rawTitle = matchedBook?.title || `Transaction #${index + 1}`;
      return {
        name: rawTitle.length > 12 ? rawTitle.slice(0, 12) + "…" : rawTitle,
        fullTitle: rawTitle,
        amount: parseFloat(t.amount || 0),
      };
    });

  // --- Chart 2: Books by category ---
  const categoryData = CATEGORIES.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    value: books.filter((b) => b.category === cat.slug).length,
    color: cat.color,
  })).filter((c) => c.value > 0);

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

  const tooltipStyle = {
    backgroundColor: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#374151",
  };

  const noData = (label) => (
    <div style={{
      height: 260,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#9ca3af",
      fontSize: "13px",
      border: "0.5px dashed #e5e7eb",
      borderRadius: "10px",
    }}>
      No {label} data yet
    </div>
  );

  // Custom tooltip for bar chart — shows full title
  const EarningsTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { fullTitle, amount } = payload[0].payload;
    return (
      <div style={{ ...tooltipStyle, padding: "10px 14px" }}>
        <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#111827", maxWidth: 180 }}>{fullTitle}</p>
        <p style={{ margin: 0, color: "#fc4a32", fontWeight: 700 }}>৳{amount.toFixed(2)}</p>
      </div>
    );
  };

  // Custom tooltip for pie charts
  const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    return (
      <div style={{ ...tooltipStyle, padding: "8px 12px" }}>
        <p style={{ margin: "0 0 2px", fontWeight: 600, color: "#111827" }}>{name}</p>
        <p style={{ margin: 0, color: "#6b7280" }}>{value} book{value !== 1 ? "s" : ""}</p>
      </div>
    );
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    }}>

      {/* Chart 1 — Latest transaction earnings */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "14px", padding: "20px" }}>
        <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>
          Latest Earnings
        </p>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}>
          Revenue from the 6 most recent transactions
        </p>
        {latestEarningsData.length === 0 ? noData("earnings") : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latestEarningsData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
                <Tooltip content={<EarningsTooltip />} cursor={{ fill: "#fad4de", opacity: 0.35 }} />
                <Bar dataKey="amount" fill="#fc4a32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart 2 — Books by category */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "14px", padding: "20px" }}>
        <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>
          Books by category
        </p>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}>
          Distribution of books across genres
        </p>
        {categoryData.length === 0 ? noData("category") : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 11, color: "#6b7280" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chart 3 — Book status */}
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: "14px", padding: "20px" }}>
        <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>
          Book catalogue status
        </p>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}>
          Approval state across all listed books
        </p>
        {bookStatusData.length === 0 ? noData("book") : (
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
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}