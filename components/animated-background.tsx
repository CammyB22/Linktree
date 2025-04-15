"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useMood } from "@/context/mood-context"

interface AnimatedBackgroundProps {
  mousePosition: { x: number; y: number }
  deviceOrientation: { beta: number | null; gamma: number | null }
}

export default function AnimatedBackground({ mousePosition, deviceOrientation }: AnimatedBackgroundProps) {
  const { colors, animationSpeed, mood } = useMood()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Track window dimensions for responsive animations
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / dimensions.width - 0.5,
        y: e.clientY / dimensions.height - 0.5,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [dimensions])

  // Force a re-render of the background when the mood changes
  useEffect(() => {
    const updateBackground = () => {
      if (containerRef.current) {
        // Force a repaint by toggling a class
        containerRef.current.classList.add("bg-update")
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.classList.remove("bg-update")
          }
        }, 10)
      }
    }

    updateBackground()
  }, [colors])

  // Different animation variants based on mood
  const getAnimationVariants = () => {
    switch (mood) {
      case "chill":
        return {
          blob1: {
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0],
            x: mousePos.x * -30,
            y: mousePos.y * -30,
            transition: {
              scale: {
                duration: 8 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              rotate: {
                duration: 8 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
              y: { duration: 0.5 },
            },
          },
          blob2: {
            scale: [1, 1.1, 1],
            rotate: [0, -3, 0],
            x: mousePos.x * 20,
            y: mousePos.y * 20,
            transition: {
              scale: {
                duration: 10 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
                ease: "easeInOut",
              },
              rotate: {
                duration: 10 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
              y: { duration: 0.5 },
            },
          },
          blob3: {
            scale: [1, 1.08, 1],
            rotate: [0, 1, 0],
            x: mousePos.x * -15,
            y: mousePos.y * -15,
            transition: {
              scale: {
                duration: 12 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
                ease: "easeInOut",
              },
              rotate: {
                duration: 12 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
              y: { duration: 0.5 },
            },
          },
          smallBlob: {
            scale: [1, 1.15, 1],
            x: [0, 10, 0].map((val) => val + mousePos.x * 40),
            y: [0, -5, 0].map((val) => val + mousePos.y * 40),
            transition: {
              scale: {
                duration: 6 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.2,
                ease: "easeInOut",
              },
              x: {
                duration: 6 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.2,
                ease: "easeInOut",
              },
              y: {
                duration: 6 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.2,
                ease: "easeInOut",
              },
            },
          },
        }
      case "hustle":
        return {
          blob1: {
            scale: [1, 1.08, 1],
            x: [0, 15, 0].map((val) => val + mousePos.x * -30),
            y: mousePos.y * -30,
            transition: {
              scale: {
                duration: 6 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              x: {
                duration: 6 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              y: { duration: 0.5 },
            },
          },
          blob2: {
            scale: [1, 1.12, 1],
            y: [0, -10, 0].map((val) => val + mousePos.y * 20),
            x: mousePos.x * 20,
            transition: {
              scale: {
                duration: 7 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.3,
                ease: "easeInOut",
              },
              y: {
                duration: 7 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.3,
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
            },
          },
          blob3: {
            scale: [1, 1.1, 1],
            rotate: [0, 3, 0],
            x: mousePos.x * -15,
            y: mousePos.y * -15,
            transition: {
              scale: {
                duration: 8 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.7,
                ease: "easeInOut",
              },
              rotate: {
                duration: 8 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.7,
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
              y: { duration: 0.5 },
            },
          },
          smallBlob: {
            scale: [1, 1.2, 1],
            x: [0, -15, 0].map((val) => val + mousePos.x * 40),
            y: mousePos.y * 40,
            transition: {
              scale: {
                duration: 5 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.1,
                ease: "easeInOut",
              },
              x: {
                duration: 5 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.1,
                ease: "easeInOut",
              },
              y: { duration: 0.5 },
            },
          },
        }
      case "study":
        return {
          blob1: {
            scale: [1, 1.03, 1],
            y: [0, 5, 0].map((val) => val + mousePos.y * -20),
            x: mousePos.x * -20,
            transition: {
              scale: {
                duration: 10 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              y: {
                duration: 10 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
            },
          },
          blob2: {
            scale: [1, 1.05, 1],
            x: [0, -5, 0].map((val) => val + mousePos.x * 15),
            y: mousePos.y * 15,
            transition: {
              scale: {
                duration: 12 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
                ease: "easeInOut",
              },
              x: {
                duration: 12 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
                ease: "easeInOut",
              },
              y: { duration: 0.5 },
            },
          },
          blob3: {
            scale: [1, 1.04, 1],
            rotate: [0, 1, 0],
            x: mousePos.x * -10,
            y: mousePos.y * -10,
            transition: {
              scale: {
                duration: 14 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
                ease: "easeInOut",
              },
              rotate: {
                duration: 14 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
              y: { duration: 0.5 },
            },
          },
          smallBlob: {
            scale: [1, 1.08, 1],
            y: [0, -3, 0].map((val) => val + mousePos.y * 25),
            x: mousePos.x * 25,
            transition: {
              scale: {
                duration: 8 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.2,
                ease: "easeInOut",
              },
              y: {
                duration: 8 / animationSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.2,
                ease: "easeInOut",
              },
              x: { duration: 0.5 },
            },
          },
        }
      default:
        return {
          blob1: {
            scale: [1, 1.05, 1],
            transition: {
              duration: 8 / animationSpeed,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          },
          blob2: {
            scale: [1, 1.1, 1],
            transition: {
              duration: 10 / animationSpeed,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.5,
            },
          },
          blob3: {
            scale: [1, 1.08, 1],
            transition: {
              duration: 12 / animationSpeed,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1,
            },
          },
          smallBlob: {
            scale: [1, 1.15, 1],
            transition: {
              duration: 6 / animationSpeed,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.2,
            },
          },
        }
    }
  }

  const animations = getAnimationVariants()

  // Get gradient animation based on mood
  const getGradientAnimation = () => {
    switch (mood) {
      case "chill":
        return "gradientAnimationChill 15s ease infinite alternate"
      case "hustle":
        return "gradientAnimationHustle 12s ease infinite alternate"
      case "study":
        return "gradientAnimationStudy 20s ease infinite alternate"
      default:
        return "gradientAnimationChill 15s ease infinite alternate"
    }
  }

  // Get gradient colors based on mood
  const getGradientColors = () => {
    const primary =
      colors.primary === "from-blue-200"
        ? "rgba(191, 219, 254, 0.7)"
        : colors.primary === "from-orange-200"
          ? "rgba(254, 215, 170, 0.7)"
          : "rgba(167, 243, 208, 0.7)"

    const accent =
      colors.accent === "via-purple-200"
        ? "rgba(233, 213, 255, 0.7)"
        : colors.accent === "via-yellow-200"
          ? "rgba(254, 240, 138, 0.7)"
          : "rgba(110, 231, 183, 0.7)"

    const secondary =
      colors.secondary === "to-pink-200"
        ? "rgba(251, 207, 232, 0.7)"
        : colors.secondary === "to-red-200"
          ? "rgba(254, 202, 202, 0.7)"
          : "rgba(153, 246, 228, 0.7)"

    return `linear-gradient(135deg, ${primary} 0%, ${accent} 50%, ${secondary} 100%)`
  }

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Base gradient background with animation - fixed CSS properties */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: getGradientColors(),
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 0%",
          animation: getGradientAnimation(),
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), 
                      linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 20,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Blob 1 */}
      <motion.div
        className="absolute rounded-full bg-white/30 blur-3xl"
        style={{
          width: "60vw",
          height: "60vw",
          top: "10%",
          left: "20%",
        }}
        animate={animations.blob1}
      />

      {/* Blob 2 */}
      <motion.div
        className="absolute rounded-full bg-white/30 blur-3xl"
        style={{
          width: "40vw",
          height: "40vw",
          bottom: "20%",
          right: "10%",
        }}
        animate={animations.blob2}
      />

      {/* Blob 3 */}
      <motion.div
        className="absolute rounded-full bg-white/30 blur-3xl"
        style={{
          width: "50vw",
          height: "50vw",
          bottom: "0%",
          left: "0%",
        }}
        animate={animations.blob3}
      />

      {/* Additional smaller blob */}
      <motion.div
        className="absolute rounded-full bg-white/30 blur-2xl"
        style={{
          width: "25vw",
          height: "25vw",
          top: "30%",
          right: "15%",
        }}
        animate={animations.smallBlob}
      />

      {/* Light reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Subtle vignette effect */}
      <div
        className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.2) 150%)",
        }}
      />
    </div>
  )
}
