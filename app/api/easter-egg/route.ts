import { NextResponse } from "next/server"

// In-memory counter for development/preview (will reset on server restart)
let inMemoryCounter = 0
let inMemoryLeaderboard: { name: string; position: number }[] = []

// Check if KV is available
const isKvAvailable = () => {
  try {
    return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  } catch (e) {
    return false
  }
}

// Lazy import KV to avoid errors when not available
const getKv = async () => {
  if (isKvAvailable()) {
    const { kv } = await import("@vercel/kv")
    return kv
  }
  return null
}

// Keys for storing the easter egg counter and leaderboard in Redis
const EASTER_EGG_COUNTER_KEY = "campuskey:easter_egg_counter"
const EASTER_EGG_LEADERBOARD_KEY = "campuskey:easter_egg_leaderboard"

export async function GET() {
  try {
    // Try to use KV if available
    if (isKvAvailable()) {
      const kv = await getKv()
      if (kv) {
        const count = (await kv.get<number>(EASTER_EGG_COUNTER_KEY)) || 0
        const leaderboard = (await kv.get<{ name: string; position: number }[]>(EASTER_EGG_LEADERBOARD_KEY)) || []
        return NextResponse.json({ count, leaderboard, storage: "kv" })
      }
    }

    // Fall back to in-memory counter
    return NextResponse.json({ count: inMemoryCounter, leaderboard: inMemoryLeaderboard, storage: "memory" })
  } catch (error) {
    console.error("Error getting easter egg count:", error)
    // Return in-memory counter as fallback
    return NextResponse.json({
      count: inMemoryCounter,
      leaderboard: inMemoryLeaderboard,
      storage: "memory",
      error: String(error),
    })
  }
}

export async function POST(request: Request) {
  try {
    let count = 0
    let leaderboard: { name: string; position: number }[] = []

    // Try to parse the request body for name
    let name = ""
    try {
      const body = await request.json()
      name = body.name || ""
    } catch (e) {
      // If no body or parsing fails, continue without a name
    }

    // Try to use KV if available
    if (isKvAvailable()) {
      const kv = await getKv()
      if (kv) {
        // Increment counter
        count = await kv.incr(EASTER_EGG_COUNTER_KEY)

        // If name provided, add to leaderboard
        if (name) {
          leaderboard = (await kv.get<{ name: string; position: number }[]>(EASTER_EGG_LEADERBOARD_KEY)) || []
          leaderboard.push({ name, position: count })
          await kv.set(EASTER_EGG_LEADERBOARD_KEY, leaderboard)
        }

        return NextResponse.json({
          count,
          leaderboard,
          message: "Easter egg discovery recorded!",
          storage: "kv",
        })
      }
    }

    // Fall back to in-memory counter
    inMemoryCounter++
    count = inMemoryCounter

    // If name provided, add to in-memory leaderboard
    if (name) {
      inMemoryLeaderboard.push({ name, position: count })
    }

    return NextResponse.json({
      count: inMemoryCounter,
      leaderboard: inMemoryLeaderboard,
      message: "Easter egg discovery recorded!",
      storage: "memory",
    })
  } catch (error) {
    console.error("Error incrementing easter egg count:", error)
    // Increment in-memory counter as fallback
    inMemoryCounter++
    return NextResponse.json({
      count: inMemoryCounter,
      leaderboard: inMemoryLeaderboard,
      message: "Easter egg discovery recorded!",
      storage: "memory",
      error: String(error),
    })
  }
}

// Add name to leaderboard without incrementing counter
export async function PUT(request: Request) {
  try {
    // Parse the request body for name
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    let count = 0
    let leaderboard: { name: string; position: number }[] = []

    // Try to use KV if available
    if (isKvAvailable()) {
      const kv = await getKv()
      if (kv) {
        // Get current counter
        count = (await kv.get<number>(EASTER_EGG_COUNTER_KEY)) || 0

        // Add to leaderboard
        leaderboard = (await kv.get<{ name: string; position: number }[]>(EASTER_EGG_LEADERBOARD_KEY)) || []
        leaderboard.push({ name, position: count })
        await kv.set(EASTER_EGG_LEADERBOARD_KEY, leaderboard)

        return NextResponse.json({
          count,
          leaderboard,
          message: "Name added to leaderboard!",
          storage: "kv",
        })
      }
    }

    // Fall back to in-memory leaderboard
    count = inMemoryCounter
    inMemoryLeaderboard.push({ name, position: count })

    return NextResponse.json({
      count,
      leaderboard: inMemoryLeaderboard,
      message: "Name added to leaderboard!",
      storage: "memory",
    })
  } catch (error) {
    console.error("Error adding name to leaderboard:", error)
    return NextResponse.json(
      {
        error: "Failed to add name to leaderboard",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

// Reset endpoint (optional, for admin use)
export async function DELETE() {
  try {
    if (isKvAvailable()) {
      const kv = await getKv()
      if (kv) {
        await kv.set(EASTER_EGG_COUNTER_KEY, 0)
        await kv.set(EASTER_EGG_LEADERBOARD_KEY, [])
        return NextResponse.json({
          count: 0,
          leaderboard: [],
          message: "Easter egg counter and leaderboard reset to zero",
          storage: "kv",
        })
      }
    }

    // Fall back to in-memory counter
    inMemoryCounter = 0
    inMemoryLeaderboard = []
    return NextResponse.json({
      count: 0,
      leaderboard: [],
      message: "Easter egg counter and leaderboard reset to zero",
      storage: "memory",
    })
  } catch (error) {
    console.error("Error resetting easter egg count:", error)
    // Reset in-memory counter as fallback
    inMemoryCounter = 0
    inMemoryLeaderboard = []
    return NextResponse.json({
      count: 0,
      leaderboard: [],
      message: "Easter egg counter and leaderboard reset to zero",
      storage: "memory",
      error: String(error),
    })
  }
}
