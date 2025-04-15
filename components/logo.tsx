"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export default function Logo() {
  const [easterEggActive, setEasterEggActive] = useState(false)

  const triggerEasterEgg = () => {
    setEasterEggActive(true)

    // Create a more elaborate fireworks effect
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 } // Increased zIndex

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        setTimeout(() => setEasterEggActive(false), 500)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      // Launch fireworks from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FF9933", "#FF5733", "#4169E1", "#33A1DE", "#33DE8A"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FF9933", "#FF5733", "#4169E1", "#33A1DE", "#33DE8A"],
      })
    }, 250)
  }

  return (
    <div className="relative">
      <motion.div
        className="flex justify-center mb-6 cursor-pointer mx-auto max-w-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={triggerEasterEgg}
      >
        <Image
          src="/images/logo.png"
          alt="CampusKey Student Living"
          width={185}
          height={74}
          priority
          className="h-auto w-full"
        />
      </motion.div>

      <AnimatePresence>
        {easterEggActive && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/40 backdrop-blur-md rounded-lg p-3 shadow-lg z-50 border border-white/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-medium">✨ Welcome to the vibe ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
