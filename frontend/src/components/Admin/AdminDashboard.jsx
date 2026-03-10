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
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const DASHBOARD_LOAD_TIME = Date.now();

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filteredTickets = useMemo(() => {
    if (timeFilter === "all") return tickets;

    const thirtyDaysAgo = DASHBOARD_LOAD_TIME - THIRTY_DAYS_MS;

    return tickets.filter((t) => {
      const sourceDate = t.last_updated || t.created_at || t.createdAt;
      if (!sourceDate) return false;

      const ts = new Date(sourceDate).getTime();
      if (Number.isNaN(ts)) return false;

      return ts >= thirtyDaysAgo;
    });
  }, [tickets, timeFilter]);

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
    const total = filteredTickets.length;

    const inprogress = filteredTickets.filter(
      (t) => t.status === 1 || t.status === 2 || t.status === 3
    ).length;

    const resolved = filteredTickets.filter((t) => t.status === 4).length;

    /* ===== FIXED AVG RESOLUTION ===== */
    const validTickets = filteredTickets.filter((t) => {
      if (!t.last_updated || !t.due_date) return false;

      const start = new Date(t.last_updated);
      const end = new Date(t.due_date);

      return end > start;
    });

    let avgResolution = 0;

    if (validTickets.length > 0) {
      const totalHours = validTickets.reduce((sum, t) => {
        const start = new Date(t.last_updated);
        const end = new Date(t.due_date);

        return sum + (end - start) / (1000 * 60 * 60);
      }, 0);

      avgResolution = (totalHours / validTickets.length).toFixed(1);
    }

    return {
      total,
      inprogress,
      resolved,
      avgResolutionTime: avgResolution,
    };
  }, [filteredTickets]);

  /* =======================
     TICKETS BY DAY
  ======================= */
  const ticketsByDay = useMemo(() => {
    const map = {};

    filteredTickets.forEach((t) => {
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
  }, [filteredTickets]);

  /* =======================
     TICKETS BY HOUR
  ======================= */
  const ticketsByHour = useMemo(() => {
    const map = {};

    filteredTickets.forEach((t) => {
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
  }, [filteredTickets]);

  /* =======================
     STATUS PIE
  ======================= */
  const statusDistribution = useMemo(() => {
    return [
      {
        name: "Open",
        value: filteredTickets.filter((t) => t.status === 0 || t.status === 1).length,
      },
      {
        name: "In Progress",
        value: filteredTickets.filter((t) => t.status === 2 || t.status === 3).length,
      },
      {
        name: "Resolved",
        value: filteredTickets.filter((t) => t.status === 4).length,
      },
    ];
  }, [filteredTickets]);

  /* =======================
     CATEGORY PIE
  ======================= */
  const categoryDistribution = useMemo(() => {
    const map = {};

    filteredTickets.forEach((t) => {
      const cat = t.category || "Other";
      map[cat] = (map[cat] || 0) + 1;
    });

    return Object.keys(map).map((k) => ({
      name: k,
      value: map[k],
    }));
  }, [filteredTickets]);

  const COLORS = ["#6366f1", "#22c55e", "#facc15", "#ef4444", "#06b6d4", "#FF7F00"];

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px" }}>
        Admin Dashboard
      </h1>

      <div
        style={{
          display: "inline-flex",
          background: "#f1f5f9",
          borderRadius: "999px",
          padding: "4px",
          gap: "4px",
          marginBottom: "20px",
        }}
      >
        <button
          type="button"
          onClick={() => setTimeFilter("all")}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 600,
            background: timeFilter === "all" ? "#1e293b" : "transparent",
            color: timeFilter === "all" ? "#fff" : "#334155",
          }}
        >
          All Tickets
        </button>
        <button
          type="button"
          onClick={() => setTimeFilter("30d")}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 600,
            background: timeFilter === "30d" ? "#1e293b" : "transparent",
            color: timeFilter === "30d" ? "#fff" : "#334155",
          }}
        >
          Past 30 Days
        </button>
      </div>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4,1fr)",
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
          flexDirection: isMobile ? "column" : "row",
          gap: "30px",
          width: "100%",
          height: isMobile ? "auto" : "450px",
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
          <div style={{ flex: 1, minHeight: isMobile ? "240px" : 0 }}>
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
          <div style={{ flex: 1, minHeight: isMobile ? "240px" : 0 }}>
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
          <div style={{ flex: 1, minHeight: isMobile ? "300px" : 0 }}>
            <h2>Ticket Status Distribution</h2>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 36 }}>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy={isMobile ? "42%" : "50%"}
                  innerRadius={isMobile ? 36 : 50}
                  outerRadius={isMobile ? 62 : 90}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#facc15" />
                  <Cell fill="#22c55e" />
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* CATEGORY PIE */}
          <div style={{ flex: 1, minHeight: isMobile ? "320px" : 0 }}>
            <h2>Top Category</h2>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 36 }}>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy={isMobile ? "42%" : "50%"}
                  innerRadius={isMobile ? 28 : 40}
                  outerRadius={isMobile ? 58 : 80}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
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