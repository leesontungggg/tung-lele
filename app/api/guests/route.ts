import { google } from "googleapis";

// Initialize the Sheets API
const sheets = google.sheets("v4");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("Received request with params:", searchParams.toString());
    const spreadsheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
    const range = process.env.NEXT_PUBLIC_SHEET_RANGE || "SG-Guest!A:H";

    if (!spreadsheetId) {
      return Response.json(
        { error: "NEXT_PUBLIC_SPREADSHEET_ID is not configured" },
        { status: 500 },
      );
    }

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    const values = response.data.values || [];

    // Transform data: assuming first column is name, second is table number
    const guests = values
      .slice(1) // Skip header row
      .filter((row: string[]) => row[2] && row[7]) // Filter out empty rows
      .map((row: string[]) => ({
        name: row[2].trim(),
        tableNumber: row[7].trim(),
      }));

    return Response.json({ guests });
  } catch (error) {
    console.error("Error fetching guests:", error);
    return Response.json(
      { error: "Failed to fetch guests", details: String(error) },
      { status: 500 },
    );
  }
}
