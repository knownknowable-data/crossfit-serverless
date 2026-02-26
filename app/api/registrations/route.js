import { google } from "googleapis";
import fetch from "node-fetch";

const DIVISIONS = [
  { name: "Men 16-54", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=1&region=0&scaled=0&sort=0" },
  { name: "Women 16-54", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=2&region=0&scaled=0&sort=0" },
  { name: "Men 55-59", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=7&region=0&scaled=0&sort=0" },
  { name: "Women 55-59", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=8&region=0&scaled=0&sort=0" },
  { name: "Men 60-64", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=36&region=0&scaled=0&sort=0" },
  { name: "Women 60-64", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=37&region=0&scaled=0&sort=0" },
  { name: "Men 65-69", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=40&region=0&scaled=0&sort=0" },
  { name: "Women 65-69", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=41&region=0&scaled=0&sort=0" },
  { name: "Men 70+", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=42&region=0&scaled=0&sort=0" },
  { name: "Women 70+", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=43&region=0&scaled=0&sort=0" },
  { name: "Boys 14-15", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=14&region=0&scaled=0&sort=0" },
  { name: "Girls 14-15", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=15&region=0&scaled=0&sort=0" },
];

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    // ✅ Read env vars at runtime
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!privateKey || !clientEmail || !spreadsheetId) {
      throw new Error("Missing one or more Google Sheets environment variables");
    }

    // Google Sheets auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    let grandTotal = 0;
    const divisionValues = [];

    // Fetch each division
    for (const div of DIVISIONS) {
      const res = await fetch(div.url);
      const json = await res.json();
      const total = json.pagination?.totalCompetitors || 0;
      grandTotal += total;
      divisionValues.push([timestamp, div.name, total]);
    }

    // Append division totals + timestamp
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      resource: { values: divisionValues },
    });

    // Append grand total + timestamp
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!D:E",
      valueInputOption: "USER_ENTERED",
      resource: { values: [[timestamp, grandTotal]] },
    });

    return new Response(JSON.stringify({ success: true, grandTotal, timestamp }));
  } catch (err) {
    console.error("Function crash:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
