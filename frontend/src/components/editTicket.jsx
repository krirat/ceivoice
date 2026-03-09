import { useEffect, useState } from "react";



function EditTicket({ editingTicket, setEditingTicket, setIsEditOpen, setTickets }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [assignees, setAssignees] = useState([]);
    const [isSaving, setIsSaving] = useState(false);


        useEffect(() => {
            console.log("Fetching assignees...");
            const fetchData = async () => {
                try {
                    const response = await fetch(`${API_URL}/dashboard/admin/assignees`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                    });
                    const data = await response.json();
                    console.log(data);
                    setAssignees(data);
                } catch (error) {
                    console.error("Error fetching assignee data:", error);
                }
            };
            fetchData();
    
        }, [editingTicket]);


    return (
        console.log("Editing ticket:", editingTicket),
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">
                <h2 className="text-lg font-bold mb-4">Edit Ticket</h2>

        {/* Title */}
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={editingTicket.title}
          disabled={isSaving}
          onChange={(e) =>
            setEditingTicket({ ...editingTicket, title: e.target.value })
          }
        />

        {/* Status */}
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full border rounded px-3 py-2 mb-3"
          value={editingTicket.status}
          disabled={isSaving}
          onChange={(e) =>
            setEditingTicket({ ...editingTicket, status: e.target.value })
          }
        >
          <option value={0}>Draft</option>
          <option value={1}>New</option>
          <option value={2}>Assigned</option>
          <option value={3}>Solving</option>
          <option value={4}>Resolved</option>
          <option value={5}>Failed</option>
        </select>

        {/* Category */}
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={editingTicket.category}
          disabled={isSaving}
          onChange={(e) =>
            setEditingTicket({ ...editingTicket, category: e.target.value })
          }
        />

                {/* Assignee */}
                <label className="block text-sm font-medium mb-1">Assignee</label>
                <select
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={editingTicket.assignee}
                    disabled={isSaving}
                    onChange={(e) =>
                        setEditingTicket({ ...editingTicket, assignee: e.target.value })
                    }
                >
                    {assignees.map((assignee) => (
                        <option key={assignee.id} value={assignee.id}>
                            {assignee.username}
                        </option>
                    ))}
                </select>
                {/* <input
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={editingTicket.assignee}
                    onChange={(e) =>
                        setEditingTicket({ ...editingTicket, assignee: e.target.value })
                    }
                /> */}

        {/* Due Date */}
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2 mb-4"
          value={editingTicket.due_date}
          disabled={isSaving}
          onChange={(e) =>
            setEditingTicket({ ...editingTicket, due_date: e.target.value })
          }
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={isSaving}
            onClick={() => {
              setIsEditOpen(false);
              setEditingTicket(null);
            }}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={async () => {
              if (isSaving) return;
              setIsSaving(true);

                try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/tickets/${editingTicket.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(editingTicket),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }
              setTickets((prev) =>
                prev.map((t) =>
                  t.id === editingTicket.id ? editingTicket : t,
                ),
              );
              setIsEditOpen(false);
              setEditingTicket(null);
              
            } catch (err) {
                console.error("Update error:", err);
            } finally {
              setIsSaving(false);
            }
        }}
          >
           {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTicket;
