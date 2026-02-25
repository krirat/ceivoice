import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoutes() {
    let token = localStorage.getItem('auth_token');
    console.log("Checking auth token:", token);
    return token ? <Outlet /> : <Navigate to="/login" replace />;


}



export default PrivateRoutes