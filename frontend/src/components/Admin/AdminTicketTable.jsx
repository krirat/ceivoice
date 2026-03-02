import React from "react";

export default function AdminTicketTable({
  tickets,
  selectedIds,
  onToggleSelect,
  onRowClick,
  onEdit,
  onSubmit,
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
        <thead className="bg-gray-400 text-white">
          <tr>
            <th className="p-2 text-left">✔</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Assignee</th>
            <th className="p-2 text-left">Due Date</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-gray-500 p-6">
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-100 cursor-pointer"
                onClick={() => onRowClick(item.id)}
              >
                {/* Checkbox */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>

                <td className="p-2">{item.title}</td>
                <td className="p-2 capitalize">{item.status}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.assignee || "-"}</td>
                <td className="p-2">{item.due_date || "-"}</td>

                {/* Action Buttons */}
                <td className="p-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubmit(item.id);
                    }}
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
