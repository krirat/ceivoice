import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Read the token from the cookie
        const token = Cookies.get('auth_token');

        if (token) {
            // 2. Save it to LocalStorage (Same as normal login)
            localStorage.setItem('token', token);

            // 3. Security Cleanup: Delete the cookie
            Cookies.remove('auth_token');

            // 4. Send user to Dashboard
            navigate('/dashboard'); 
        } else {
            // Failure: Send back to login
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <h2 className="text-xl">Logging you in...</h2>
        </div>
    );
};

export default AuthSuccess;