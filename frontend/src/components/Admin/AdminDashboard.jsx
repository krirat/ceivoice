import DefaultSidebar from "./AdminSidebar";
import React, { useEffect, useState } from "react";
import { Legend } from "recharts";

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
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    inprogress: 0,
    resolved: 0,
    avgResolutionTime: 0,
  });

  const [ticketsTrend, setTicketsTrend] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [resolutionTrend, setResolutionTrend] = useState([]);

  const fakeStatus = [
    { name: "Open", value: 30 },
    { name: "In Progress", value: 45 },
    { name: "Resolved", value: 75 },
  ];

  useEffect(() => {
    // mock data***********
    const fakeStats = {
      total: 120,
      inprogress: 45,
      resolved: 75,
      avgResolutionTime: 18,
    };
    // mock data***********
    const fakeTrend = [
      { date: "Mon", tickets: 10, hours: 20 },
      { date: "Tue", tickets: 20, hours: 18 },
      { date: "Wed", tickets: 15, hours: 22 },
      { date: "Thu", tickets: 30, hours: 15 },
      { date: "Fri", tickets: 25, hours: 16 },
    ];

    setStats(fakeStats);
    setTicketsTrend(fakeTrend);
    setStatusDistribution(fakeStatus);
  }, []);

  return (
    <div>
      <div style={{ padding: "20px", width: "100%" }}>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* KPI Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <KpiCard title="Total Tickets" value={stats.total} color="#6366f1" />
          <KpiCard
            title="In Progress"
            value={stats.inprogress}
            color="#facc15"
          />
          <KpiCard title="Resolved" value={stats.resolved} color="#22c55e" />
          <KpiCard
            title="AVG Resolution"
            value={`${stats.avgResolutionTime} h`}
            color="#ef4444"
          />
        </div>

        {/* Charts Row */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "30px",
            width: "100%",
            height: "450px", // ต้องสูงขึ้น
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Tickets */}
            <div style={{ flex: 1 }}>
              <h2 className="text-lg p-2">Tickets Created This Week</h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ticketsTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tickets" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Resolution */}
            <div style={{ flex: 1 }}>
              <h2 className="text-lg p-2">Average Resolution Time (Hours)</h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ticketsTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ flex: 1 }}>
            <h2 className="text-lg">Ticket Status Distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={120}
                  label
                >
                  <Cell fill="#ef4444" /> {/* Open */}
                  <Cell fill="#facc15" /> {/* In Progress */}
                  <Cell fill="#22c55e" /> {/* Resolved */}
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
      }}
    >
      <p style={{ color: "#18191b", fontSize: "16px", marginBottom: "6px" }}>
        {title}
      </p>

      <h2 style={{ fontSize: "28px", fontWeight: 700, color }}>
        {value}
      </h2>
    </div>
  );
}
