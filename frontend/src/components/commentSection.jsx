import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

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
        if (!newComment.trim() || isSubmitting) return;
        setIsSubmitting(true);

        const visibilityStatus = (isInternal && userRole.role !== 0) ? 'internal' : 'public';

        fetch(`${API_URL}/tickets/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },

            body: JSON.stringify({ 
                content: newComment, 
                visibility: visibilityStatus 
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const decodedToken = jwtDecode(localStorage.getItem('auth_token'));
                    
                    setComments(prev => [
                        ...prev, 
                        { 
                            id: data.comment_id, 
                            created_by_username: decodedToken.username, 
                            content: newComment,
                            visibility: visibilityStatus 
                        }
                    ]);
                    
                    setNewComment('');
                    setIsInternal(false); 
                }
            })
            .catch(error => {
                console.error("Error adding comment:", error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div>
            <h3>Comments</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>
                        {comment.visibility === 'internal' && <i>(Internal)</i>} <strong> {comment.created_by_username}</strong>: {comment.content}
                    </li>
                ))}
            </ul>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    disabled={isSubmitting}
                />
                
                {/* checkbox UI to toggle the state */}
                {userRole !== 0 && (
                <label>
                    <input 
                        type="checkbox" 
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        disabled={isSubmitting}
                    />
                    Make Internal
                </label>
                )}

                <button onClick={handleAddComment} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
            </div>
        </div>
    );
}

export default CommentSection;