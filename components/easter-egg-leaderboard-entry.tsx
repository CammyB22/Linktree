"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface EasterEggLeaderboardEntryProps {
  position: number
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

export default function EasterEggLeaderboardEntry({ position, onClose, onSubmit }: EasterEggLeaderboardEntryProps) {
  const [initials, setInitials] = useState(["", "", ""])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Available characters for arcade-style input
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?*#$".split("")

  // Handle character selection
  const selectCharacter = (index: number, direction: "up" | "down") => {
    setInitials((prev) => {
      const newInitials = [...prev]
      const currentChar = prev[index]

      let charIndex = currentChar ? characters.indexOf(currentChar) : -1

      if (direction === "up") {
        charIndex = charIndex >= characters.length - 1 ? 0 : charIndex + 1
      } else {
        charIndex = charIndex <= 0 ? characters.length - 1 : charIndex - 1
      }

      newInitials[index] = characters[charIndex]
      return newInitials
    })
  }

  // Move to next or previous initial slot
  const moveSelection = (direction: "next" | "prev") => {
    if (direction === "next") {
      setActiveIndex((prev) => (prev >= 2 ? 0 : prev + 1))
    } else {
      setActiveIndex((prev) => (prev <= 0 ? 2 : prev - 1))
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (success) return

      switch (e.key) {
        case "ArrowUp":
          selectCharacter(activeIndex, "up")
          break
        case "ArrowDown":
          selectCharacter(activeIndex, "down")
          break
        case "ArrowLeft":
          moveSelection("prev")
          break
        case "ArrowRight":
          moveSelection("next")
          break
        case "Enter":
          if (initials.every((initial) => initial)) {
            handleSubmit()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, initials, success])

  // Submit the initials
  const handleSubmit = async () => {
    if (initials.some((initial) => !initial)) {
      setError("Please enter all 3 initials")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(initials.join(""))
      setSuccess(true)

      // Close the popup after showing success message
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError("Failed to save your initials. Please try again.")
      console.error("Error submitting initials:", err)
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
            <div>
              <p className="text-gray-200 text-center mb-4 font-bold">ENTER YOUR INITIALS:</p>
              <div className="flex justify-center gap-4 mb-6">
                {initials.map((char, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`w-16 h-20 border-2 ${
                        index === activeIndex
                          ? "border-yellow-400 bg-purple-900/50"
                          : "border-purple-700 bg-purple-900/20"
                      } flex items-center justify-center text-4xl font-bold font-mono ${
                        index === activeIndex ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {char || "_"}
                    </div>

                    {index === activeIndex && (
                      <>
                        <button
                          onClick={() => selectCharacter(index, "up")}
                          className="absolute -top-8 left-0 right-0 mx-auto w-8 h-8 bg-purple-800 hover:bg-purple-700 text-white flex items-center justify-center rounded-full"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => selectCharacter(index, "down")}
                          className="absolute -bottom-8 left-0 right-0 mx-auto w-8 h-8 bg-purple-800 hover:bg-purple-700 text-white flex items-center justify-center rounded-full"
                        >
                          ▼
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={() => moveSelection("prev")}
                  className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white font-medium rounded-md"
                >
                  ◀ PREV
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || initials.some((initial) => !initial)}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none disabled:opacity-50"
                >
                  {isSubmitting ? "SAVING..." : "SUBMIT"}
                </button>
                <button
                  onClick={() => moveSelection("next")}
                  className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white font-medium rounded-md"
                >
                  NEXT ▶
                </button>
              </div>

              {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

              <p className="text-center text-xs text-gray-400 mt-4">Use arrow keys to navigate and select characters</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="text-green-400 text-lg font-bold mb-2 font-mono">DISCOVERY RECORDED!</div>
                <p className="text-purple-300 font-mono">YOUR INITIALS HAVE BEEN ADDED</p>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
