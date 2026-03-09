import { useEffect, useState } from "react";
import CommentSection from "./commentSection";
import StatusTag from "./ui/statusTag";
import EventLogSection from "./eventLogSection";

const API_URL = import.meta.env.VITE_API_URL;


const statuses = ["Draft", "New", "Assigned", "Solving", "Resolved", "Failed"];

function TicketInfo({ closeTicket, ticketId }) {
    const [loading, setLoading] = useState(true);
    const [ticketData, setTicketData] = useState(null);
    const [groupMembers, setGroupMembers] = useState(null)
    useEffect(() => {
        console.log("Fetching ticket data...");
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
                console.log(data)
                if (data.group_id) {
                    const res = await fetch(`${API_URL}/tickets/groups/${data.group_id}/members`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                    });
                    const members = await res.json();
                    setGroupMembers(members);
                }
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
                        <p><span className="font-semibold">Assigned to:</span> {ticketData?.assignee_username || "Unassigned"}</p>
                    </div>
                    <p><span className="font-semibold">Category:</span> {ticketData?.category || "No Category"}</p>
                    <p><span className="font-semibold">Created by: </span>{ticketData?.creator_username || "Unknown User"} {groupMembers && groupMembers.map((member, index) => (
                        <span key={index}>{index == 0 ? "(" : ""}{member.email}{index < groupMembers.length - 1 ? ", " : ")"}</span>
                    ))}</p>
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