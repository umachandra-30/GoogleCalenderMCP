## MCP Server Setup

The `server.js` file contains the implementation of the Google Calendar MCP server.

> **Note:** The MCP configuration may vary depending on the editor or MCP client you are using. The following instructions are for **Cursor**.

### Prerequisites

Before configuring the MCP server, ensure you have:

- Node.js installed
- Cursor Editor installed and signed in
- A Google Calendar API key
- Your Google Calendar ID

### Setup in Cursor

1. Open **Cursor**.
2. Go to **Settings**.
3. Navigate to **Tools → MCP**.
4. Add a new MCP server using the following configuration:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": [
        "PATH_TO_SERVER_JS"
      ],
      "env": {
        "GOOGLE_PUBLIC_API_KEY": "YOUR_GOOGLE_API_KEY",
        "CALENDAR_ID": "YOUR_CALENDAR_ID"
      }
    }
  }
}
```

### Configuration

Replace the placeholders below with your own values:

- **PATH_TO_SERVER_JS** – Absolute path to the `server.js` file.
- **YOUR_GOOGLE_API_KEY** – Your Google Calendar API key.
- **YOUR_CALENDAR_ID** – Your Google Calendar ID (typically your Gmail address for your primary calendar).

After saving the configuration, restart Cursor (if required). Your MCP server will then be available for use.

---

##  Important Note

This project currently uses a **Google Calendar API Key**, which can only access **public Google Calendars**.

If your calendar is **private**, the server will not be able to retrieve event details such as the title, description, or attendees. To access private calendars or support creating, updating, and deleting events, you must replace the API key authentication with **OAuth 2.0**.

### Current Features (API Key)

-  Read events from public Google Calendars
-  Retrieve events by date
-  Read private calendars
-  Create calendar events
-  Update calendar events
-  Delete calendar events

For full Google Calendar functionality, OAuth 2.0 authentication is recommended.
## 📚 Resources

For a detailed guide on building custom MCP servers with TypeScript, check out the following article:

- [How to Build a Custom MCP Server with TypeScript – A Handbook for Developers](https://www.freecodecamp.org/news/how-to-build-a-custom-mcp-server-with-typescript-a-handbook-for-developers/)
