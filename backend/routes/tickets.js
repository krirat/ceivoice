import db from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import dotenv from 'dotenv';
import { success } from 'zod';
import { sendEmail } from '../services/emailService.js';


dotenv.config();

const router = express.Router();

//Get all tickets
router.get('/', verifyToken, async (req, res) => {
    const userRole = req.user.role;
    let query = '';
    if (userRole === 0) {
        return res.status(403).send({ message: 'Access denied' });
    } else if (userRole === 1) {
        query = 'SELECT * FROM tickets WHERE status != 0';
    } else if (userRole === 2) {
        query = 'SELECT * FROM tickets';
    }

    try {
        const [rows] = await db.promise().query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).send({ message: 'Database error' });
    }
});

// Get draft Ticket Info
router.get('/:id', verifyToken, async (req, res) => {

    const query = `
SELECT
    tickets.*,
    users_1.username AS creator_username,
    users_2.username AS assignee_username
FROM
    tickets
JOIN users AS users_1 ON tickets.created_by = users_1.id
JOIN users AS users_2 ON tickets.assignee = users_2.id
WHERE tickets.id = ?;`;

    try {
        const [rows] = await db.promise().query(query, [req.params.id]);
        if (rows.length === 0) return res.status(404).send({ message: 'Ticket not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).send({ message: 'Database error' });
    }
});

// Update draft to active ticket / edit fields
router.put('/:id', verifyToken, async (req, res) => {
    const { title, summary, solution, due_date, assignee, status } = req.body; // 'status' will be 1 (Active)

    try {
        const [oldRows] = await db.promise().query(
            `SELECT tickets.status, users.email 
             FROM tickets 
             JOIN users ON tickets.created_by = users.id
             WHERE tickets.id = ?`,
            [req.params.id]
        );

        if (oldRows.length === 0) {
            return res.status(404).send({ message: "Ticket Not Found" });
        }

        const oldStatus = oldRows[0].status;
        const userEmail = oldRows[0].email;

        await db.promise().query(
            'UPDATE tickets SET title=?, summary=?, solution=?, due_date=?, assignee=?, status=?, last_updated=NOW() WHERE id=?',
            [title, summary, solution, due_date, assignee, status, req.params.id]
        );

        if (oldStatus === 0 && status === 1) {
            await sendEmail(
                userEmail,
                "Your Ticket Has Been Published.",
                `Your ticket #${req.params.id} is now active and being processed.`
            );
        }

        await db.promise().query(
            "UPDATE tickets SET title=?, smmary=?, solution=?, due_date=?, assignee=?, status=?, last_updated=NOW() WHERE id=?",
            [title, summary, solution, due_date, assignee, status, req.params.id]
        );

        //notify creator when draft -> active
        if (oldStatus === 0 && status === 1) {
            await sendEmail(
                userEmail,
                "Your Ticket Has Been Published.",
                `Your ticket #${req.params.id} is now active and being processed.`
            );
        }

        //notify assignee
        if (assignee) {
            const [assigneeRows] = await db.promise().query(
                "SELECT email FROM users WHERE id = ?",
                [assignee]
            );

            if (assigneeRows.length > 0) {
                const assigneeEmail = assigneeRows[0].email;

                await sendEmail(
                    assigneeEmail,
                    `You have been assigned Ticket #${req.params.id}`,
                    `
                    <h3>New Ticket Assigned</h3>
                    <p>You have been assigned to ticket #${req.params.id}.</p>
                    <p>Please login to CEiVoice to review it.</p>
                    `
                );
            }
        }

        res.json({ success: true, message: "Ticket updated successfully" });
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Update failed' });
    }
});

// set status of Tickets
router.patch('/:id', verifyToken, async (req, res) => {
    const { status } = req.body;

    try {
        //get ticket creato remail
        const [rows] = await db.promise().query(
            `SELECT users.email 
             FROM tickets
             JOIN users ON tickets.created_by = users.id
             WHERE tickets.id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).send({ message: "Ticket Not Found" });
        }
        const userEmail = rows[0].email;

        await db.promise().query(
            'UPDATE tickets SET status=? where id = ?',
            [status, req.params.id]
        );

        //send amil when resolved or closed
        if (status == 3 || status == 4) {
            await sendEmail(
                userEmail,
                `Ticket #${req.params.id} Status Updated`,
                `
                <h3>Status Updated</h3>
                <p>Your ticket is now marked as 
                <strong>${status == 3 ? "Resolved" : "Closed"}</strong>.
                </p>
                `
            );
        }

        res.status(200).send({
            success: true,
            message: "Status updated successfully",
            ticket_id: req.params.id,
            updated_status: status
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'update failed' })
    }
});

// Merge Tickets
router.post('/merge', verifyToken, async (req, res) => {
    const { ticketIDs } = req.body;

    if (!Array.isArray(ticketIDs) || ticketIDs.length < 2) {
        return res.status(400).send({
            success: false,
            message: 'Please provide an array of at least two ticket IDs to merge.'
        });
    }

    try {
        await db.promise().beginTransaction();

        const [insertResult] = await db.promise().query('INSERT INTO ticket_group () VALUES ()');
        const groupId = insertResult.insertId;

        const [updateResults] = await db.promise().query(
            'UPDATE tickets SET group_id = ? WHERE id IN (?)',
            [groupId, ticketIDs]
        );

        if (updateResults.affectedRows === 0) {
            throw new Error('No valid tickets found to update.');
        }

        await db.promise().commit();

        res.status(200).send({
            success: true,
            message: `${updateResults.affectedRows} tickets successfully merged into group ${groupId}.`,
            groupId: groupId,
            mergedTicketIds: ticketIDs
        });

    } catch (err) {
        await db.promise().rollback();
        console.error('Merge transaction failed:', err);

        if (err.message === 'No valid tickets found to update.') {
            res.status(404).send({ success: false, message: err.message });
        } else {
            res.status(500).send({ success: false, message: 'Ticket merge failed due to a database error' });
        }
    }
});

// get all tickets from a group
router.get('/groups/:groupid', verifyToken, async (req, res) => {
    const sql = 'SELECT * FROM tickets RIGHT JOIN ticket_group ON tickets.group_id=ticket_group.id WHERE tickets.group_id=?'
    try {
        const [results] = await db.promise().query(sql, [req.params.groupid]);
        if (results.length === 0) return res.status(404).send({ message: 'Group not found' });
        res.json(results);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Database error' });
    }
})

// COMMENTS METHODS
// ADD COMMENT
router.post('/:id/comments', verifyToken, async (req, res) => {
    const ticketId = req.params.id;
    const { content, visibility = 'public' } = req.body;
    const author_id = req.user.id;
    const userRole = req.user.role;

    if (!content) {
        return res.status(400).send({
            success: false,
            message: 'Comment content is required.'
        });
    }
    if (userRole === 0 && visibility === 'internal') {
        return res.status(403).send({
            success: false,
            message: 'You do not have permission to add internal comments.'
        });
    }
    try {
        if (visibility === 'internal' && userRole !== 2) {
            const [ticket] = await db.promise().query(
                'SELECT assignee FROM tickets WHERE id = ?',
                [ticketId]
            );

            if (ticket.length === 0) {
                return res.status(404).send({ success: false, message: 'Ticket not found.' });
            }

            if (ticket[0].assignee !== author_id) {
                return res.status(403).send({
                    success: false,
                    message: 'Only the ticket assignee or admins can add internal comments.'
                });
            }
        }

        const [insertResult] = await db.promise().query(
            'INSERT INTO comments (created_by, created_at, content, ticket_id, visibility) VALUES ( ?, NOW(), ?, ?, ?)',
            [author_id, content, ticketId, visibility]
        );

        //notify user on public comment
        if (visibility === "public") {
            const [ticketRows] = await db.promise().query(
                `SELECT users.email
                FROM tickets
                JOIN users ON tickets.created_by = users.id
                WHERE tickets.id = ?`,
                [ticketId]
            );

            if (ticketRows.length > 0) {
                const creatorEmail = ticketRows[0].email;

                await sendEmail(
                    creatorEmail,
                    `New Comment on Ticket #${ticketId}`,
                    `
                    <h3>New Public Comment</h3>
                    <p>A new public comment has been added to your ticket.</p>
                    <p>Please login to CEiVoice to review it.</p>
                `
                );
            }
        }

        res.status(201).send({
            success: true,
            message: 'Comment added successfully',
            comment_id: insertResult.insertId,
            ticket_id: ticketId,
            visibility: visibility
        });

    } catch (err) {
        console.error('Failed to add comment:', err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).send({ success: false, message: 'Ticket not found.' });
        }
        res.status(500).send({ success: false, message: 'Database error while adding comment' });
    }
})

// GET COMMENTS
router.get('/:id/comments', verifyToken, async (req, res) => {
    const ticketId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    try {
        let visiFilter = "AND visibility = 'public'";
        if (userRole == 2) {
            visiFilter = "";
        } else {
            const [ticketRows] = await db.promise().query(
                'SELECT assignee FROM tickets WHERE id = ?',
                [ticketId]
            );
            if (ticketRows.length === 0) {
                return res.status(404).send({ success: false, message: 'Ticket not found' });
            }
            if (ticketRows[0].assignee === userId) {
                visiFilter = "";
            }
        }
        const query = `
            SELECT id, content, created_by, visibility, created_at 
            FROM comments 
            WHERE ticket_id = ? ${visiFilter}
            ORDER BY created_at ASC
        `;
        const [comments] = await db.promise().query(query, [ticketId]);
        res.status(200).send({
            success: true,
            count: comments.length,
            comments: comments
        });
    } catch (err) {
        console.error('Failed to fetch comments:', err);
        res.status(500).send({ success: false, message: 'Database error while fetching comments' });
    }
});

//DELETE COMMENTS
router.delete('/:id/comments/:commentId', verifyToken, async (req, res) => {
    const ticketId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const userRole = req.user.role;
    try {
        const [commentRows] = await db.promise().query(
            'SELECT created_by FROM comments WHERE id = ? AND ticket_id = ?',
            [commentId, ticketId]
        );
        if (commentRows.length === 0) {
            return res.status(404).send({ success: false, message: "Comment not found" });
        }
        const author_id = commentRows[0].created_by;
        if (userRole != 2 && author_id != userId) {
            return res.status(403).send({
                success: false,
                message: 'You do not have permission to delete this comment.'
            });
        }
        await db.promise().query(
            'DELETE FROM comments WHERE id = ?',
            [commentId]
        );
        res.status(200).send({ success: true, message: "Comment deleted" });
    } catch (err) {
        console.error('Failed to delete comment:', err);
        res.status(500).send({ success: false, message: 'Database error while deleting comment' });
    }
});

export default router