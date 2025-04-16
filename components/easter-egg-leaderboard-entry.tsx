"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface EasterEggLeaderboardEntryProps {
  position: number
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

export default function EasterEggLeaderboardEntry({ position, onClose, onSubmit }: EasterEggLeaderboardEntryProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Submit the name
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Please enter your name or initials")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(name.trim().toUpperCase())
      setSuccess(true)

      // Close the popup after showing success message
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError("Failed to save your name. Please try again.")
      console.error("Error submitting name:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return "th"
    switch (n % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 max-w-md w-full shadow-xl border border-purple-500/30"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        style={{
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text flex items-center gap-1">
              🏆 SECRET DISCOVERED!
            </span>
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-6">
            <div
              className="text-6xl font-bold mb-2 text-yellow-400 font-mono"
              style={{ textShadow: "0 0 10px rgba(234, 179, 8, 0.7)" }}
            >
              {position}
              <sup>{getOrdinalSuffix(position)}</sup>
            </div>
            <p className="text-green-400 font-mono">YOU FOUND THE SECRET!</p>
            <p className="text-purple-300 mt-2 font-mono">
              {position === 1
                ? "YOU'RE THE FIRST DISCOVERER!"
                : `YOU'RE THE ${position}${getOrdinalSuffix(position)} DISCOVERER!`}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-200 text-center mb-4 font-bold">
                  ENTER YOUR NAME:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  placeholder="Your name or initials"
                  className="w-full bg-purple-900/50 border-2 border-purple-700 focus:border-purple-500 text-white text-center py-3 px-4 rounded-md text-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <p className="text-gray-400 text-xs mt-2 text-center">
                  Maximum 10 characters (letters will be displayed in uppercase)
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none disabled:opacity-50 transition-all duration-200"
                >
                  {isSubmitting ? "SAVING..." : "SUBMIT"}
                </button>
              </div>

              {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}
            </form>
          ) : (
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="text-green-400 text-lg font-bold mb-2 font-mono">DISCOVERY RECORDED!</div>
                <p className="text-purple-300 font-mono">YOUR NAME HAS BEEN ADDED</p>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
