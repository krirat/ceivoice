import db from "../config/db.js";

export const logAction = async (userId, action) => {
    try {
        const query = "INSERT INTO logs (user_id, action) VALUES (?, ?)";
        await db.query(query, [userId, action]);
    } catch (error) {
        console.error("Error logging action:", error);
    }
};

export const getLogsByTicketId = async (ticketId) => {
    try {
        const query = "SELECT ticket_events.*, users.username FROM ticket_events JOIN users ON ticket_events.user_id = users.id WHERE ticket_events.ticket_id = ? ORDER BY ticket_events.timestamp DESC";
        const { rows } = await db.query(query, [ticketId]);
        return rows;
    } catch (error) {
        console.error("Error fetching logs for ticket:", error);
        return [];
    }
};

export const logTicketEvent = async (ticketId, userId, action) => {
    try {
        const query = "INSERT INTO ticket_events (ticket_id, changed_by, action, changed_at) VALUES (?, ?, ?, NOW())";
        await db.query(query, [ticketId, userId, action]);
    } catch (error) {
        console.error("Error logging ticket event:", error);
    }
};

export const getTicketEvents = async (ticketId) => {
    try {
        const query = "SELECT ticket_events.*, users.username FROM ticket_events JOIN users ON ticket_events.changed_by = users.id WHERE ticket_events.ticket_id = ? ORDER BY ticket_events.changed_at DESC";
        const { rows } = await db.query(query, [ticketId]);
        return rows;
    } catch (error) {
        console.error("Error fetching ticket events:", error);
        return [];
    }
};
