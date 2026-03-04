import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DefaultSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">

        {/* Logo / Title */}
        <h1 className="text-xl font-bold">Admin Panel</h1>

        {/* Menu Links */}
        <div className="flex space-x-6">
          <Link
            to="/admin"
            className="hover:text-gray-300 transition"
          >
            General
          </Link>

          <Link
            to="/admin/tickets"
            className="hover:text-gray-300 transition"
          >
            All Ticket
          </Link>

          <Link
            to="/admin/assignee"
            className="hover:text-gray-300 transition"
          >
            Assignee
          </Link>
          <LogOut size={20} className="cursor-pointer hover:text-gray-300 transition" onClick={handleLogout} />
        </div>
      </div>
    </nav>
  );
}
