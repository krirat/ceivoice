import {Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import Login from "../components/Login";
import Signup from "../components/Signup";
import CustomerServiceDashboard from "../components/teamDashboard"
const AppRouter = () =>{
    return(
    <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cs-dashboard" element={<CustomerServiceDashboard />} />
    </Routes>
    );
};
export default AppRouter;