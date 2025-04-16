"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Trophy, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  name: string
  position: number
}

interface LeaderboardModalProps {
  onClose: () => void
}

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storageType, setStorageType] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/easter-egg")

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard")
        }

        const data = await response.json()

        // Sort by position (lowest first)
        const sortedLeaderboard = [...(data.leaderboard || [])].sort((a, b) => a.position - b.position)

        setLeaderboard(sortedLeaderboard)
        setStorageType(data.storage)
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("Failed to load the leaderboard. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Get medal for top positions
  const getMedal = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />
      default:
        return <Award className="w-5 h-5 text-purple-400" />
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              DISCOVERY BOARD
            </span>
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-purple-300 font-mono">NO DISCOVERIES YET</p>
              <p className="text-gray-300 mt-2">Be the first to find the easter egg!</p>
            </div>
          ) : (
            <div>
              {/* Fixed header */}
              <div className="grid grid-cols-12 gap-2 text-gray-300 text-sm font-bold mb-2 px-2 border-b border-gray-700 pb-2 sticky top-0 bg-gray-900/90">
                <div className="col-span-2">RANK</div>
                <div className="col-span-3">FOUND</div>
                <div className="col-span-7">PLAYER</div>
              </div>
              
              {/* Scrollable entries */}
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {leaderboard.map((entry, index) => {
                  // Calculate the display position (index + 1)
                  const displayPosition = index + 1

                  return (
                    <motion.div
                      key={`${entry.position}-${entry.name}`}
                      className={`grid grid-cols-12 gap-2 p-2 rounded ${
                        index % 2 === 0 ? "bg-purple-900/30" : "bg-purple-900/10"
                      } ${index < 3 ? "border-l-4" : ""} ${
                        index === 0
                          ? "border-yellow-400"
                          : index === 1
                            ? "border-gray-300"
                            : index === 2
                              ? "border-amber-700"
                              : ""
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="col-span-2 font-mono text-white flex items-center">{getMedal(displayPosition)}</div>
                      <div className="col-span-3 font-mono text-green-400">
                        {displayPosition}
                        <sup>{getOrdinalSuffix(displayPosition)}</sup>
                      </div>
                      <div className="col-span-7 font-mono text-white">{entry.name}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {storageType === "memory" && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Preview mode: Discoveries will reset when the server restarts
          </p>
        )}

        <div className="text-center text-xs text-gray-300 mt-4">Find the easter egg to add your initials!</div>
      </motion.div>
    </motion.div>
  \
  ;<style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(75, 85, 99, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.5);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.7);
      }
    `}</style>
  )
}
