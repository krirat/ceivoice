import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminTicket from "../components/Admin/AdminTicket";
import AdminLayout from "../components/Admin/AdminLayout";
import AdminAssignee from "@/components/Admin/AdminAssignee";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AuthSuccess from "@/authSuccess";
import CustomerServiceDashboard from "../pages/teamDashboard";
import CustomerDashboard from "../pages/CustomerDashboard";
import TicketSubmit from "../pages/TicketSubmit";
import ProtectedRoute from "../hooks/privateRoutes";

const AppRouter = () => {
    return (
        <Routes>
            {/* normal page */}
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/ticket-submit" element={<TicketSubmit />} />
            <Route element={<ProtectedRoute />}>

            {/* Login (ProtectedRoute) */}
            {/* <Route element={<ProtectedRoute />}> */}
                {/* หน้า Admin ทั้งหมด */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="tickets" element={<AdminTicket />} />
                    <Route path="assignee" element={<AdminAssignee />} />
                </Route>
                
                {/* Dashboard */}
                <Route path="/cs-dashboard" element={<CustomerServiceDashboard />} />
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;