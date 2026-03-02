import DefaultSidebar from "./AdminSidebar";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import AdminTicketTable from "./AdminTicketTable";
import { Ticket, AlertCircle, UserX, Clock } from "lucide-react";

const initialtickets = [
  {
    id: 1,
    title: "Login page broken",
    status: "open",
    category: "Bug",
    assignee: "John Doe",
    due_date: "2026-02-28",
  },
  {
    id: 2,
    title: "Add dark mode",
    status: "in_progress",
    category: "Feature Request",
    assignee: "Jane Smith",
    due_date: "2026-03-10",
  },
  {
    id: 3,
    title: "Fix payment gateway",
    status: "resolved",
    category: "Technical Issue",
    assignee: "Unassigned",
    due_date: "2026-02-20",
  },
  {
    id: 4,
    title: "Reset password not working",
    status: "closed",
    category: "Bug",
    assignee: "",
    due_date: "2026-02-15",
  },
  {
    id: 5,
    title: "Upgrade database",
    status: "open",
    category: "Maintenance",
    assignee: "Alex Johnson",
    due_date: "2026-03-01",
  },
  {
    id: 6,
    title: "Improve dashboard UI",
    status: "in_progress",
    category: "UI/UX",
    assignee: "Emily Brown",
    due_date: "2026-02-18",
  },
  {
    id: 7,
    title: "Server downtime issue",
    status: "open",
    category: "Infrastructure",
    assignee: "Unassigned",
    due_date: "2026-02-10",
  },
];

export default function AdminTicket() {
  const tickets = initialtickets;
  const sum_ticket_info = useMemo(() => {
    const summary = {
      total_tickets: tickets.length,

      status_summary: {
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
      },

      category_summary: {},

      unassigned_tickets: 0,
      overdue_tickets: 0,
    };

    const today = new Date();

    tickets.forEach((ticket) => {
      // Status count
      if (summary.status_summary[ticket.status] !== undefined) {
        summary.status_summary[ticket.status]++;
      }

      // Category count
      if (!summary.category_summary[ticket.category]) {
        summary.category_summary[ticket.category] = 0;
      }
      summary.category_summary[ticket.category]++;

      // Unassigned
      if (!ticket.assignee || ticket.assignee === "Unassigned") {
        summary.unassigned_tickets++;
      }

      // Overdue
      if (ticket.due_date && new Date(ticket.due_date) < today) {
        summary.overdue_tickets++;
      }
    });

    return summary;
  }, [tickets]);

  return (
    <div className="flex flex-col items-center">
      <div>
        <h1 className="text-2xl font-bold mb-4">Ticket Info.</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            width: "100%",
          }}
        >
          <KpiCard
            title="Total Tickets"
            value={sum_ticket_info.total_tickets}
            color="#6366f1"
            icon={Ticket}
          />

          <KpiCard
            title="Open Tickets"
            value={sum_ticket_info.status_summary.open}
            color="#f59e0b"
            icon={AlertCircle}
          />

          <KpiCard
            title="Unassigned"
            value={sum_ticket_info.unassigned_tickets}
            color="#ef4444"
            icon={UserX}
          />

          <KpiCard
            title="Overdue"
            value={sum_ticket_info.overdue_tickets}
            color="#22c55e"
            icon={Clock}
          />
        </div>
      </div>
      <div className="mt-8">
        <AdminTicketTable />
      </div>
    </div>
  );
}

function KpiCard({ title, value, color, icon: Icon }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px",
        minWidth: "220px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <p style={{ fontSize: "14px", color: "#6b7280" }}>{title}</p>
        <Icon size={22} color={color} />
      </div>

      <h2
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {value}
      </h2>
    </div>
  );
}
