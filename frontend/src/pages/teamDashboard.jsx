import React, { useState } from 'react';
import Modal from 'react-modal';
import TicketInfo from '../components/ticketInfo';
import { FaTrash, FaCheck, FaSignOutAlt, FaPlus, FaClipboardList, FaCoffee, FaCalendarAlt } from 'react-icons/fa';

const CEI_LOGO_URL = "https://cei.kmitl.ac.th/wp-content/uploads/2024/09/cropped-ceip-fav-1.png";
const API_URL = import.meta.env.VITE_API_URL;

const tickets = [
    { id: 1, title: 'First Item', status: 'Open', assignee: 'Jane Doe', dueDate: '2028-01-02' },
    { id: 2, title: 'Second Item', status: 'In Progress', assignee: 'John Smith', dueDate: '2028-01-03' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' },
    { id: 3, title: 'Third Item', status: 'Closed', assignee: 'Alice Johnson', dueDate: '2028-01-01' }
];

const performanceMetrics = [
    { id: 1, label: 'Tickets', value: 100, color: "bg-yellow-500" },
    { id: 2, label: 'Solved', value: 10, color: "bg-green-500" },
    { id: 3, label: 'Failed', value: 5, color: "bg-red-500" },
];

const ticketData = {
    title: "Example Ticket",
    created_by: "Jane Doe",
    summary: "This is an example ticket used for demonstration purposes.",
    category: "Technical Issue",
    status: "Open",
    solution: "Try restarting the device.",
    due_date: "2024-10-15",
    last_updated: "2024-10-01 12:00",
    assignee: "John Smith"
};

function CustomerServiceDashboard() {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen p-4 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
            <Modal isOpen={modalIsOpen} className="rounded-xl bg-white dark:bg-gray-700 p-4 w-1/2 min-w-[300px] mx-auto mt-20 border-2 border-gray-300">
                <TicketInfo closeTicket={() => setModalIsOpen(false)} ticketData={ticketData} />
            </Modal>
            <div className="my-20 flex text-center justify-around flex-row">
                {performanceMetrics.map(metric => (
                    <div key={metric.id} className={`${metric.color} size-50 content-center rounded-3xl`}>
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

            {/* <ul className="rounded-lg border border-gray-300 dark:border-gray-600 p-4 mt-4 bg-white dark:bg-gray-700 divide-y divide-gray-300 dark:divide-gray-600">
                {dataList.map(item => (
                    <li key={item.id} className='p-2'><button onClick={() => setModalIsOpen(true)}>{item.title}</button></li>
                ))}
            </ul> */}
            <div className='grid grid-cols-4'>
                <div className='sticky top-0 rounded-tl-xl bg-gray-400 text-center'>
                    Ticket
                </div>
                <div className='sticky top-0 bg-gray-400 text-center'>
                    Status
                </div>
                <div className='sticky top-0 bg-gray-400 text-center'>
                    Assignee
                </div>
                <div className='sticky top-0 rounded-tr-xl bg-gray-400 text-center'>
                    Due Date
                </div>
            </div>

            <div className='max-h-[300px] overflow-y-auto'>
                <table className="w-full border border-t-0 border-separate border-spacing-y-0 rounded-b-xl">

                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id} className='hover:bg-white overflow-auto' onClick={() => setModalIsOpen(true)}>
                                <td className="border border-l-0 border-b-0 border-white p-2">{ticket.title}</td>
                                <td className="border border-b-0 border-white p-2">{ticket.status}</td>
                                <td className="border border-b-0 border-white p-2">{ticket.assignee}</td>
                                <td className="border border-r-0 border-b-0 border-white p-2">{ticket.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CustomerServiceDashboard;