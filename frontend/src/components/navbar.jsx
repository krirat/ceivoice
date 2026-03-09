import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Navbar({ title = "Customer Service" }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate("/login");
    }

    return (
        <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
            <div className="flex justify-between items-center">

                {/* Logo / Title */}
                <h1 className="text-xl font-bold">{title}</h1>

                {/* Menu Links */}
                <div className="flex space-x-6">
                    <button className="hover:text-gray-300 transition" onClick={() => navigate("/ticket-submit")}>
                        Submit New Ticket
                    </button>
                    <LogOut size={20} className="cursor-pointer hover:text-gray-300 transition" onClick={handleLogout} />
                </div>
            </div>
        </nav>
    );
}