function StatusTag({ status }) {
    const statusColors = {
        "Draft": "bg-gray-300 text-gray-800",
        "Open": "bg-green-300 text-green-800",
        "In Progress": "bg-yellow-300 text-yellow-800",
        "Resolved": "bg-blue-300 text-blue-800",
        "Closed": "bg-red-300 text-red-800"
    };

    return (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[status] || "bg-gray-300 text-gray-800"}`}>
            {status}
        </span>
    );
}

export default StatusTag;