import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let token = Cookies.get('auth_token');
        
        if (!token) {
            token = localStorage.getItem('auth_token');
        }

        if (token) {
            localStorage.setItem('auth_token', token);
            Cookies.remove('auth_token');
            
            const decoded = jwtDecode(token);
            console.log("Decoded role is:", decoded.role);


            const userRole = Number(decoded.role);

            if (userRole === 2) {
                console.log("Going to Admin");
                navigate('/admin', { replace: true });
            } else if (userRole === 1) {
                console.log("Going to CS Dashboard");
                navigate('/cs-dashboard', { replace: true });
            } else {
                console.log("Going to Customer Dashboard");
                navigate('/customer-dashboard', { replace: true });
            }
        } else {
            console.log("No token found, redirect to login");
            navigate('/login', { state: { message: "Google login failed. Please try again." } });
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <h2 className="text-xl font-semibold text-gray-600">Completing login...</h2>
        </div>
    );
};

export default AuthSuccess;