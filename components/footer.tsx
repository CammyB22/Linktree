"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { InstagramIcon } from "./icons/instagram-icon"
import { TikTokIcon } from "./icons/tiktok-icon"
import { FacebookIcon } from "./icons/facebook-icon"
import { YoutubeIcon } from "./icons/youtube-icon"
import { LinkedinIcon } from "./icons/linkedin-icon"
import Image from "next/image"
import EasterEggLeaderboardEntry from "./easter-egg-leaderboard-entry"

export default function Footer() {
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showSuperEasterEgg, setShowSuperEasterEgg] = useState(false)
  const [easterEggCounter, setEasterEggCounter] = useState(0)
  const [hasFoundEasterEgg, setHasFoundEasterEgg] = useState(false)
  const [showUltraEasterEgg, setShowUltraEasterEgg] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [storageType, setStorageType] = useState<string | null>(null)
  const [showLeaderboardEntry, setShowLeaderboardEntry] = useState(false)
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch the current easter egg count on component mount
  useEffect(() => {
    fetchEasterEggCount()

    // Listen for easter egg reset events from the admin page
    const handleEasterEggReset = () => {
      // Reset local state
      setHasFoundEasterEgg(false)
      setEasterEggCounter(0)

      // Clear localStorage
      localStorage.removeItem("hasFoundSuperEasterEgg")
    }

    window.addEventListener("easterEggReset", handleEasterEggReset as EventListener)

    return () => {
      window.removeEventListener("easterEggReset", handleEasterEggReset as EventListener)
    }
  }, [])

  // Function to fetch the easter egg count
  const fetchEasterEggCount = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/easter-egg")
      const data = await response.json()
      setEasterEggCounter(data.count)
      setStorageType(data.storage)

      // Check if this user has already found the easter egg
      const found = localStorage.getItem("hasFoundSuperEasterEgg") === "true"
      setHasFoundEasterEgg(found)
    } catch (error) {
      console.error("Error fetching easter egg count:", error)
      // Fallback to localStorage if API fails
      const storedCount = localStorage.getItem("superEasterEggCount") || "0"
      setEasterEggCounter(Number.parseInt(storedCount))
    } finally {
      setIsLoading(false)
    }
  }

  // Reset click count after a period of inactivity
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    }
  }, [])

  const triggerEasterEgg = () => {
    // Increment click counter and reset timeout
    setClickCount((prev) => {
      const newCount = prev + 1

      // Clear existing timeout
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
      }

      // Set new timeout to reset counter after 5 seconds of inactivity
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0)
      }, 5000)

      // Check if we've reached the easter egg thresholds
      if (newCount === 30) {
        triggerSuperEasterEgg()
        return 30 // Keep counting after super easter egg
      }

      if (newCount === 100) {
        triggerUltraEasterEgg()
        return 0 // Reset counter after ultra easter egg
      }

      return newCount
    })

    setShowEasterEgg(true)

    // Regular confetti with higher z-index
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.9 },
      zIndex: 9999, // Increased zIndex
    })

    // Hide easter egg message after 3 seconds
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }

    clickTimeoutRef.current = setTimeout(() => {
      setShowEasterEgg(false)
    }, 3000)
  }

  const triggerSuperEasterEgg = async () => {
    setShowSuperEasterEgg(true)

    // Only increment the counter if the user hasn't found it before
    if (!hasFoundEasterEgg) {
      try {
        // Update the server-side counter
        const response = await fetch("/api/easter-egg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to update easter egg counter")
        }

        const data = await response.json()

        // Update the counter with the new value from the server
        setEasterEggCounter(data.count)
        setStorageType(data.storage)
        console.log("Easter egg counter updated:", data.count, "Storage:", data.storage)

        // Save to localStorage to remember this user found it
        localStorage.setItem("hasFoundSuperEasterEgg", "true")
        setHasFoundEasterEgg(true)

        // Show the leaderboard entry popup
        setShowLeaderboardEntry(true)

        // Update the counter in the mood-toggle component as well
        window.dispatchEvent(
          new CustomEvent("easterEggFound", {
            detail: {
              count: data.count,
              storage: data.storage,
            },
          }),
        )
      } catch (error) {
        console.error("Error updating easter egg count:", error)
        // Even if the API call fails, mark as found locally
        localStorage.setItem("hasFoundSuperEasterEgg", "true")
        setHasFoundEasterEgg(true)
      }
    }

    // Create a massive fireworks display
    const duration = 8 * 1000
    const animationEnd = Date.now() + duration

    // Play multiple bursts of confetti
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        setTimeout(() => {
          setShowSuperEasterEgg(false)
          // Refresh the counter after the animation ends
          fetchEasterEggCount()
        }, 1000)
        return
      }

      // Multiple confetti bursts from different positions
      const positions = [
        { x: 0.2, y: 0.8 },
        { x: 0.5, y: 0.8 },
        { x: 0.8, y: 0.8 },
        { x: 0.3, y: 0.6 },
        { x: 0.7, y: 0.6 },
      ]

      // Launch from random positions
      const randomPosition = positions[Math.floor(Math.random() * positions.length)]

      // Fireworks effect with higher z-index
      confetti({
        particleCount: 150,
        spread: 360,
        origin: randomPosition,
        startVelocity: 30,
        gravity: 0.8,
        ticks: 300,
        colors: ["#FF9933", "#FF5733", "#4169E1", "#33A1DE", "#33DE8A", "#FF33A8", "#D433FF", "#FFDE33"],
        shapes: ["circle", "square"],
        scalar: 1.2,
        zIndex: 9999, // Increased zIndex
      })

      // Add some streamers
      if (Math.random() > 0.7) {
        confetti({
          particleCount: 80,
          angle: Math.random() * 360,
          spread: 20,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.5,
          },
          colors: ["#FFD700", "#FF00FF", "#00FFFF", "#FF4500"],
          ticks: 200,
          gravity: 0.6,
          scalar: 2,
          drift: 0,
          zIndex: 9999, // Increased zIndex
        })
      }
    }, 200)
  }

  const triggerUltraEasterEgg = () => {
    setShowUltraEasterEgg(true)

    // Play a special confetti effect with higher z-index
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6, x: 0.5 },
      colors: ["#FFFFFF", "#F5F5F5", "#EFEFEF", "#E0E0E0"],
      ticks: 300,
      gravity: 0.6,
      zIndex: 9999, // Increased zIndex
    })

    // Hide the ultra easter egg after 2 seconds
    setTimeout(() => {
      setShowUltraEasterEgg(false)
    }, 2000)
  }

  // Handle name submission for the leaderboard
  const handleNameSubmit = async (name: string) => {
    try {
      const response = await fetch("/api/easter-egg", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Failed to save name")
      }

      // Refresh the counter after adding the name
      await fetchEasterEggCount()
    } catch (error) {
      console.error("Error submitting name:", error)
      throw error
    }
  }

  return (
    <motion.footer
      className="mt-16 mb-8 text-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="mb-4">
        <motion.div
          className="inline-block px-6 py-2 bg-white/30 backdrop-blur-md rounded-full shadow-md border border-white/40 cursor-pointer"
          onClick={triggerEasterEgg}
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
        >
          <p className="text-gray-700 text-sm">
            Built by CampusKey{" "}
            {clickCount > 0 && clickCount < 100 && <span className="opacity-20 text-xs">({clickCount})</span>}
          </p>
        </motion.div>

        <AnimatePresence>
          {showEasterEgg && !showSuperEasterEgg && (
            <motion.div
              className="bg-white/40 backdrop-blur-md rounded-lg p-3 shadow-lg absolute left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p className="text-sm">Powered by coffee + clean sheets ☕🛏️</p>
            </motion.div>
          )}

          {showSuperEasterEgg && (
            <motion.div
              className="bg-white/40 backdrop-blur-md rounded-lg p-4 shadow-lg absolute left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 z-50 border border-white/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="text-base font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                🎉 SUPER EASTER EGG UNLOCKED! 🎉
              </p>
              <p className="text-sm mt-1">You found the secret! Amazing!</p>
              {!hasFoundEasterEgg && (
                <motion.p
                  className="text-xs mt-2 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  You're student #{easterEggCounter} to discover this!
                  {storageType === "memory" && <span className="opacity-60"> (preview mode)</span>}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ultra Easter Egg - Cam Cartoon Image with Speech Bubble */}
      <AnimatePresence>
        {showUltraEasterEgg && (
          <motion.div
            className="fixed bottom-0 left-0 w-full z-[9000] pointer-events-none"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 65,
              damping: 20,
              mass: 1.2,
            }}
          >
            <div className="container mx-auto px-4">
              <div className="relative w-64 h-80 ml-4 md:ml-12">
                {/* Using the new image with a key to force re-render */}
                <Image
                  src="/images/cam-cartoon.png"
                  alt="Cam"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  key="cam-cartoon-image"
                />

                {/* Speech bubble */}
                <motion.div
                  className="absolute top-0 right-[-80px] transform -translate-y-12 bg-white rounded-xl px-4 py-2 shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="relative">
                    <p className="font-bold text-gray-800">You found me!</p>
                    {/* Speech bubble tail */}
                    <div className="absolute bottom-0 left-4 transform translate-y-full w-4 h-4 overflow-hidden">
                      <div className="absolute top-0 left-0 w-4 h-4 bg-white rotate-45 transform origin-top-left"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Entry Popup */}
      <AnimatePresence>
        {showLeaderboardEntry && (
          <EasterEggLeaderboardEntry
            position={easterEggCounter}
            onClose={() => setShowLeaderboardEntry(false)}
            onSubmit={handleNameSubmit}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-center space-x-4 flex-wrap">
        <motion.a
          href="https://www.tiktok.com/@campuskey"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{
            scale: 1.2,
            rotate: 5,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          whileTap={{
            scale: 0.9,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          }}
          className="bg-white/30 backdrop-blur-md p-3 rounded-full shadow-md border border-white/40 text-gray-700 hover:text-gray-900 mb-2"
        >
          <TikTokIcon className="w-5 h-5" />
          <span className="sr-only">TikTok</span>
        </motion.a>
        <motion.a
          href="https://www.instagram.com/campuskey/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{
            scale: 1.2,
            rotate: -5,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          whileTap={{
            scale: 0.9,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          }}
          className="bg-white/30 backdrop-blur-md p-3 rounded-full shadow-md border border-white/40 text-gray-700 hover:text-gray-900 mb-2"
        >
          <InstagramIcon className="w-5 h-5" />
          <span className="sr-only">Instagram</span>
        </motion.a>
        <motion.a
          href="https://www.youtube.com/@campuskeystudentliving9374"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{
            scale: 1.2,
            rotate: 5,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          whileTap={{
            scale: 0.9,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          }}
          className="bg-white/30 backdrop-blur-md p-3 rounded-full shadow-md border border-white/40 text-gray-700 hover:text-gray-900 mb-2"
        >
          <YoutubeIcon className="w-5 h-5" />
          <span className="sr-only">YouTube</span>
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/company/campuskey-student-living"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{
            scale: 1.2,
            rotate: -5,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          whileTap={{
            scale: 0.9,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          }}
          className="bg-white/30 backdrop-blur-md p-3 rounded-full shadow-md border border-white/40 text-gray-700 hover:text-gray-900 mb-2"
        >
          <LinkedinIcon className="w-5 h-5" />
          <span className="sr-only">LinkedIn</span>
        </motion.a>
        <motion.a
          href="https://www.facebook.com/campuskey"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{
            scale: 1.2,
            rotate: 5,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          whileTap={{
            scale: 0.9,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          }}
          className="bg-white/30 backdrop-blur-md p-3 rounded-full shadow-md border border-white/40 text-gray-700 hover:text-gray-900 mb-2"
        >
          <FacebookIcon className="w-5 h-5" />
          <span className="sr-only">Facebook</span>
        </motion.a>
      </div>
    </motion.footer>
  )
}
