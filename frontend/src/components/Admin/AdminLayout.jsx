import DefaultSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <DefaultSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}
