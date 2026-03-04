import React, {useEffect, useState} from "react";
import { useMemo } from "react";
import AdminTicketTable from "../components/Admin/AdminTicketTable.jsx";
import Modal from 'react-modal';
import TicketInfo from '../components/ticketInfo';
import { KpiCard } from "@/components/Admin/AdminTicket.jsx";
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

export default function CustomerDashboard() {
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

        tickets.forEach(ticket => {

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
      const summary = useMemo(() => {
        const result = {
          total: tickets.length,
          open: 0,
          in_progress: 0,
          resolved: 0,
          closed: 0,
          unassigned: 0,
          overdue: 0,
        };
    
        const today = new Date();
    
        tickets.forEach((t) => {
          if (result[t.status] !== undefined) {
            result[t.status]++;
          }
    
          if (!t.assignee || t.assignee === "Unassigned") {
            result.unassigned++;
          }
    
          if (t.due_date && new Date(t.due_date) < today) {
            result.overdue++;
          }
        });
    
        return result;
      }, [tickets]);
    
    return(
        <div className="flex flex-col item-center">
            
        <div>
            <h1 className="text-2xl font-bold mb-4">Ticket Info.</h1>
              <div className="grid grid-cols-4 gap-5 w-full mb-8 px-4">
                <KpiCard
                title="Total Tickets"
                value={summary.total}
                icon={Ticket}
                color="#6366f1"
                />
                <KpiCard
                title="Open Tickets"
                value={summary.open}
                icon={AlertCircle}
                color="#f59e0b"
                />
                <KpiCard
                title="Unassigned"
                value={summary.unassigned}
                icon={UserX}
                color="#ef4444"
                />
                <KpiCard
                title="Overdue"
                value={summary.overdue}
                icon={Clock}
                color="#22c55e"
                />

        </div>
        </div>
        <div className="mt-8">
            <AdminTicketTable tickets={tickets} />
        </div>
    </div>
    );
}

const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    minWidth: "200px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};
