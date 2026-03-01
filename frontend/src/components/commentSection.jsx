import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        fetch(`${API_URL}/tickets/${postId}/comments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }

        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setComments(data.comments);
                }
            });
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        fetch(`${API_URL}/tickets/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ content: newComment })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setComments(prev => [...prev, { id: data.comment_id, content: newComment }]);
                    setNewComment('');
                }
            })
            .catch(error => {
                console.error("Error adding comment:", error);
                console.error("Response:", error.response);
            });
    };

    return (
        <div>
            <h3>Comments</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>{comment.content}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment"
            />
            <button onClick={handleAddComment}>Submit</button>
        </div>
    );

}

export default CommentSection;