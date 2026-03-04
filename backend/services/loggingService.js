import db from "../config/db.js";

export const TicketEventType = {
    0: "Created",
    1: "Updated",
    2: "Status ",
    3: "Comment Added",
}

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


/**
  @param {string} userId - ID of the user making the change
  @param {string} ticketId - ID of the ticket being changed
  @param {string} newStatus - The new status of the ticket   
*/
export const logNewStatusEvent = async (ticketId, userId, newStatus) => {

    action = "Changed status to " + newStatus;

    try {
        const query = "INSERT INTO ticket_events (ticket_id, changed_by, action, changed_at) VALUES (?, ?, ?, NOW())";
        await db.query(query, [ticketId, userId, action]);
    } catch (error) {
        console.error("Error logging ticket event:", error);
    }
};

/**
  @param {string} userId - ID of the user making the change
  @param {string} ticketId - ID of the ticket being changed
  @param {string} newAssigneeUsername - The username of the new assignee
*/
export const logReassignedEvent = async (ticketId, userId, newAssigneeUsername) => {

    action = "Reassigned to " + newAssigneeUsername;

    try {
        const query = "INSERT INTO ticket_events (ticket_id, changed_by, action, changed_at) VALUES (?, ?, ?, NOW())";
        await db.query(query, [ticketId, userId, action]);
    } catch (error) {
        console.error("Error logging ticket event:", error);
    }
};

