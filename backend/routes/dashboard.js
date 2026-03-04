import db from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//DASHBOARD APIs

//ADMIN DASHBOARD
//GET ALL ASSIGNEES
router.get('/admin/assignees', verifyToken, async (req, res) => {
    if (req.user.role != 1 || req.user.role != 2) {
        return res.status(403).send({ success: false, message: 'Admin access required.' });
    }
    try {
        const [assigneesRows] = await db.promise().query(
            'SELECT id, username, email, role, department FROM users WHERE role = 1',
        );
        res.status(200).json(assigneesRows);
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Database error' });
    }
});

//GET ALL USERS
router.get('/admin/users', verifyToken, async (req, res) => {
    if (req.user.role != 2) {
        return res.status(403).send({ success: false, message: 'Admin access required.' });
    }
    try {
        const [usersRows] = await db.promise().query(
            'SELECT id, username, email, role, department FROM users',
        );
        res.status(200).json(usersRows);
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Database error' });
    }
});

//UPDATE USER ROLE
router.patch('/admin/users/:id/role', verifyToken, async (req, res) => {
    if (req.user.role != 2) {
        return res.status(403).send({ success: false, message: 'Admin access required.' });
    }
    const userId = req.params.id;
    const { role } = req.body;
    if (!['0', '1', '2'].includes(role)) {
        return res.status(400).send({ success: false, message: 'Invalid role value.' });
    }
    try {
        const [result] = await db.promise().query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'User not found.' });
        }
        res.status(200).send({
            success: true,
            message: 'User role updated successfully.',
            updated_user: userId,
            updated_role: role
        });
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Database error' });
    }
});

//UPDATE USER DEPARTMENT
router.patch('/admin/users/:id/department', verifyToken, async (req, res) => {
    if (req.user.role != 2) {
        return res.status(403).send({ success: false, message: 'Admin access required.' });
    }
    const userId = req.params.id;
    const { department } = req.body;
    try {
        const [result] = await db.promise().query(
            'UPDATE users SET department = ? WHERE id = ?',
            [department, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'User not found.' });
        }
        res.status(200).send({
            success: true,
            message: 'User department updated successfully.',
            updated_user: userId,
            updated_department: department
        });
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Database error' });
    }
});

export default router;