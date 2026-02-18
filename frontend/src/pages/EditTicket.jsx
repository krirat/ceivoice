import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

    const formatDateForInput = (isoDateString) => {
        if (!isoDateString) return '';
        return new Date(isoDateString).toISOString().split('T')[0]; //return only date
    };

const EditTicket = () => {
    const { id } = useParams(); // 1. Get ID from URL 
    const navigate = useNavigate();
    
    // State to hold form data
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        solution: '',
        assignee: '',
        urgency: 'Medium',
        status: 0,
        due_date : ' '
    });
    const [loading, setLoading] = useState(true);

    // 2. Fetch Data on Mount
    useEffect(() => {
        const fetchTicket = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:5001/api/tickets/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (res.ok) {
                    // Populate state with DB data
                    setFormData({
                        title: data.title,
                        summary: data.summary,
                        solution: data.solution,
                        assignee: data.assignee,
                        urgency: data.urgency || 'Medium',
                        status: data.status,
                        due_date: formatDateForInput(data.due_date)
                    });
                } else {
                    alert("Ticket not found");
                    navigate('/admin/dashboard');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id, navigate]);

    // 3. Handle Edit Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Submit (Publish)
    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // status to 1 (active)
        const payload = { ...formData, status: 1 }; 

        const res = await fetch(`http://localhost:5001/api/tickets/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Ticket Published Successfully!");
            navigate('/admin/dashboard');
        } else {
            alert("Failed to update ticket.");
        }
    };

    if (loading) return <div>Loading ticket details...</div>;



    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Review & Edit Draft Ticket #{id}</h1>
            
            <form onSubmit={handleSave} className="bg-white p-6 shadow rounded space-y-4">
                
                {/* TITLE */}
                <div>
                    <label className="block font-semibold">Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* SUMMARY */}
                <div>
                    <label className="block font-semibold">Summary</label>
                    <textarea 
                        name="summary" 
                        value={formData.summary} 
                        onChange={handleChange}
                        rows="3"
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* SOLUTION */}
                <div>
                    <label className="block font-semibold">Suggested Solution</label>
                    <textarea 
                        name="solution" 
                        value={formData.solution} 
                        onChange={handleChange}
                        rows="4"
                        className="w-full border p-2 rounded bg-yellow-50"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* ASSIGNEE */}
                    <div>
                        <label className="block font-semibold">Assignee</label>
                        <input 
                            type="text" 
                            name="assignee" 
                            value={formData.assignee} 
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* URGENCY */}
                    <div>
                        <label className="block font-semibold">Urgency</label>
                        <select 
                            name="urgency" 
                            value={formData.urgency} 
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                {/* DUE DATE FIELD */}
                <div>
                    <label className="block font-semibold mb-1">Due Date</label>
                    <input 
                        type="date" 
                        name="due_date" 
                        value={formData.due_date} 
                        onChange={handleChange}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* SUBMIT BUTTONS */}
                <div className="flex gap-4 mt-6">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Approve & Publish
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTicket;