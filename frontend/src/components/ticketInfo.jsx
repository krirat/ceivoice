

const user = { id: 1 };

const eventLogs = [
    { id: 1, action: 'Created Ticket #123', timestamp: '2024-10-01 10:00' },
    { id: 2, action: 'Updated Ticket #124', timestamp: '2024-10-01 11:00' },
];

function TicketInfo({ closeTicket }) {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Ticket Information</h1>
            <p>Name: {user.id}</p>
            <div className="my-5 border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700">
                <h2>Event Logs:</h2>
                <ul className="divide-y divide-gray-300 dark:divide-gray-600 ">
                    {eventLogs.map(log => (
                        <li key={log.id}>{log.timestamp}: {log.action}</li>
                    ))}
                </ul>
            </div>
            <button className="bg-red-400 hover:bg-red-500 p-2 mt-2 border rounded-md" onClick={closeTicket}>Close Ticket</button>
        </div>
    );
}

export default TicketInfo;