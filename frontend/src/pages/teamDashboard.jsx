import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import TicketInfo from '../components/ticketInfo';
import AdminTicketTable from '@/components/Admin/AdminTicketTable';
import { FaTrash, FaCheck, FaSignOutAlt, FaPlus, FaClipboardList, FaCoffee, FaCalendarAlt } from 'react-icons/fa';

const CEI_LOGO_URL = "https://cei.kmitl.ac.th/wp-content/uploads/2024/09/cropped-ceip-fav-1.png";
const API_URL = import.meta.env.VITE_API_URL;

const performanceMetrics = [
    { id: 1, label: 'Tickets', value: 100, color: "bg-yellow-400/70 border-yellow-600" },
    { id: 2, label: 'Solved', value: 10, color: "bg-green-400/70 border-green-600" },
    { id: 3, label: 'Failed', value: 5, color: "bg-red-400/70 border-red-600" },
];


function CustomerServiceDashboard() {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ticketId, setTicketId] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log("Fetching tickets...");
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/tickets`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                const data = await response.json();
                setTickets(data);
            } catch (error) {
                console.error("Error fetching ticket data:", error);
            }
        };
        fetchData();

    }, [ticketId]);

    const handleTicketClick = (id) => {
        setTicketId(id);
        setModalIsOpen(true);
    }

    const filteredTickets = useMemo(() => {
        return tickets.filter((t) =>
            [t.title, t.status, t.category, t.assignee, t.due_date]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
        );
    }, [tickets, searchTerm]);

    return (
        <div className="flex flex-col min-h-screen p-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
            <Modal isOpen={modalIsOpen} overlayClassName='pb-8 fixed inset-0 overflow-scroll bg-[#FFFFFF80] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' className="rounded-xl bg-white dark:bg-gray-700 p-4 w-1/2 min-w-[300px] mx-auto mt-20 border-2 border-gray-300">
                <TicketInfo closeTicket={() => setModalIsOpen(false)} ticketId={ticketId} />
            </Modal>
            <div className="my-20 flex text-center justify-around flex-row">
                {performanceMetrics.map(metric => (
                    <div key={metric.id} className={`${metric.color} h-30 w-80 content-center rounded-3xl border`}>
                        <h1 className="text-white text-5xl font-bold">{metric.value}</h1>
                        <h2 className='text-white text-2xl'>{metric.label}</h2>
                    </div>
                ))}
            </div>
            <h1 className="text-3xl font-bold my-4">Tickets:</h1>
            <div className="flex justify-center max-w-[180px] p-2 rounded-full bg-white dark:bg-gray-700">
                {/*TODO: Add filter functionality*/}
                <select name="filter" >
                    <option className="flex justify-center space-x-4 mt-4">Assigned Tickets</option>
                    <option className="flex justify-center space-x-4 mt-4">Unassigned Tickets</option>
                    <option className="flex justify-center space-x-4 mt-4">All Tickets</option>

                </select>
            </div>
            <input
                className="p-2 border rounded w-full max-w-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AdminTicketTable tickets={filteredTickets} onRowClick={handleTicketClick} onEdit={() => { }} onSubmit={() => { }} />
        </div>
    )
}

export default CustomerServiceDashboard;