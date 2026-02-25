import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const eventLogs = [
    { id: 1, action: 'Created Ticket #123', timestamp: '2024-10-01 10:00' },
    { id: 2, action: 'Updated Ticket #124', timestamp: '2024-10-01 11:00' },
];

function TicketInfo({ closeTicket, ticketId }) {
    const [ticketData, setTicketData] = useState(null);
    useEffect(() => {
        console.log("Fetching ticket data and event logs...");
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/tickets/${ticketId}`);
                const data = await response.json();
                setTicketData(data);
            } catch (error) {
                console.error("Error fetching ticket data:", error);
            }
        };
        fetchData();

    }, [ticketId]);

    return (
        <div className="p-4 text-gray-700 dark:text-gray-300 ">
            <h1 className="text-3xl font-bold mb-6">{ticketData?.title || "Untitled Ticket"}</h1>
            <div className="my-4 flex justify-between w-full">
                <p className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900">Status: {ticketData?.status || "No Status"}</p> {/*TODO: Make status dropdown*/}
                <div>
                    <span>assigned to:</span>
                    <select> {ticketData?.assignee || "Unassigned"}</select> {/*TODO: Make assignee dropdown*/}
                </div>
            </div>
            <p><span className="font-semibold">Category:</span> {ticketData?.category || "No Category"}</p>
            <p><span className="font-semibold">Created by: </span>{ticketData?.created_by || "Unknown User"}</p>
            <p className="mt-4 font-semibold">Summary: </p>
            <p className="m-2">{ticketData?.summary || "No Summary"}</p>
            <p className="font-semibold">Suggested Solution:</p>
            <p className="m-2 mb-4">{ticketData?.solution || "No Suggested Solution"}</p>
            <p><span className="font-semibold">Due Date:</span> {ticketData?.due_date || "No Due Date"}</p>


            <div className="my-5 bg-white dark:bg-gray-700">
                <div className="my-3 flex justify-between w-full">
                    <p className="font-semibold">Event Logs:</p> <p className="text-sm">Last Updated: {ticketData?.last_updated || "Never"}</p>
                </div>
                <ul className="my-2 divide-y divide-gray-300 dark:divide-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700">
                    {eventLogs.map(log => (
                        <li className="p-2" key={log.id}>{log.timestamp}: {log.action}</li>
                    ))}
                </ul>
            </div>
            <button className="bg-red-400 hover:bg-red-500 p-2 mt-2 border rounded-md" onClick={closeTicket}>Close Ticket</button>
        </div>
    );
}

export default TicketInfo;