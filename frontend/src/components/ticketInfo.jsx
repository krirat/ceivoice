import { useEffect, useState } from "react";
import CommentSection from "./commentSection";
import StatusTag from "./ui/statusTag";
import EventLogSection from "./eventLogSection";

const API_URL = import.meta.env.VITE_API_URL;


const eventLogs = [
    { id: 1, action: 'Created Ticket #123', timestamp: '2024-10-01 10:00' },
    { id: 2, action: 'Updated Ticket #124', timestamp: '2024-10-01 11:00' },
];

const statuses = ["Draft", "Open", "In Progress", "Resolved", "Closed"];

function TicketInfo({ closeTicket, ticketId }) {
    const [loading, setLoading] = useState(true);
    const [ticketData, setTicketData] = useState(null);
    useEffect(() => {
        console.log("Fetching ticket data and event logs...");
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                const data = await response.json();
                setTicketData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ticket data:", error);
            }
        };
        fetchData();

    }, [ticketId]);

    return (
        <div className="p-4 text-gray-700 dark:text-gray-300 min-h-[500px]">
            {loading ? (
                <p>Loading ticket information...</p>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-6">{ticketData?.title || "Untitled Ticket"}</h1>
                    <div className="my-4 flex justify-between w-full">
                        <StatusTag status={statuses[ticketData?.status] || "Unknown Status"} /> {/*TODO: Make status dropdown*/}
                        <div>
                            <span>Assigned to:</span>
                            <select> {ticketData?.assignee_username || "Unassigned"}</select> {/*TODO: Make assignee dropdown*/}
                        </div>
                    </div>
                    <p><span className="font-semibold">Category:</span> {ticketData?.category || "No Category"}</p>
                    <p><span className="font-semibold">Created by: </span>{ticketData?.creator_username || "Unknown User"}</p>
                    <p className="mt-4 font-semibold">Summary: </p>
                    <p className="m-2">{ticketData?.summary || "No Summary"}</p>
                    <p className="font-semibold">Suggested Solution:</p>
                    <p className="m-2 mb-4">{ticketData?.solution || "No Suggested Solution"}</p>
                    <p><span className="font-semibold">Due Date:</span> {Date(ticketData?.due_date).toLocaleString() || "No Due Date"}</p>


                    <div className="my-5 bg-white dark:bg-gray-700">
                        <div className="my-3 flex justify-between w-full">
                            <p className="font-semibold">Event Logs:</p> <p className="text-sm">Last Updated: {Date(ticketData?.last_updated).toLocaleString() || "Never"}</p>
                        </div>
                        <EventLogSection ticketId={ticketId} />
                    </div>
                    <CommentSection postId={ticketId} />
                </>
            )}
            <button className="bg-red-400 hover:bg-red-500 p-2 mt-2 border rounded-md" onClick={closeTicket}>Close Ticket</button>
        </div>
    );
}

export default TicketInfo;