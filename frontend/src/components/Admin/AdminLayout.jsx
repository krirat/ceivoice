import DefaultSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <DefaultSidebar />
      <div style={{ padding: "20px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}
