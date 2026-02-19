import {Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminTicket from "../components/Admin/AdminTicket";
import AdminLayout from "../components/Admin/AdminLayout";
import Login from "../components/Login";
import Signup from "../components/Signup";
import CustomerServiceDashboard from "../components/teamDashboard";
import {CardDemo} from "../pages/TicketSubmit"

const AppRouter = () =>{
    return(
    <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tickets" element={<AdminTicket />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cs-dashboard" element={<CustomerServiceDashboard />} />
        <Route path="/ticket-submit" element={<CardDemo />} />
    </Routes>
    );
};
export default AppRouter;