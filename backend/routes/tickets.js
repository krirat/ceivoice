import db from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import dotenv from 'dotenv';
import { success } from 'zod';
import { sendEmail } from '../services/emailService.js';
import { logNewStatusEvent } from '../services/loggingService.js';


dotenv.config();

const router = express.Router();

//Get all tickets
router.get('/', verifyToken, async (req, res) => {
    const userRole = req.user.role;
    let query = '';
    if (userRole === 0) {
        query = 'SELECT tickets.*, users.username AS assignee_username FROM tickets LEFT JOIN users ON tickets.assignee = users.id WHERE created_by = ?';
    } else if (userRole === 1) {
        query = 'SELECT tickets.*, users.username AS assignee_username FROM tickets LEFT JOIN users ON tickets.assignee = users.id WHERE status != 0';
    } else if (userRole === 2) {
        query = 'SELECT tickets.*, users.username AS assignee_username FROM tickets LEFT JOIN users ON tickets.assignee = users.id';
    }

    try {
        console.log("Executing query with user ID:", req.user.id);
        const [rows] = await db.promise().query(query, [req.user.id]);
        console.log(rows);
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
    const { title, summary, solution, due_date, assignee, status, category } = req.body; // 'status' will be 1 (Active)

    try {
        const [oldRows] = await db.promise().query(
            `SELECT tickets.status, users.email, tickets.group_id 
             FROM tickets 
             JOIN users ON tickets.created_by = users.id
             WHERE tickets.id = ?`,
            [req.params.id]
        );

        if (oldRows.length === 0) {
            return res.status(404).send({ message: "Ticket Not Found" });
        }

        const oldStatus = oldRows[0].status;
        let userEmail = oldRows[0].email;
        const groupId = oldRows[0].group_id;

        await db.promise().query(
            'UPDATE tickets SET title=?, summary=?, solution=?, due_date=?, assignee=?, status=?, category=?, last_updated=NOW() WHERE id=?',
            [title, summary, solution, due_date, assignee, status, category, req.params.id]
        );

        //Merged Draft Ticket
        if (groupId) {

            let emailList = [];
            const [originalUsers] = await db.promise().query(`
                SELECT DISTINCT u.email
                FROM tickets t
                JOIN users u ON t.created_by = u.id
                WHERE t.group_id = ? AND t.id != ?
            `, [groupId, req.params.id]);

            emailList = originalUsers.map(user => user.email);
            userEmail = emailList;

        }

        //notify creator when draft -> active
        if (oldStatus === 0 && Number(status) === 1) {
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
        await logNewStatusEvent(req.params.id, req.user.id, status);
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
            `SELECT users.email,tickets.group_id 
             FROM tickets
             JOIN users ON tickets.created_by = users.id
             WHERE tickets.id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).send({ message: "Ticket Not Found" });
        }

        let userEmail = rows[0].email;
        const groupId = rows[0].group_id;

        if (groupId) {

            let emailList = [];
            const [originalUsers] = await db.promise().query(`
                SELECT DISTINCT u.email
                FROM tickets t
                JOIN users u ON t.created_by = u.id
                WHERE t.group_id = ? AND t.id != ?
            `, [groupId, req.params.id]);

            emailList = originalUsers.map(user => user.email);
            userEmail = emailList;

        }

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
        await logNewStatusEvent(req.params.id, req.user.id, status);
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'update failed' })
    }
});

// Merge Tickets
router.post('/merge', verifyToken, async (req, res) => {
    const { ticketIDs } = req.body;
    const adminId = req.user.id;

    if (!Array.isArray(ticketIDs) || ticketIDs.length < 2) {
        return res.status(400).send({
            success: false,
            message: 'Please provide an array of at least two ticket IDs to merge.'
        });
    }

    try {
        await db.promise().beginTransaction();

        const [sourceTickets] = await db.promise().query(
            'SELECT title, category, solution, assignee, summary FROM tickets WHERE id IN (?) LIMIT 1',
            [ticketIDs]
        );

        const baseTitle = sourceTickets.length > 0 ? sourceTickets[0].title : 'Merged Requests';
        const baseCategory = sourceTickets.length > 0 ? sourceTickets[0].category : 'General';
        const baseSolution = sourceTickets.length > 0 ? sourceTickets[0].solution : 'Merged Solutions';
        const baseAssignee = sourceTickets.length > 0 ? sourceTickets[0].assignee : 'Merged Assignee';
        const baseSummary = sourceTickets.length > 0 ? sourceTickets[0].summary : 'Merged Summary';

        const [insertGroupResult] = await db.promise().query('INSERT INTO ticket_group () VALUES ()');
        const groupId = insertGroupResult.insertId;

        //Master DRAFT ticket
        const draftTitle = `[Merged] ${baseTitle}`;
        const draftSummary = `Merged Mass Report: Consolidates ${ticketIDs.length} similar user requests. Linked Original Ticket IDs: ${ticketIDs.join(', ')}.\n${baseSummary}`;

        const [draftTicketResult] = await db.promise().query(
            'INSERT INTO tickets (title, summary, category, status, created_by, solution, last_updated, assignee, group_id) VALUES (?, ?, ?, 0, ?, ?, NOW(), ?, ?)',
            [draftTitle, draftSummary, baseCategory, adminId, baseSolution, baseAssignee, groupId]
        );
        const masterTicketId = draftTicketResult.insertId;

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
            message: `Successfully merged ${ticketIDs.length} requests into Draft Ticket #${masterTicketId}.`,
            groupId: groupId,
            draftTicketId: masterTicketId
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

router.get('/groups/:groupid/members', verifyToken, async (req, res) => {
    const sql = `SELECT DISTINCT u.email
    FROM tickets t
    JOIN users u ON t.created_by = u.id
    WHERE t.group_id = ?`
    try {
        const [results] = await db.promise().query(sql, [req.params.groupid]);

        if (results.length === 0) return res.status(404).send({ message: 'Group not found' });
        res.json(results);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Database error' });
    }
});


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
                `SELECT users.email, tickets.group_id
                FROM tickets
                JOIN users ON tickets.created_by = users.id
                WHERE tickets.id = ?`,
                [ticketId]
            );

            if (ticketRows.length > 0) {
                let creatorEmail = ticketRows[0].email;
                const groupId = ticketRows[0].group_id;

                if (groupId) {

                    let emailList = [];
                    const [originalUsers] = await db.promise().query(`
                SELECT DISTINCT u.email
                FROM tickets t
                JOIN users u ON t.created_by = u.id
                WHERE t.group_id = ? AND t.id != ?
            `, [groupId, ticketId]);

                    emailList = originalUsers.map(user => user.email);
                    creatorEmail = emailList;

                }

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
            SELECT comments.id, content, created_by, visibility, created_at, users.username AS created_by_username 
            FROM comments
            JOIN users ON comments.created_by = users.id
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

router.get('/logs/:id', verifyToken, async (req, res) => {
    const ticketId = req.params.id;
    try {
        const query = "SELECT ticket_events.*, users.username AS changed_by_username FROM ticket_events JOIN users ON ticket_events.changed_by = users.id WHERE ticket_events.ticket_id = ? ORDER BY ticket_events.changed_at DESC";
        const [rows] = await db.promise().query(query, [ticketId]);
        res.status(200).send({
            success: true,
            count: rows.length,
            events: rows
        });
    } catch (err) {
        console.error('Failed to fetch ticket events:', err);
        res.status(500).send({ success: false, message: 'Database error while fetching ticket events' });
    }
});

router.get('/stats/tickets-by-day', verifyToken, async (req, res) => {
    try {
        const query = `
        SELECT 
            DAYNAME(last_updated) AS day,
            COUNT(*) AS total
        FROM tickets
        WHERE YEARWEEK(last_updated,1) = YEARWEEK(CURDATE(),1)
        GROUP BY DAYNAME(last_updated)
        `;

        const [rows] = await db.promise().query(query);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Database error" });
    }
});

router.get('/stats/tickets-by-hour', verifyToken, async (req, res) => {
    try {
        const query = `
        SELECT 
            HOUR(last_updated) AS hour,
            COUNT(*) AS total
        FROM tickets
        GROUP BY HOUR(last_updated)
        ORDER BY hour
        `;

        const [rows] = await db.promise().query(query);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Database error" });
    }
});

router.get('/stats/top-category', verifyToken, async (req, res) => {
    try {
        const query = `
        SELECT 
            category,
            COUNT(*) AS total
        FROM tickets
        GROUP BY category
        ORDER BY total DESC
        `;

        const [rows] = await db.promise().query(query);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Database error" });
    }
});

export default router;