import {Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminTicket from "../components/Admin/AdminTicket";
import AdminLayout from "../components/Admin/AdminLayout";

const AppRouter = () =>{
    return(
    <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tickets" element={<AdminTicket />} />
      </Route>
    </Routes>
    );
};
export default AppRouter;