import React, { useState } from "react";

const initialTickets = [
  {
    id: 1,
    username: "Tom",
    email: "Tom@example.com",
    role: "user",
    department: "elec",
  },
  {
    id: 2,
    username: "Alice",
    email: "Alice@example.com",
    role: "user",
    department: "civil",
  },
  {
    id: 3,
    username: "Havard",
    email: "Havard@example.com",
    role: "assignee",
    department: "com",
  },
  {
    id: 4,
    username: "Robert",
    email: "Robert@example.com",
    role: "user",
    department: "com",
  },
];

export default function Adminassignee() {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRoleChange = (id, newRole) => {
    const updatedTickets = tickets.map((user) =>
      user.id === id ? { ...user, role: newRole } : user,
    );
    setTickets(updatedTickets);
  };

  const handleChangeDepartment = (id, newDepartment) => {
    const updatedTickets = tickets.map((user) =>
      user.id === id ? { ...user, department: newDepartment } : user,
    );
    setTickets(updatedTickets);
  };

  const filteredTickets = tickets.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignee</h1>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-sm"
      />

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="p-2 text-left">UserName</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Department</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-100">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="user">user</option>
                    <option value="assignee">assignee</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={user.department}
                    onChange={(e) =>
                      handleChangeDepartment(user.id, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    <option value="elec">elec</option>
                    <option value="civil">civil</option>
                    <option value="com">com</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTickets.length === 0 && (
          <p className="mt-4 text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}
