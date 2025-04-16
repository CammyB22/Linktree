"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function AdminResetPage() {
  const [isResetting, setIsResetting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    count?: number
  } | null>(null)

  const resetEasterEgg = async () => {
    if (isResetting) return

    try {
      setIsResetting(true)
      setResult(null)

      const response = await fetch("/api/easter-egg", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      setResult({
        success: true,
        message: "Easter egg counter and leaderboard reset successfully!",
        count: data.count,
      })
    } catch (error) {
      console.error("Error resetting easter egg:", error)
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Reset Tool</h1>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h2 className="font-medium text-purple-800 mb-2">Easter Egg Counter Reset</h2>
            <p className="text-sm text-gray-600 mb-4">
              This will reset the easter egg counter and clear the leaderboard. This action cannot be undone.
            </p>

            <motion.button
              className={`w-full py-2 px-4 rounded-md font-medium ${
                isResetting || result?.success
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
              whileHover={!isResetting && !result?.success ? { scale: 1.02 } : {}}
              whileTap={!isResetting && !result?.success ? { scale: 0.98 } : {}}
              onClick={resetEasterEgg}
              disabled={isResetting || result?.success}
            >
              {isResetting ? "Resetting..." : result?.success ? "Reset Complete" : "Reset Easter Egg Counter"}
            </motion.button>
          </div>

          {result && (
            <motion.div
              className={`rounded-lg p-4 ${
                result.success ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.success ? "Success!" : "Error"}
              </p>
              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
              {result.success && (
                <p className="text-sm font-medium text-gray-800 mt-2">Counter reset to: {result.count}</p>
              )}
            </motion.div>
          )}

          <div className="text-center mt-6">
            <a href="/" className="text-sm text-purple-600 hover:text-purple-800 underline">
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
