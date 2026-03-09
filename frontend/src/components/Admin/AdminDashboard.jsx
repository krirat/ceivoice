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
  CartesianGrid,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);

  /* =======================
     FETCH DATA
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
        setTickets(Array.isArray(data) ? data : data.tickets || []);
      } catch (err) {
        console.error("Fetch tickets error:", err);
      }
    };

    fetchTickets();
  }, []);

  /* =======================
     KPI STATS
  ======================= */
  const stats = useMemo(() => {
    const total = tickets.length;

    const inprogress = tickets.filter(
      (t) => t.status === 1 || t.status === 2 || t.status === 3
    ).length;

    const resolved = tickets.filter((t) => t.status === 4).length;

    const avgResolution =
      tickets.reduce((sum, t) => {
        if (!t.last_updated || !t.due_date) return sum;

        const created = new Date(t.last_updated);
        const resolved = new Date(t.due_date);

        return sum + (resolved - created) / (1000 * 60 * 60);
      }, 0) / (tickets.length || 1);

    return {
      total,
      inprogress,
      resolved,
      avgResolutionTime: avgResolution.toFixed(1),
    };
  }, [tickets]);

  /* =======================
     TICKETS BY DAY
  ======================= */
  const ticketsByDay = useMemo(() => {
    const map = {};

    tickets.forEach((t) => {
      if (!t.last_updated) return;

      const date = new Date(t.last_updated).toLocaleDateString();

      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((d) => ({
        date: d,
        tickets: map[d],
      }));
  }, [tickets]);

  /* =======================
     TICKETS BY HOUR
  ======================= */
  const ticketsByHour = useMemo(() => {
    const map = {};

    tickets.forEach((t) => {
      if (!t.last_updated) return;

      const hour = new Date(t.last_updated).getHours();

      map[hour] = (map[hour] || 0) + 1;
    });

    return Object.keys(map)
      .sort((a, b) => a - b)
      .map((h) => ({
        hour: `${h}:00`,
        tickets: map[h],
      }));
  }, [tickets]);

  /* =======================
     STATUS PIE
  ======================= */
  const statusDistribution = useMemo(() => {
    return [
      {
        name: "Open",
        value: tickets.filter((t) => t.status === 0 || t.status === 1).length,
      },
      {
        name: "In Progress",
        value: tickets.filter((t) => t.status === 2 || t.status === 3).length,
      },
      {
        name: "Resolved",
        value: tickets.filter((t) => t.status === 4).length,
      },
    ];
  }, [tickets]);

  /* =======================
     TOP CATEGORY
  ======================= */
  const categoryDistribution = useMemo(() => {
    const map = {};

    tickets.forEach((t) => {
      const cat = t.category || "Other";
      map[cat] = (map[cat] || 0) + 1;
    });

    return Object.keys(map).map((k) => ({
      name: k,
      value: map[k],
    }));
  }, [tickets]);

  const COLORS = ["#6366f1", "#22c55e", "#facc15", "#ef4444", "#06b6d4"];

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px" }}>
        Admin Dashboard
      </h1>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
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
          {/* TICKETS BY DAY */}
          <div style={{ flex: 1 }}>
            <h2 style={{ padding: "8px" }}>Tickets Created Per Day</h2>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="tickets"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* TICKETS BY HOUR */}
          <div style={{ flex: 1 }}>
            <h2 style={{ padding: "8px" }}>Tickets Created Per Hour</h2>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketsByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="tickets"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
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
          {/* STATUS PIE */}
          <div style={{ flex: 1 }}>
            <h2>Ticket Status Distribution</h2>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
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

          {/* CATEGORY PIE */}
          <div style={{ flex: 1 }}>
            <h2>Top Category</h2>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
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