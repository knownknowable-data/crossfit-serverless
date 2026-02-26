import { google } from "googleapis";

export async function GET() {
  console.log("Function invoked");

  console.log("Env vars check:");
  console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL ? "OK" : "MISSING");
  console.log("GOOGLE_PRIVATE_KEY:", process.env.GOOGLE_PRIVATE_KEY ? "OK" : "MISSING");

  try {
    return new Response(JSON.stringify({ success: true, message: "Function reached!" }));
  } catch (error) {
    console.error("Crash error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
