import { Ticket } from "lucide-react";
import DefaultSidebar from "./AdminSidebar";
import React, {useEffect, useState} from "react";
import { useMemo } from "react";

export default function AdminTicket({ tickets = [] }) {

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
        <div style={{ display: "flex" }}>
            
        <div>
            <h1 className="text-2xl font-bold mb-4">Ticket Info.</h1>
        
        <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
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
