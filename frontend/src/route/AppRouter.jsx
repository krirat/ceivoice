import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminTicket from "../components/Admin/AdminTicket";
import AdminLayout from "../components/Admin/AdminLayout";
import Adminassignee from "@/components/Admin/AdminAssignee";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AuthSuccess from "@/authSuccess";
import CustomerServiceDashboard from "../pages/teamDashboard";
import { CardDemo } from "../pages/TicketSubmit";
import ProtectedRoute from "../hooks/privateRoutes";

const AppRouter = () => {
    return (
        <Routes>
            {/* หน้าทั่วไป */}
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/ticket-submit" element={<CardDemo />} />

            {/* หน้า Admin (ดึงออกมานอก ProtectedRoute ชั่วคราวเพื่อให้ดูหน้าจอได้) */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="tickets" element={<AdminTicket />} />
                <Route path="assignee" element={<AdminAssignee />} />
            </Route>

            {/* หน้าที่ต้อง Login */}
            <Route element={<ProtectedRoute />}>
                <Route path="/cs-dashboard" element={<CustomerServiceDashboard />} />
                <Route path="/customer-dashboard" element={<CardDemo />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;