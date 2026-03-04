import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function EventLogSection({ ticketId }) {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        console.log("Fetching event logs...");
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/tickets/logs/${ticketId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                const data = await response.json();
                setLogs(data.events);
            } catch (error) {
                console.error("Error fetching event logs:", error);
            }
        };
        fetchData();

    }, [ticketId]);

    return (
        <ul className="my-2 divide-y divide-gray-300 dark:divide-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700">
            {logs.map(log => (
                <li className="p-2" key={log.id}>{log.changed_at}: {log.action}</li>
            ))}
        </ul>
    );
}

export default EventLogSection;