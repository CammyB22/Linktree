import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Path to the counter file
const counterFilePath = path.join(process.cwd(), "easter-egg-counter.json")

// Function to read the counter from the file
const readCounter = () => {
  try {
    if (fs.existsSync(counterFilePath)) {
      const data = fs.readFileSync(counterFilePath, "utf8")
      return JSON.parse(data).count
    }
  } catch (error) {
    console.error("Error reading counter file:", error)
  }

  // Default value if file doesn't exist or there's an error
  return 0 // Reset to 0 for accurate tracking
}

// Function to write the counter to the file
const writeCounter = (count: number) => {
  try {
    fs.writeFileSync(counterFilePath, JSON.stringify({ count }), "utf8")
  } catch (error) {
    console.error("Error writing counter file:", error)
  }
}

// Initialize the counter file if it doesn't exist
const initializeCounter = () => {
  if (!fs.existsSync(counterFilePath)) {
    writeCounter(0)
  }
}

// Initialize on module load
initializeCounter()

export async function GET() {
  const count = readCounter()
  return NextResponse.json({ count })
}

export async function POST() {
  // Read current count
  let count = readCounter()

  // Increment the counter
  count++

  // Write the new count
  writeCounter(count)

  return NextResponse.json({
    count,
    message: "Easter egg discovery recorded!",
  })
}

// Reset endpoint (optional, for admin use)
export async function DELETE() {
  writeCounter(0)

  return NextResponse.json({
    count: 0,
    message: "Easter egg counter reset to zero",
  })
}
