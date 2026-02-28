import React, { useEffect, useState } from "react";

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

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredTickets = ticket.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.dueDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
        <div className="flex gap-3">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
        Merge
      </button>
    
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
              <tr key={item.id} className="border-t hover:bg-gray-100">
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
                    onClick={() => alert(`Edit ${item.id}`)}
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
    </div>
  );
}
