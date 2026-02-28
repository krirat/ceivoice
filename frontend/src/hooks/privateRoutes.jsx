import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PrivateRoutes() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    try {
        const decoded = jwtDecode(token);
        
        const currentTime = Date.now() / 1000; //JWT exp seconds <-- Date.now() ms

        if (decoded.exp < currentTime) {
            console.log("Token expired! Redirecting to login...");
            localStorage.removeItem('auth_token'); 
            
            return <Navigate to="/login" replace state={{ message: "Your session has expired. Please log in again." }} />;
        }

        return <Outlet />;
        
    } catch (error) {
        console.error("Invalid token format");
        localStorage.removeItem('auth_token');
        return <Navigate to="/login" replace />;
    }
}

export default PrivateRoutes