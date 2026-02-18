import DefaultSidebar from "./AdminSidebar";
import React, {useEffect, useState} from "react";
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
      { date: "Mon", tickets: 10 },
      { date: "Tue", tickets: 20 },
      { date: "Wed", tickets: 15 },
      { date: "Thu", tickets: 30 },
      { date: "Fri", tickets: 25 },
    ];

    setStats(fakeStats);
    setTicketsTrend(fakeTrend);
    setStatusDistribution(fakeStatus);
  }, []);

  return (
    <div>
      
      <div style={{ padding: "20px", width: "100%" }}>
         
        <h1>Admin Dashboard</h1>

        {/* KPI Section */}
        <div style={{ display: "flex", gap: "20px" }}>
          <KpiCard title="Total Tickets" value={stats.total} />
          <KpiCard title="In Progress" value={stats.inprogress} />
          <KpiCard title="Resolved" value={stats.resolved} />
          <KpiCard title="AVG Resolution" value={stats.avgResolutionTime} />
        </div>

        {/* Chart */}
        <div style={{ marginTop: "40px", height: "300px" }}>
          <h2>Tickets Created This Week</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ticketsTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/**Pie Chart */}
        <div style={{ marginTop: "40px", height: "350px" }}>
            <h2>Ticket Status Distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                <Cell fill="#ef4444" />
                <Cell fill="#facc15" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
                <legend />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div style={{ padding: "20px", border: "1px solid #ddd" }}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}