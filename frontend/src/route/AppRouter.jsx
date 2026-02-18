import {Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";

const AppRouter = () =>{
    return(
    <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
    );
};
export default AppRouter;