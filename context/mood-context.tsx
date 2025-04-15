"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type MoodType = "chill" | "hustle" | "study"

interface MoodContextType {
  mood: MoodType
  setMood: (mood: MoodType) => void
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  animationSpeed: number
  subtitle: string
}

const defaultContext: MoodContextType = {
  mood: "chill",
  setMood: () => {},
  colors: {
    primary: "from-blue-200",
    secondary: "to-pink-200",
    accent: "via-purple-200",
  },
  animationSpeed: 1,
  subtitle: "You chose: Chill mode 🫶",
}

const MoodContext = createContext<MoodContextType>(defaultContext)

export const useMood = () => useContext(MoodContext)

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [mood, setMood] = useState<MoodType>("chill")
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const moodSettings: Record<MoodType, Omit<MoodContextType, "mood" | "setMood">> = {
    chill: {
      colors: {
        primary: "from-blue-200",
        secondary: "to-pink-200",
        accent: "via-purple-200",
      },
      animationSpeed: 1,
      subtitle: "You chose: Chill mode 🫶",
    },
    hustle: {
      colors: {
        primary: "from-orange-200",
        secondary: "to-red-200",
        accent: "via-yellow-200",
      },
      animationSpeed: 1.5,
      subtitle: "Hustle mode activated 💪",
    },
    study: {
      colors: {
        primary: "from-green-200",
        secondary: "to-teal-200",
        accent: "via-emerald-200",
      },
      animationSpeed: 0.7,
      subtitle: "Study mode engaged 💻",
    },
  }

  // Save mood to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("campuskey-mood", mood)
    }
  }, [mood, mounted])

  // Load mood from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMood = localStorage.getItem("campuskey-mood") as MoodType | null
      if (savedMood && ["chill", "hustle", "study"].includes(savedMood)) {
        setMood(savedMood)
      }
    }
  }, [])

  return (
    <MoodContext.Provider
      value={{
        mood,
        setMood,
        ...moodSettings[mood],
      }}
    >
      {children}
    </MoodContext.Provider>
  )
}
