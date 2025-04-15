import { NextResponse } from "next/server"

// In-memory counter for development/preview (will reset on server restart)
let inMemoryCounter = 0

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

// Key for storing the easter egg counter in Redis
const EASTER_EGG_COUNTER_KEY = "campuskey:easter_egg_counter"

export async function GET() {
  try {
    // Try to use KV if available
    if (isKvAvailable()) {
      const kv = await getKv()
      if (kv) {
        const count = (await kv.get<number>(EASTER_EGG_COUNTER_KEY)) || 0
        return NextResponse.json({ count, storage: "kv" })
      }
    }

    // Fall back to in-memory counter
    return NextResponse.json({ count: inMemoryCounter, storage: "memory" })
  } catch (error) {
    console.error("Error getting easter egg count:", error)
    // Return in-memory counter as fallback
    return NextResponse.json({ count: inMemoryCounter, storage: "memory", error: String(error) })
  }
}

export async function POST() {
  try {
    let count = 0

    // Try to use KV if available
    if (isKvAvailable()) {
      const kv = await getKv()
      if (kv) {
        count = await kv.incr(EASTER_EGG_COUNTER_KEY)
        return NextResponse.json({
          count,
          message: "Easter egg discovery recorded!",
          storage: "kv",
        })
      }
    }

    // Fall back to in-memory counter
    inMemoryCounter++
    return NextResponse.json({
      count: inMemoryCounter,
      message: "Easter egg discovery recorded!",
      storage: "memory",
    })
  } catch (error) {
    console.error("Error incrementing easter egg count:", error)
    // Increment in-memory counter as fallback
    inMemoryCounter++
    return NextResponse.json({
      count: inMemoryCounter,
      message: "Easter egg discovery recorded!",
      storage: "memory",
      error: String(error),
    })
  }
}

// Reset endpoint (optional, for admin use)
export async function DELETE() {
  try {
    if (isKvAvailable()) {
      const kv = await getKv()
      if (kv) {
        await kv.set(EASTER_EGG_COUNTER_KEY, 0)
        return NextResponse.json({
          count: 0,
          message: "Easter egg counter reset to zero",
          storage: "kv",
        })
      }
    }

    // Fall back to in-memory counter
    inMemoryCounter = 0
    return NextResponse.json({
      count: 0,
      message: "Easter egg counter reset to zero",
      storage: "memory",
    })
  } catch (error) {
    console.error("Error resetting easter egg count:", error)
    // Reset in-memory counter as fallback
    inMemoryCounter = 0
    return NextResponse.json({
      count: 0,
      message: "Easter egg counter reset to zero",
      storage: "memory",
      error: String(error),
    })
  }
}
