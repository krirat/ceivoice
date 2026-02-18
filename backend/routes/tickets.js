import db from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import dotenv from 'dotenv';


dotenv.config();

const router = express.Router();



// Get draft Ticket Info
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send({ message: 'Ticket not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).send({ message: 'Database error' });
    }
});

// Update ticket
router.put('/:id', verifyToken, async (req, res) => {
    const { title, summary, solution,due_date, assignee, status } = req.body; // 'status' will be 1 (Active)
    
    try {
        await db.promise().query(
            'UPDATE tickets SET title=?, summary=?, solution=?, due_date=?, assignee=?, status=?, last_updated=NOW() WHERE id=?',
            [title, summary, solution, due_date, assignee, status, req.params.id]
        );
        res.json({ success: true, message: "Ticket updated successfully" });
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Update failed' });
    }
});

export default router