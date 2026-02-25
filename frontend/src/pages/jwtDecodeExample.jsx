import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JwtDecodeExample = () => {
    const navigate = useNavigate();
    
    const [decodedData, setDecodedData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) { 
            try {
                const decodedUser = jwtDecode(token);
                console.log("Decoded User:", decodedUser); 
                setDecodedData(decodedUser);
            } catch (error) {
                console.error("Invalid token", error);
                setErrorMsg("The token in localStorage is invalid or malformed.");
            }
        } else {
            setErrorMsg("No token found in localStorage. Please log in first.");
        }
    }, []); // The empty array [] means "run once on mount"

    return (
        <div style={{ padding: '20px' }}>
            <h2>JWT Decode Example</h2>
            
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            
            {/* Display the decoded JSON if it was successful */}
            {decodedData && (
                <div>
                    <p>Token successfully decoded! Payload:</p>
                    <pre style={{ background: '#1234', padding: '15px' }}>
                        {JSON.stringify(decodedData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default JwtDecodeExample;