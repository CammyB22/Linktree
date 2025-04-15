"use client"

import { motion } from "framer-motion"
import { useMood } from "@/context/mood-context"
import { useState, useEffect } from "react"
import { TrophyIcon } from "lucide-react"

export default function MoodToggle() {
  const { mood, setMood } = useMood()
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)
  const [easterEggCounter, setEasterEggCounter] = useState(0)
  const [hasFoundEasterEgg, setHasFoundEasterEgg] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [storageType, setStorageType] = useState<string | null>(null)

  const moodOptions = [
    { id: "chill", emoji: "☕", label: "Chill", color: "from-blue-200 to-purple-200" },
    { id: "hustle", emoji: "⚡", label: "Hustle", color: "from-orange-200 to-red-200" },
    { id: "study", emoji: "💻", label: "Study", color: "from-green-200 to-teal-200" },
  ]

  // Function to fetch the easter egg count
  const fetchEasterEggCount = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/easter-egg")

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      setEasterEggCounter(data.count)
      setStorageType(data.storage)

      // Check if this user has already found the easter egg
      const found = localStorage.getItem("hasFoundSuperEasterEgg") === "true"
      setHasFoundEasterEgg(found)
    } catch (error) {
      console.error("Error fetching easter egg count:", error)
      // Don't update the counter if there's an error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEasterEggCount()

    // Listen for easter egg found events from the footer component
    const handleEasterEggFound = (event: CustomEvent) => {
      setEasterEggCounter(event.detail.count)
      setHasFoundEasterEgg(true)
      if (event.detail.storage) {
        setStorageType(event.detail.storage)
      }
    }

    window.addEventListener("easterEggFound", handleEasterEggFound as EventListener)

    return () => {
      window.removeEventListener("easterEggFound", handleEasterEggFound as EventListener)
    }
  }, [])

  return (
    <motion.div
      className="flex flex-col items-center mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex space-x-3">
        {moodOptions.map((option) => {
          const isActive = mood === option.id
          const isHovered = hoveredMood === option.id

          return (
            <motion.button
              key={option.id}
              className={`relative px-5 py-3 rounded-xl flex items-center justify-center overflow-hidden ${
                isActive ? "bg-white shadow-sm" : "bg-[#e6fff0]/70 backdrop-blur-sm hover:bg-white/50"
              }`}
              onMouseEnter={() => setHoveredMood(option.id)}
              onMouseLeave={() => setHoveredMood(null)}
              whileHover={{
                scale: 1.05,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              whileTap={{
                scale: 0.95,
                transition: {
                  duration: 0.1,
                  ease: "easeIn",
                },
              }}
              onClick={() => setMood(option.id as any)}
            >
              {/* Background glow effect when active */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${option.color} rounded-xl opacity-30`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.2, 0.3, 0.2],
                    scale: [0.95, 1, 0.95],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}

              {/* Hover effect */}
              {isHovered && !isActive && (
                <motion.div
                  className="absolute inset-0 bg-white/50 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                />
              )}

              {/* Emoji with bounce effect */}
              <motion.span
                className="mr-2 text-lg"
                animate={
                  isActive
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: option.id === "hustle" ? [0, 5, -5, 0] : 0,
                      }
                    : {}
                }
                transition={{
                  duration: option.id === "hustle" ? 0.5 : 0.3,
                  repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                  repeatDelay: 2,
                }}
              >
                {option.emoji}
              </motion.span>

              <span className="font-medium relative">
                {option.label}

                {/* Underline animation when active */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r"
                    style={{
                      backgroundImage:
                        option.id === "chill"
                          ? "linear-gradient(to right, #93c5fd, #c4b5fd)"
                          : option.id === "hustle"
                            ? "linear-gradient(to right, #fb923c, #fb7185)"
                            : "linear-gradient(to right, #6ee7b7, #34d399)",
                    }}
                    initial={{ width: "0%", left: "50%" }}
                    animate={{ width: "100%", left: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </span>
            </motion.button>
          )
        })}
      </div>
      <motion.div
        className="mt-4 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="bg-white/30 backdrop-blur-md rounded-full px-4 py-2 shadow-md border border-white/40 flex items-center space-x-2">
          <TrophyIcon className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">
            {isLoading ? (
              "Loading easter egg stats..."
            ) : (
              <>
                {easterEggCounter} {easterEggCounter === 1 ? "person has" : "people have"} discovered the super easter
                egg
                {hasFoundEasterEgg && " (including you!)"}
                {storageType === "memory" && <span className="text-xs ml-1 opacity-60">(preview mode)</span>}
              </>
            )}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
