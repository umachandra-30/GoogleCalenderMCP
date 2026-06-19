import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import { z } from "zod";

dotenv.config();

// create the MCP server
const server = new McpServer({
    name: "UCSR'S Calender",
    version: "1.0.0",
});

// tool function
async function getMyCalendarDataByDate(date) {
    const calendar = google.calendar({
        version: "v3",
        auth: process.env.GOOGLE_PUBLIC_API_KEY,
    });

    // Calculate the start and end of the given date (UTC)
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    try {
        const res = await calendar.events.list({
            calendarId: process.env.CALENDAR_ID,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });

        const events = res.data.items || [];
        const meetings = events.map((event) => {
            const start = event.start.dateTime || event.start.date;
            return `${event.summary} at ${start}`;
        });

        if (meetings.length > 0) {
            return {
                meetings,
            };
        } else {
            return {
                meetings: [],
            };
        }
    } catch (err) {
        return {
            error: err.message,
        };
    }
}

// register the tool to MCP
server.tool(
    "getMyCalendarDataByDate",
    {
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format. Please provide a valid date string.",
        }),
    },
    async ({ date }) => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await getMyCalendarDataByDate(date)),
                },
            ],
        };
    }
);

const app = express();

app.use(express.json());

app.post("/mcp", async (req, res) => {
    try {

        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined
        });

        await server.connect(transport);

        await transport.handleRequest(req, res, req.body);

    } catch (err) {

        console.error(err);

        if (!res.headersSent) {
            res.status(500).json({
                error: "Internal Server Error"
            });
        }

    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Remote MCP Server running on port ${PORT}`);
});