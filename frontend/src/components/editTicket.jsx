function EditTicket({ editingTicket, setEditingTicket, setIsEditOpen, setTickets }) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
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
                <input
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={editingTicket.category}
                    onChange={(e) =>
                        setEditingTicket({ ...editingTicket, category: e.target.value })
                    }
                />

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
                    value={editingTicket.due_date}
                    onChange={(e) =>
                        setEditingTicket({ ...editingTicket, due_date: e.target.value })
                    }
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={() => {
                            setIsEditOpen(false);
                            setEditingTicket(null);
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={() => {
                            setTickets((prev) =>
                                prev.map((t) =>
                                    t.id === editingTicket.id ? editingTicket : t,
                                ),
                            );
                            setIsEditOpen(false);
                            setEditingTicket(null);
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditTicket;