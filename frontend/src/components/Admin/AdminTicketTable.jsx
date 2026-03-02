import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import TicketInfo from "../ticketInfo";

const initialtickets = [
  {
    id: 1,
    title: "Login page broken",
    status: "open",
    category: "Bug",
    assignee: "John Doe",
    dueDate: "2026-02-28",
  },
  {
    id: 2,
    title: "Add dark mode",
    status: "in_progress",
    category: "Feature Request",
    assignee: "Jane Smith",
    dueDate: "2026-03-10",
  },
  {
    id: 3,
    title: "Fix payment gateway",
    status: "resolved",
    category: "Technical Issue",
    assignee: "Unassigned",
    dueDate: "2026-02-20",
  },
  {
    id: 4,
    title: "Reset password not working",
    status: "closed",
    category: "Bug",
    assignee: "",
    dueDate: "2026-02-15",
  },
  {
    id: 5,
    title: "Upgrade database",
    status: "open",
    category: "Maintenance",
    assignee: "Alex Johnson",
    dueDate: "2026-03-01",
  },
  {
    id: 6,
    title: "Improve dashboard UI",
    status: "in_progress",
    category: "UI/UX",
    assignee: "Emily Brown",
    dueDate: "2026-02-18",
  },
  {
    id: 7,
    title: "Server downtime issue",
    status: "open",
    category: "Infrastructure",
    assignee: "Unassigned",
    dueDate: "2026-02-10",
  },
];

export default function AdminTicketTable() {
  const [ticket, setTicket] = useState(initialtickets);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [mergeTitle, setMergeTitle] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredTickets = ticket.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dueDate.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleTicketClick = (id) => {
        setTicketId(id);
        setModalIsOpen(true);
    }

  return (
    <div className="p-6 ">
      <Modal
        isOpen={modalIsOpen}
        overlayClassName="pb-8 fixed inset-0 overflow-scroll bg-[#FFFFFF80] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        className="rounded-xl bg-white dark:bg-gray-700 p-4 w-1/2 min-w-[300px] mx-auto mt-20 border-2 border-gray-300"
      >
        <TicketInfo
          closeTicket={() => setModalIsOpen(false)}
          ticketId={ticketId}
        />
      </Modal>
      <div className="flex gap-3">
        <button
          disabled={selectedIds.length < 2}
          onClick={() => setIsMergeOpen(true)}
          className={`px-4 py-2 rounded-lg mb-4 text-white
    ${
      selectedIds.length < 2
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
        >
          Merge
        </button>

        {/* 🔥 Merge Modal */}
        {isMergeOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">
              <h2 className="text-lg font-bold mb-4">Merge Tickets</h2>

              <p className="text-sm text-gray-600 mb-3">
                You are merging <b>{selectedIds.length}</b> tickets.
              </p>

              <label className="block text-sm font-medium mb-1">
                New Ticket Title
              </label>
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Enter new ticket title"
                value={mergeTitle}
                onChange={(e) => setMergeTitle(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setIsMergeOpen(false);
                    setMergeTitle("");
                  }}
                >
                  Cancel
                </button>

                <button
                  disabled={!mergeTitle.trim()}
                  className={`px-4 py-2 rounded text-white
            ${
              mergeTitle.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
                  onClick={() => {
                    const mergedTickets = ticket.filter((t) =>
                      selectedIds.includes(t.id),
                    );

                    const newTicket = {
                      id: Date.now(),
                      title: mergeTitle,
                      status: "open",
                      category: mergedTickets[0].category,
                      assignee: mergedTickets[0].assignee,
                      dueDate: mergedTickets[0].dueDate,
                    };

                    setTicket([
                      ...ticket.filter((t) => !selectedIds.includes(t.id)),
                      newTicket,
                    ]);

                    setSelectedIds([]);
                    setMergeTitle("");
                    setIsMergeOpen(false);
                  }}
                >
                  Merge
                </button>
              </div>
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded w-full max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="p-2 text-left">✅</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Assignee</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-100"
                onClick={() => handleTicketClick(item.id)}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.assignee}</td>
                <td className="p-2">{item.dueDate}</td>
                <td className="p-1 flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                    onClick={() => setEditingTicket(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    onClick={() => alert(`Submit ${item.id}`)}
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 Modal Section */}
      {editingTicket && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Ticket</h2>

            {/* Title */}
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full border rounded px-3 py-2 mb-3"
              value={editingTicket.title}
              onChange={(e) =>
                setEditingTicket({ ...editingTicket, title: e.target.value })
              }
            />

            {/* Status */}
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={editingTicket.status}
              onChange={(e) =>
                setEditingTicket({ ...editingTicket, status: e.target.value })
              }
            >
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="resolved">resolved</option>
              <option value="closed">closed</option>
            </select>

            {/* Category */}
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={editingTicket.category}
              onChange={(e) =>
                setEditingTicket({ ...editingTicket, category: e.target.value })
              }
            >
              <option>Bug</option>
              <option>Feature Request</option>
              <option>Technical Issue</option>
              <option>Maintenance</option>
              <option>UI/UX</option>
              <option>Infrastructure</option>
            </select>

            {/* Assignee */}
            <label className="block text-sm font-medium mb-1">Assignee</label>
            <input
              className="w-full border rounded px-3 py-2 mb-3"
              value={editingTicket.assignee}
              onChange={(e) =>
                setEditingTicket({ ...editingTicket, assignee: e.target.value })
              }
            />

            {/* Due Date */}
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 mb-4"
              value={editingTicket.dueDate}
              onChange={(e) =>
                setEditingTicket({ ...editingTicket, dueDate: e.target.value })
              }
            />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setEditingTicket(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => {
                  setTicket(
                    ticket.map((t) =>
                      t.id === editingTicket.id ? editingTicket : t,
                    ),
                  );
                  setEditingTicket(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
