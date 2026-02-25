import { Ticket } from "lucide-react";
import DefaultSidebar from "./AdminSidebar";
import React, {useEffect, useState} from "react";
import { useMemo } from "react";
import AdminTicketTable from "./AdminTicketTable";

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

    return(
        <div className="flex flex-col item-center">
            
        <div>
            <h1 className="text-2xl font-bold mb-4">Ticket Info.</h1>
        
        <div className="flex flex-wrap gap-6 justify-center w-full">
            <div style={cardStyle}>
                <h3>Total Ticket</h3>
                <p>{sum_ticket_info.total_tickets}</p>
            </div>
            <div style={cardStyle}>
                <h3>Open Ticket</h3>
                <p>{sum_ticket_info.status_summary.open}</p>
            </div>
            <div style={cardStyle}>
                <h3>Unassigned</h3>
                <p>{sum_ticket_info.unassigned_tickets}</p>
            </div>
            <div style={cardStyle}>
                <h3>Overdue</h3>
                <p>{sum_ticket_info.overdue_tickets}</p>
            </div>

        </div>
        </div>
        <div className="mt-8">
            <AdminTicketTable/>
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
