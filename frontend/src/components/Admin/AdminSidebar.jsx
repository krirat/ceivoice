import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";

export default function DefaultSidebar() {
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
        </div>
      </div>
    </nav>
  );
}
