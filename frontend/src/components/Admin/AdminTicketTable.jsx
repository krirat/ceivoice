import React from "react";
import StatusTag from "../ui/statusTag";

const statuses = [
  "Draft",
  "New",
  "Assigned",
  "Solving",
  "Resolved",
];

export default function AdminTicketTable({
  tickets = [],
  selectedIds = [],
  onToggleSelect,
  onRowClick,
  onEdit,
  onSubmit,
  showSubmit = true,
  showCheckbox = true,
  showEdit = true,
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
        <thead className="bg-gray-400 text-white">
          <tr>
            {showCheckbox && (
              <th className="p-2 text-left">✔</th>
            )}
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Assignee</th>
            <th className="p-2 text-left">Due Date</th>
            {showEdit || showSubmit ? (
              <th className="p-2 text-left">Action</th>
            ) : null}
          </tr>
        </thead>

        <tbody>
          {!tickets ? (
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
                {showCheckbox && (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => onToggleSelect(item.id)}
                    />
                  </td>)}

                <td className="p-2">{item.title}</td>
                {/* <td className="p-2 capitalize">{statuses[item.status] || item.status}</td> */}
                <td className="p-2 capitalize"><StatusTag status={statuses[item.status]} /></td>

                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.assignee_username || "-"}</td>
                <td className="p-2">{new Date(item.due_date).toLocaleString("en-GB") || "-"}</td>

                {/* Action Buttons */}
                {showEdit || showSubmit ? (
                  <td className="p-2 flex gap-2">
                    {showEdit && (
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}>

                        Edit
                      </button>
                    )}
                    {showSubmit && (
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSubmit(item.id);
                        }}
                      >
                        Submit
                      </button>
                    )}
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
