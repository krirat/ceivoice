import express from 'express';
import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import db from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


//AI DRAFT TICKET API

const ticketSchema = z.object({
    suggested_title: z.string().max(100).describe("A concise title under 100 chars."),
    suggested_category: z.enum([
        "Technical Support", 
        "Billing", 
        "HR", 
        "Facilities", 
        "General Inquiry", 
        "Access Control", 
        "Hardware",
        "Academics"
    ]).describe("The strict category of the issue."),
    suggested_summary: z.string().max(500).describe("A summary of key facts and user goals (max 500 chars)."),
    suggested_solution: z.string().describe("1-3 actionable resolution steps or resources."),
    suggested_assignee: z.string().describe("The best available assignees to handle this from suggested category only answer with name!"),
    urgency_level: z.enum(["Low", "Medium", "High", "Critical"]).describe("Urgency based on impact and deadlines."),
});

router.post('/ollama', verifyToken, async (req, res) => {
    const email = req.user.email; //from decoded token
    const {problem} = req.body;

    if (!email && !problem) {
        return res.status(400).send({ message: 'email and problem are required.' });
    }

    try {
        const jsonSchemaObj = zodToJsonSchema(ticketSchema);
        delete jsonSchemaObj.$schema;

        const promptText = `
        You are an AI Support Agent. Analyze the following ticket.
        User Email: ${email}
        Problem: "${problem}"

        ### AVAILABLE ASSIGNEES (Select strictly from this list)
        NAME : SCOPES
        - Prayut : IT
        - Prawit : HR
        - Anutin : Academics
        - Teng : Facilities
        - Aung : General

        You MUST generate a JSON response with these specific fields based on the problem:
        - suggested_title: A short title (max 100 chars).
        - suggested_category: One of [Technical Support, Billing, HR, Facilities, General Inquiry, Access Control, Hardware, Academics].
        - suggested_summary: A summary of the user's issue and goal (max 500 chars).
        - suggested_solution: 1-3 actionable steps to resolve the issue in sentences (no need for separate json steps).
        - suggested_assignee: one of the available assignee's name from  AVAILABLE ASSIGNEES  list that match the category (ANSWER THE NAME ONLY).
        - urgency_level: One of [Low, Medium, High, Critical].
        `;

        const response = await ollama.chat({
            model: 'qwen2.5:14b',
            messages: [
                { role: 'user', content: promptText }
            ],
            format: jsonSchemaObj,
            stream: false,
            options: {
                temperature: 0,
            } 
        });

        console.log("Raw AI Response:", response.message.content);

        const draftTicket = ticketSchema.parse(JSON.parse(response.message.content));

        const insertDraftSQL = '' //TO ADD DATABASE
        res.json({ reply: draftTicket });

    } catch (error) {
        console.error("Error details:", error);
        
        if (error instanceof z.ZodError) {
            res.status(500).json({ 
                error: "AI Output Validation Failed", 
                details: error.issues 
            });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

export default router;