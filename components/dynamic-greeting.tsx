"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMood } from "@/context/mood-context"

// Time block definitions
const TIME_BLOCKS = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
  EVENING: "evening",
  NIGHT: "night",
}

// Comprehensive greeting lists by time block
const GREETINGS = {
  [TIME_BLOCKS.MORNING]: [
    "Good morning, sunshine ☀️",
    "Morning, legend!",
    "Hey there, early bird 🐦",
    "Wakey wakey, starlight ✨",
    "Top of the morning to you",
    "Hi bestie, it's a new day 💖",
    "Good morning, superstar!",
    "Hey, rise and vibe ☕️",
    "Yo! You made the sunrise better",
    "Bonjour 🌞",
    "Hi hi! It's a CampusKey kind of day",
    "Morning glow incoming ✨",
    "Peaceful morning to you",
    "Hello, you brilliant bean",
    "Hey there, golden soul",
    "Hi there! Ready to shine?",
    "New day, who dis?",
    "Good morning, magic maker",
    "Happy morning! You look radiant",
    "Hey sunshine! ☀️",
    "Hi there, bright light",
    "Good vibes this morning?",
    "Mornin'! Let's get this bread 🍞",
    "Hi there — coffee or tea today?",
    "Rise & grind, friend",
    "Hey, sleepy star 🌟",
    "Wassup, early riser?",
    "Good morning, CampusKey style",
    "Hi friend, happy morning",
    "What's up, trailblazer?",
    "Hola! New day, new energy",
    "Morning bestie 💛",
    "Hi there, genius",
    "Yo! Morning flex mode",
    "Hello, bright mind 🧠",
    "Hey! You're up early",
    "Happy morning, big dreamer",
    "Hello, it's your day",
    "Good morning — let's gooo",
    "What's poppin' this morning?",
  ],
  [TIME_BLOCKS.AFTERNOON]: [
    "Good afternoon, superstar",
    "Hey there, still crushing it?",
    "Hi again, champ 💪",
    "Hello! You're glowing 🌟",
    "Afternoon vibes, hello!",
    "Hey hey! Look at you go",
    "What's up, trailblazer?",
    "Yo! Lunch break check-in 🍔",
    "Good day, sunshine",
    "Hi again, legend",
    "Wassup this fine afternoon?",
    "Hey friend, still thriving?",
    "Hey bestie ☀️",
    "Hi there, how's the vibe?",
    "Good afternoon, icon",
    "What's good this afternoon?",
    "Hello, you radiant soul",
    "Hey hey — still in boss mode?",
    "Yo! Afternoon hustle strong 💼",
    "Hi bestie, you look unstoppable",
    "Hey friend! Back at it?",
    "Howdy, high achiever",
    "Hola! Still glowing?",
    "Hi! Let's keep this energy",
    "Good afternoon, powerhouse",
    "Hey, top performer!",
    "Yo! Afternoon MVP",
    "Hey there, bold one",
    "What's up, genius?",
    "Afternoon check-in, superstar 💬",
    "Hi hi! Keep shining ✨",
    "Sup, productivity beast?",
    "Hello again, big brain 🧠",
    "Hi there — vibes on point?",
    "Hey, afternoon hero",
    "What's poppin' at 2PM?",
    "Good afternoon, boss",
    "Hey hey, back for more?",
    "Yo! Midday magic moment",
    "Hi friend — you rock",
  ],
  [TIME_BLOCKS.EVENING]: [
    "Good evening, stunner ✨",
    "Hey there, golden hour glow 🌇",
    "Hi friend, winding down?",
    "Hello again, champion",
    "Evening vibes, hello!",
    "Hey bestie, soft flex mode?",
    "Hi there — still fabulous",
    "What's up, golden soul?",
    "Good evening, CampusKey style",
    "Hey hey! You did amazing today",
    "Yo! Evening sparkle activated",
    "Hi bestie, feeling grateful?",
    "Evening greetings, legend",
    "Hola! It's cozy time 💫",
    "Hello, sunset soul",
    "Hi hi — still on fire?",
    "Evening mode: you 🧘‍♀️",
    "Hey, starlight 💛",
    "Hey there, just glowing",
    "Yo! Moon's rising, you too?",
    "Good evening, friend",
    "Sup, radiant human?",
    "Hi there — what a day!",
    "Golden hour, golden you",
    "Hi again, brilliant mind",
    "Evening check-in, bestie",
    "Hello! You crushed today",
    "Peaceful evening to you",
    "Hey hey — you're still shining",
    "Hello, mellow hero",
    "Hey, calm & collected vibes?",
    "Evening magic, what's good?",
    "Hi bestie, well done today",
    "Evening looks good on you",
    "What's up, sunset soul?",
    "Yo! Done & dusted!",
    "Hey again, you powerful being",
    "Good evening, chill queen 👑",
    "Hi hi! Evening glow hits different",
    "Evening, with excellence ✨",
  ],
  [TIME_BLOCKS.NIGHT]: [
    "Good night, dreamer 🌙",
    "Hey there, night owl 🦉",
    "Hi bestie, you did great today",
    "Hello, starlight",
    "Wassup, sleepy legend?",
    "Night vibes, hello ✨",
    "Hey hey — time to rest?",
    "Yo! Late night glow check",
    "Hi there, peaceful soul",
    "Evening's finest, hey you",
    "Hi bestie, lights low vibes",
    "Hey! You deserve deep rest",
    "Hello, sweet star 🌠",
    "What's up, calm queen?",
    "Goodnight, icon",
    "Hola, moon child 🌝",
    "Hey friend, cozy time?",
    "Hey hey — made it through!",
    "Hi there, CampusKey core 🌌",
    "Yo! Sweet dreams incoming",
    "Evening greetings, soft edition",
    "Hello! In your nighttime era",
    "Hey there, dream machine",
    "Night mode: you 💤",
    "Peace and power, hi!",
    "Hi hi — wind-down champion",
    "Hey you, time to float 🌊",
    "Late night check-in 💫",
    "Yo, grateful to see you here",
    "Night shift superstar, hi!",
    "Hello, bedtime boss",
    "What's good, moonlight being?",
    "Hi again — day's done well",
    "Soft glow, strong soul — hi!",
    "Rest mode: engaged",
    "Hey, one last flex today",
    "Hi there, kind spirit",
    "Peace out, you did amazing",
    "Nighttime legends say hi 🌟",
  ],
}

// Taglines that appear below the greeting
const TAGLINES = [
  "Your digital doorway to campus life",
  "Everything you need, one tap away",
  "Curated campus connections",
  "Links that elevate your student life",
  "Your CampusKey world, simplified",
  "Campus life, streamlined",
  "All your essentials in one place",
  "Tap into campus convenience",
  "Student living, simplified",
  "Your campus, connected",
]

export default function DynamicGreeting() {
  const [greeting, setGreeting] = useState("")
  const [tagline, setTagline] = useState("")
  const [timeBlock, setTimeBlock] = useState("")
  const { subtitle, mood } = useMood()
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Determine time block and set greeting on component mount
    updateGreeting()

    // Also set a random tagline
    setTagline(getRandomItem(TAGLINES))
  }, [])

  // Get current time block based on hour
  const getCurrentTimeBlock = () => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      return TIME_BLOCKS.MORNING
    } else if (hour >= 12 && hour < 17) {
      return TIME_BLOCKS.AFTERNOON
    } else if (hour >= 17 && hour < 21) {
      return TIME_BLOCKS.EVENING
    } else {
      return TIME_BLOCKS.NIGHT
    }
  }

  // Get a random item from an array
  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Update greeting based on current time
  const updateGreeting = () => {
    setIsRefreshing(true)

    const currentTimeBlock = getCurrentTimeBlock()
    setTimeBlock(currentTimeBlock)

    // Get random greeting from appropriate time block
    const greetingsList = GREETINGS[currentTimeBlock]
    const newGreeting = getRandomItem(greetingsList)

    // Small delay for animation effect
    setTimeout(() => {
      setGreeting(newGreeting)
      setIsRefreshing(false)
    }, 300)
  }

  // Get time-specific emoji
  const getTimeEmoji = () => {
    switch (timeBlock) {
      case TIME_BLOCKS.MORNING:
        return "☀️"
      case TIME_BLOCKS.AFTERNOON:
        return "🌤️"
      case TIME_BLOCKS.EVENING:
        return "🌇"
      case TIME_BLOCKS.NIGHT:
        return "🌙"
      default:
        return "✨"
    }
  }

  // Get background styles based on time block and mood
  const getBackgroundStyles = () => {
    // Base colors for each time block
    const timeColors = {
      [TIME_BLOCKS.MORNING]: {
        primary: "rgba(254, 240, 138, 0.2)",
        secondary: "rgba(147, 197, 253, 0.2)",
        accent: "rgba(254, 215, 170, 0.1)",
      },
      [TIME_BLOCKS.AFTERNOON]: {
        primary: "rgba(147, 197, 253, 0.2)",
        secondary: "rgba(196, 181, 253, 0.2)",
        accent: "rgba(167, 243, 208, 0.1)",
      },
      [TIME_BLOCKS.EVENING]: {
        primary: "rgba(251, 207, 232, 0.2)",
        secondary: "rgba(196, 181, 253, 0.2)",
        accent: "rgba(254, 215, 170, 0.1)",
      },
      [TIME_BLOCKS.NIGHT]: {
        primary: "rgba(165, 180, 252, 0.2)",
        secondary: "rgba(196, 181, 253, 0.2)",
        accent: "rgba(147, 197, 253, 0.1)",
      },
    }

    // Mood intensity modifiers
    const moodIntensity = {
      chill: 1,
      hustle: 1.2,
      study: 0.8,
    }

    const colors = timeColors[timeBlock] || timeColors[TIME_BLOCKS.MORNING]
    const intensity = moodIntensity[mood] || 1

    // Adjust color intensity based on mood
    const adjustColor = (color, factor) => {
      const opacity = Number.parseFloat(color.split(", ")[1].slice(0, -1)) * factor
      return color.replace(/[\d.]+\)$/, `${Math.min(opacity, 0.5)})`)
    }

    return {
      background: `linear-gradient(135deg, 
        ${adjustColor(colors.primary, intensity)} 0%, 
        ${adjustColor(colors.secondary, intensity)} 50%, 
        ${adjustColor(colors.accent, intensity)} 100%)`,
      boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.1), 
                  0 4px 8px 0 rgba(31, 38, 135, 0.05),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.4)`,
    }
  }

  return (
    <motion.div
      className="relative mb-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Main card */}
      <div className="rounded-2xl backdrop-blur-md p-5 md:p-8 relative overflow-hidden" style={getBackgroundStyles()}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

        {/* Time indicator */}
        <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1.5 border border-white/40 hidden md:flex">
          <span>{getTimeEmoji()}</span>
          <span className="capitalize">{timeBlock}</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <div className="min-h-[90px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isRefreshing && (
                <motion.h1
                  key={greeting}
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 text-center leading-tight tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {greeting}
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          {/* Tagline */}
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xl md:text-2xl text-gray-700 font-medium">CampusKey life, streamlined!</p>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-lg text-gray-600">{subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/20 backdrop-blur-md rounded-full"></div>
    </motion.div>
  )
}
