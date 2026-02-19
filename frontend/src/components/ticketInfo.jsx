


const eventLogs = [
    { id: 1, action: 'Created Ticket #123', timestamp: '2024-10-01 10:00' },
    { id: 2, action: 'Updated Ticket #124', timestamp: '2024-10-01 11:00' },
];

function TicketInfo({ closeTicket, ticketData }) {
    return (
        <div className="p-4 text-gray-700 dark:text-gray-300 ">
            <h1 className="text-3xl font-bold mb-6">{ticketData?.title || "Untitled Ticket"}</h1>
            <div className="my-3 flex justify-between w-full">
                <p className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900">Status: {ticketData?.status || "No Status"}</p> {/*TODO: Make status dropdown*/}
                <div>
                    <span>assigned to:</span>
                    <select> {ticketData?.assignee || "Unassigned"}</select> {/*TODO: Make assignee dropdown*/}
                </div>
            </div>
            <p>Category: {ticketData?.category || "No Category"}</p>
            <p>Created by: {ticketData?.created_by || "Unknown User"}</p>
            <p className="mt-2">Summary: </p>
            <p className="m-2">{ticketData?.summary || "No Summary"}</p>
            <p>suggested soln: </p>
            <p className="m-2">{ticketData?.solution || "No Suggested Solution"}</p>
            <p>Due Date: {ticketData?.due_date || "No Due Date"}</p>


            <div className="my-5 bg-white dark:bg-gray-700">
                <div className="my-3 flex justify-between w-full">
                    <h2>Event Logs:</h2> <p className="text-sm">Last Updated: {ticketData?.last_updated || "Never"}</p>
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