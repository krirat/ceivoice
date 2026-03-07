import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import AdminTicketTable from "./AdminTicketTable";
import TicketInfo from "../ticketInfo";
import EditTicket from "../editTicket";
import { Ticket, AlertCircle, UserX, Clock } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

Modal.setAppElement("#root");

export default function AdminTicket() {
  /* =======================
     STATE
  ======================= */
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [ticketId, setTicketId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [mergeTitle, setMergeTitle] = useState(""); 
  const [isMerging, setIsMerging] = useState(false);

  const [editingTicket, setEditingTicket] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  /* =======================
     FETCH TICKETS
  ======================= */
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

  useEffect(() => {
    fetchTickets();
  }, []);

  /* =======================
     KPI SUMMARY
  ======================= */
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

  /* =======================
     FILTER
  ======================= */
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) =>
      [t.title, t.status, t.category, t.assignee, t.due_date]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [tickets, searchTerm]);

  /* =======================
     HANDLERS
  ======================= */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleMerge = async () => {
    if (selectedIds.length < 2) return;

    setIsMerging(true);

    try {
      const res = await fetch(`${API_URL}/tickets/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ 
            ticketIDs: selectedIds,
            mergeTitle: mergeTitle
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Tickets merged successfully into a Draft Ticket!");
        setSelectedIds([]);
        setMergeTitle("");
        setIsMergeOpen(false);
        fetchTickets();
      } else {
        alert(`Failed to merge tickets: ${data.message}`);
      }
    } catch (err) {
      console.error("Merge tickets error:", err);
      alert("An error occurred while merging.");
    } finally {
      setIsMerging(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="flex flex-col items-center p-6">
      {/* ===== KPI ===== */}
      <h1 className="text-2xl font-bold mb-6">Ticket Info</h1>

      <div className="grid grid-cols-4 gap-5 w-full mb-8">
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

      {/* ===== SEARCH + MERGE ===== */}
      <div className="flex gap-3 w-full mb-4">
        <button
          disabled={selectedIds.length < 2}
          onClick={() => setIsMergeOpen(true)}
          className={`px-4 py-2 rounded-lg text-white
            ${selectedIds.length < 2
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Merge
        </button>

        <input
          className="p-2 border rounded w-full max-w-sm"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ===== TABLE ===== */}
      <AdminTicketTable
        tickets={filteredTickets}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onRowClick={(id) => {
          setTicketId(id);
          setIsDetailOpen(true);
        }}
        onEdit={(ticket) => {
          setEditingTicket(ticket);
          setIsEditOpen(true);
        }}
        onSubmit={(id) => {
          console.log("Submit ticket:", id);
        }}
      />

      {isEditOpen && editingTicket && (
        <EditTicket editingTicket={editingTicket} setEditingTicket={setEditingTicket} setIsEditOpen={setIsEditOpen} setTickets={setTickets} />
      )}

      {/* ===== TICKET DETAIL MODAL ===== */}
      <Modal
        isOpen={isDetailOpen}
        onRequestClose={() => setIsDetailOpen(false)}
        className="bg-white rounded-xl p-4 w-1/2 mx-auto mt-20 border"
        overlayClassName="fixed inset-0 bg-black/30"
      >
        <TicketInfo
          ticketId={ticketId}
          closeTicket={() => setIsDetailOpen(false)}
        />
      </Modal>

      {/* ===== MERGE MODAL ===== */}
      {isMergeOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-105">
            <h2 className="font-bold text-lg mb-4">Merge Tickets</h2>

            <p className="text-sm text-gray-600 mb-3">
              Merging <b>{selectedIds.length}</b> tickets
            </p>

            <input
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="New ticket title (Optional)"
              value={mergeTitle}
              onChange={(e) => setMergeTitle(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={isMerging}
                onClick={() => {
                  setIsMergeOpen(false);
                  setMergeTitle("");
                }}
              >
                Cancel
              </button>

              <button
                disabled={isMerging}
                onClick={handleMerge}
                className={`px-4 py-2 rounded text-white ${isMerging ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isMerging ? "Merging..." : "Merge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   KPI CARD
======================= */
export function KpiCard({ title, value, icon: Icon, color }) {
  return (
    <div
      className="bg-white rounded-xl p-5 shadow-md border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={22} color={color} />
      </div>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}