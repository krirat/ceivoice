import React, { useState } from 'react';
import { FaTrash, FaCheck, FaSignOutAlt, FaPlus, FaClipboardList, FaCoffee, FaCalendarAlt} from 'react-icons/fa';

const CEI_LOGO_URL = "https://cei.kmitl.ac.th/wp-content/uploads/2024/09/cropped-ceip-fav-1.png"; 
const API_URL = import.meta.env.VITE_API_URL;

const dataList = [
    { id: 1, title: 'First Item' },
    { id: 2, title: 'Second Item' },
    { id: 3, title: 'Third Item' },
];

function CustomerServiceDashboard() {

    return (
        <div className="flex flex-col w-screen p-4">
            <div className="flex text-center justify-around flex-row">
                <div>
                    <h1>30</h1>
                    <h2>Tickets</h2>
                </div>
                <div>
                    <h1>30</h1>
                    <h2>Solved</h2>
                </div>
                <div>
                    <h1>30</h1>
                    <h2>Failed</h2>
                </div>
            </div>
            <div>
                <ul>
                    {dataList.map(item => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CustomerServiceDashboard;