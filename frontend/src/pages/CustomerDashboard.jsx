import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import AdminTicketTable from "../components/Admin/AdminTicketTable.jsx";
import Modal from 'react-modal';
import TicketInfo from '../components/ticketInfo';
import { KpiCard } from "@/components/Admin/AdminTicket.jsx";
import { Ticket, AlertCircle, UserX, Clock } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// const initialtickets = [
//   {
//     id: 1,
//     title: "Login page broken",
//     status: "open",
//     category: "Bug",
//     assignee: "John Doe",
//     due_date: "2026-02-28",
//   },
//   {
//     id: 2,
//     title: "Add dark mode",
//     status: "in_progress",
//     category: "Feature Request",
//     assignee: "Jane Smith",
//     due_date: "2026-03-10",
//   },
//   {
//     id: 3,
//     title: "Fix payment gateway",
//     status: "resolved",
//     category: "Technical Issue",
//     assignee: "Unassigned",
//     due_date: "2026-02-20",
//   },
//   {
//     id: 4,
//     title: "Reset password not working",
//     status: "closed",
//     category: "Bug",
//     assignee: "",
//     due_date: "2026-02-15",
//   },
//   {
//     id: 5,
//     title: "Upgrade database",
//     status: "open",
//     category: "Maintenance",
//     assignee: "Alex Johnson",
//     due_date: "2026-03-01",
//   },
//   {
//     id: 6,
//     title: "Improve dashboard UI",
//     status: "in_progress",
//     category: "UI/UX",
//     assignee: "Emily Brown",
//     due_date: "2026-02-18",
//   },
//   {
//     id: 7,
//     title: "Server downtime issue",
//     status: "open",
//     category: "Infrastructure",
//     assignee: "Unassigned",
//     due_date: "2026-02-10",
//   },
// ];

export default function CustomerDashboard() {
  const [ticketId, setTicketId] = useState(null);
  // const tickets = initialtickets;
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


      useEffect(() => {
          console.log("Fetching tickets...");
          const fetchData = async () => {
              try {
                  const response = await fetch(`${API_URL}/tickets`, {
                      method: 'GET',
                      headers: {
                          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                      },
                  });
                  const data = await response.json();
                  console.log(data);
                  setTickets(data);
              } catch (error) {
                  console.error("Error fetching ticket data:", error);
              }
          };
          fetchData();
  
      }, [ticketId]);

      const handleTicketClick = (id) => {
        setTicketId(id);
        setModalIsOpen(true);
    }

    const filteredTickets = useMemo(() => {
      return tickets.filter((t) =>
          [t.title, t.status, t.category, t.assignee, t.due_date]
              .join(" ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
      );
    }, [tickets, searchTerm]);


    return(
        <div className="flex flex-col item-center">
            
        <div>
            <h1 className="text-2xl font-bold mb-4">Ticket Info.</h1>
              <div className="grid grid-cols-4 gap-5 w-full mb-8 px-4">
                <KpiCard
                title="Total Tickets"
                value={4}
                icon={Ticket}
                color="#6366f1"
                />
                <KpiCard
                title="Open Tickets"
                value={4}
                icon={AlertCircle}
                color="#f59e0b"
                />
                <KpiCard
                title="Unassigned"
                value={4}
                icon={UserX}
                color="#ef4444"
                />
                <KpiCard
                title="Overdue"
                value={4}
                icon={Clock}
                color="#22c55e"
                />

        </div>
      </div>
      <div className="mt-8">
        <Modal isOpen={modalIsOpen} overlayClassName='pb-8 fixed inset-0 overflow-scroll bg-[#FFFFFF80] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' className="rounded-xl bg-white dark:bg-gray-700 p-4 w-1/2 min-w-[300px] mx-auto mt-20 border-2 border-gray-300">
            <TicketInfo closeTicket={() => setModalIsOpen(false)} ticketId={ticketId} />
        </Modal>
        <AdminTicketTable tickets={tickets} showCheckbox={false} showEdit={false} showSubmit={false} onRowClick={handleTicketClick} onEdit={(ticket) => { setEditingTicket(ticket); setIsEditOpen(true); }} onSubmit={() => { }}/>
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
