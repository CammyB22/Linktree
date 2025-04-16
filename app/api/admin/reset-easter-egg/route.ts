import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// Keys for storing the easter egg counter and leaderboard in Redis
const EASTER_EGG_COUNTER_KEY = "campuskey:easter_egg_counter"
const EASTER_EGG_LEADERBOARD_KEY = "campuskey:easter_egg_leaderboard"

export async function GET() {
  try {
    // Reset the counter and leaderboard in KV
    await kv.set(EASTER_EGG_COUNTER_KEY, 0)
    await kv.set(EASTER_EGG_LEADERBOARD_KEY, [])

    // Return a simple HTML response
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Easter Egg Reset</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
            .card {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              padding: 20px;
              margin-top: 40px;
            }
            .success {
              color: #10B981;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              background-color: #6366F1;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              text-decoration: none;
              margin-top: 20px;
              transition: background-color 0.2s;
            }
            .button:hover {
              background-color: #4F46E5;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✅ Reset Successful!</div>
            <p>The easter egg counter and leaderboard have been reset to zero.</p>
            <a href="/" class="button">Return to Homepage</a>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  } catch (error) {
    console.error("Error resetting easter egg:", error)

    // Return an error HTML response
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Easter Egg Reset - Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
            .card {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              padding: 20px;
              margin-top: 40px;
            }
            .error {
              color: #EF4444;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              background-color: #6366F1;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              text-decoration: none;
              margin-top: 20px;
              transition: background-color 0.2s;
            }
            .button:hover {
              background-color: #4F46E5;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="error">❌ Error</div>
            <p>Failed to reset the easter egg counter: ${error instanceof Error ? error.message : String(error)}</p>
            <a href="/" class="button">Return to Homepage</a>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
        status: 500,
      },
    )
  }
}
