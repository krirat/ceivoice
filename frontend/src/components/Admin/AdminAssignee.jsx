import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL

export default function Adminassignee() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
    const fetchusers = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/admin/assignees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            'Content-Type': 'application/json'
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };

    fetchusers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${API_URL}/dashboard/admin/users/${id}/role`, {
        method: "PATCH",
        headers : {
          'Authorization' : `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role : newRole })
      })
      const data = res.json()
    } catch (err) {
      console.log(err);
    }
    const updatedTickets = users.map((user) =>
      user.id === id ? { ...user, role: newRole } : user,
    );
    setUsers(updatedTickets);
  };

  const handleChangeDepartment = async (id, newDepartment) => {
    try {
      const res = await fetch(`${API_URL}/dashboard/admin/users/${id}/department`, {
        method: "PATCH",
        headers : {
          'Authorization' : `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ department : newDepartment })
      })
      const data = res.json()
    } catch (err) {
      console.log(err);
    }

    const updatedTickets = users.map((user) =>
      user.id === id ? { ...user, department: newDepartment } : user,
    );
    setUsers(updatedTickets);
  };

  const filteredTickets = users.filter((user) =>
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
                    <option value='0'>user</option>
                    <option value="1">assignee</option>
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
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing">Billing</option>
                    <option value="HR">HR</option>
                    <option value="Facilities">Facilities</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Access Control">Access Control</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Academics">Academics</option>
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
