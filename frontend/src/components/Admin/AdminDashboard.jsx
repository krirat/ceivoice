import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_LABEL = {
  0: "Draft",
  1: "New",
  2: "Assigned",
  3: "Resolving",
  4: "Resolved",
  5: "Failed",
};

export default function AdminDashboard() {
  /* =======================
     STATE
  ======================= */
  const [tickets, setTickets] = useState([]);

  /* =======================
     FETCH DATA (useEffect เดียว)
  ======================= */
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_URL}/tickets`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Fetch tickets error:", err);
      }
    };

    fetchTickets();
  }, []);

  /* =======================
     LINE CHART: Avg Resolution Time (mocked/random data)
  ======================= */
  const resolutionTrend = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate random resolution hours for each day
    // You can replace this with a real API fetch if needed
    return days.map((d) => ({
      date: d,
      hours: +(Math.random() * 10).toFixed(1),
    }));
  }, []);

  /* =======================
     KPI SUMMARY
  ======================= */
  const stats = useMemo(() => {
    const total = tickets.length;
    const inprogress = tickets.filter((t) => t.status === 1).length;
    const resolvedTickets = tickets.filter((t) => t.status === 2);

    // Calculate avg resolution from the chart data (mocked data)
    let avgResolutionTime = 0;
    const validHours = resolutionTrend
      .map((d) => d.hours)
      .filter((h) => h > 0);

    if (validHours.length > 0) {
      avgResolutionTime = Number(
        (validHours.reduce((s, h) => s + h, 0) / validHours.length).toFixed(1)
      );
    }
    if (isNaN(avgResolutionTime)) avgResolutionTime = 0;

    return {
      total,
      inprogress,
      resolved: resolvedTickets.length,
      avgResolutionTime,
    };
  }, [resolutionTrend]);

  /* =======================
     LINE CHART: Tickets / Day
  ======================= */
  const ticketsTrend = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = {};

    tickets.forEach((t) => {
      const d = new Date(t.created_at);
      const day = days[d.getDay()];
      map[day] = (map[day] || 0) + 1;
    });

    return days.map((d) => ({
      date: d,
      tickets: map[d] || 0,
    }));
  }, [tickets]);

  /* =======================
     PIE CHART: Status Distribution
  ======================= */
  const statusDistribution = useMemo(() => {
    return [
      { name: "Open", value: tickets.filter((t) => t.status === 0).length },
      {
        name: "In Progress",
        value: tickets.filter((t) => t.status === 1).length,
      },
      { name: "Resolved", value: tickets.filter((t) => t.status === 2).length },
    ];
  }, [tickets]);

  /* =======================
     RENDER
  ======================= */
  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <KpiCard title="Total Tickets" value={stats.total} color="#6366f1" />
        <KpiCard title="In Progress" value={stats.inprogress} color="#facc15" />
        <KpiCard title="Resolved" value={stats.resolved} color="#22c55e" />
        <KpiCard
          title="AVG Resolution"
          value={`${stats.avgResolutionTime} h`}
          color="#ef4444"
        />
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          width: "100%",
          height: "450px",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 className="text-lg p-2">Tickets Created This Week</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketsTrend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="tickets" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1 }}>
            <h2 className="text-lg p-2">Average Resolution Time (Hours)</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="hours" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ height: "200px" }}>
            <h2 className="text-lg">Ticket Status Distribution</h2>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#facc15" />
                  <Cell fill="#22c55e" />
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ height: "200px" }}>
            <h2 className="text-lg">Top Category</h2>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#facc15" />
                  <Cell fill="#22c55e" />
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================
   KPI CARD
======================= */
function KpiCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
      }}
    >
      <p style={{ fontSize: "16px", marginBottom: "6px" }}>{title}</p>
      <h2 style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</h2>
    </div>
  );
}
