import db from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//DASHBOARD APIs

//ADMIN DASHBOARD
//GET ALL ASSIGNEES
router.get('/admin/assignees',verifyToken, async (req, res) => {
    if (req.user.role != 2) {
        return res.status(403).send({ success: false, message: 'Admin access required.' });
    }
    try {
         const [assigneesRows] =  await db.promise().query(
            'SELECT id, username, email, role, department FROM users WHERE role = 1',
        );
        res.status(200).json(assigneesRows);
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Database error' });
    }
});

export default router;