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
    "Rise and shine 🌞",
    "Good vibes only today",
    "You're glowing, btw ✨",
    "Early bird wins again 🐦",
    "Hey superstar, morning!",
    "Fuel up, legend ☕️",
    "Sun's up, so are we",
    "Chase it down today 🚀",
    "Mood: Main character ☀️",
    "Big day energy 💼",
    "Vibes are immaculate",
    "Made for mornings like this",
    "Winning starts now 💪",
    "Shine bright today 💎",
    "Your future self says thanks",
    "Let's gooo 🌀",
    "Grind mode: activated",
    "Nothing but power moves",
    "Woke up flawless 😎",
    "Hustle > snooze",
    "Coffee? Check. Confidence? Check.",
    "The sun's jealous of your glow",
    "Good morning, icon",
    "Magic starts now ✨",
    "No one's doing it like you",
    "Hi bestie ☀️",
    "You're giving radiant",
    "Ready to conquer?",
    "Sunrise squad ☕️",
    "Go time 🔥",
    "Keep shining, star",
    "Ambition looks good on you",
    "Run the day 👟",
    "Power breakfast vibes",
    "Slay the schedule",
    "Up & unstoppable",
    "You make mornings better",
    "The world's lucky to have you",
    "Fresh start, full heart",
    "CampusKey mode: ON",
  ],
  [TIME_BLOCKS.AFTERNOON]: [
    "You're on fire 🔥",
    "Crushing it today?",
    "Lunch break legend 🍔",
    "Midday glow up 💫",
    "CEO in the making",
    "Keep the momentum",
    "Halfway to world domination",
    "Big energy hours",
    "Still killing it 💅",
    "Slay o'clock",
    "You ate and left no crumbs",
    "Major moves happening",
    "Glowing into the afternoon",
    "CampusKey vibes only",
    "Look at you go 💨",
    "Absolutely thriving",
    "No one's matching your vibe rn",
    "You're built different",
    "Making success look easy",
    "Stay golden ☀️",
    "The grind looks good on you",
    "Booked, busy, & blessed",
    "High score hours 🎮",
    "Mood: Unbothered",
    "That 3PM sparkle ✨",
    "Breaking records yet?",
    "Slayful and powerful",
    "Never average",
    "Lunch and leadership 🍱",
    "Main character moment",
    "Shining mid-shift",
    "You're giving 'it' energy",
    "Cruising toward greatness",
    "Vibes immaculate",
    "Workin' it",
    "In your peak era",
    "Certified slayer",
    "Leading with style",
    "Still rising, still winning",
    "CampusKey excellence",
  ],
  [TIME_BLOCKS.EVENING]: [
    "Evening glow ✨",
    "Golden hour energy",
    "Sunset vibes, unmatched",
    "Still a vibe 💫",
    "Magic hour = you",
    "Wind down like a boss",
    "Rest is productive",
    "Legend in lounge mode",
    "Grateful & glowing",
    "End the day strong 💪",
    "Serotonin status: full",
    "Romanticize your evening",
    "You made it through ✨",
    "Recharge in style",
    "Main character after hours",
    "Time to shine, softly",
    "CampusKey chill hours",
    "You did amazing today",
    "Breathe in the win 🧘",
    "Peace & power",
    "Evening with excellence",
    "Golden like your aura",
    "You're glowing different",
    "Casual flex hour",
    "Cozy, but iconic",
    "Slippers on, stress off",
    "Gold standard evening",
    "Look how far you came",
    "Nothing can dim this light",
    "Still stunning",
    "Wind-down, boss mode",
    "You deserve a vibe",
    "Time to reflect and glow",
    "Today = crushed",
    "Feeling thankful, feeling powerful",
    "Soft life, strong soul",
    "Moon's out, you're shining",
    "You did the thing 💥",
    "Nightfall flex 🌇",
    "Still CampusKey core",
  ],
  [TIME_BLOCKS.NIGHT]: [
    "Midnight magic ✨",
    "Late night legend 🌙",
    "Dream big, bestie",
    "Stars are watching you shine",
    "You're the night vibe",
    "CampusKey after dark",
    "Recharge, then conquer",
    "Even your dreams are iconic",
    "Glow in the moonlight",
    "Unwind like royalty",
    "Night shift slay",
    "Stargazing superstar",
    "Manifesting big things",
    "Rest. Reset. Rule.",
    "You did enough today",
    "So proud of you 💖",
    "Dark mode = activated",
    "Unreal glow rn",
    "Chill mode: maximum",
    "Still giving greatness",
    "Universe is vibing with you",
    "Cozy and in control",
    "Your energy >>>",
    "Made for midnight",
    "Peaceful power 🌌",
    "Lights low, standards high",
    "Nightcap flex",
    "Dream zone loading",
    "Still unstoppable",
    "Catch those dreams 💤",
    "Grateful + grounded",
    "Soft power unlocked",
    "Lullabies and legacies",
    "Moonlight mindset",
    "Sleep like royalty",
    "Your aura's glowing",
    "Goodnight, icon",
    "Tomorrow is yours",
    "Stars align for you",
    "CampusKey dreams await",
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
        <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1.5 border border-white/40">
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
            <p className="text-xl md:text-2xl text-gray-700 font-medium">{tagline}</p>
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
