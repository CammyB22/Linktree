"use client"

import type React from "react"
import Link from "next/link"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useMood } from "@/context/mood-context"
import { useEffect, useState, useRef } from "react"
import { track } from "@vercel/analytics"
import { useCountdown } from "@/hooks/use-countdown"

interface LinkCardProps {
  link: {
    id: string
    title: string
    url: string
    description: string
    icon: string
    comingSoon?: boolean
  }
  index: number
}

const CountdownDisplay = ({
  days,
  hours,
  minutes,
  seconds,
}: { days: number; hours: number; minutes: number; seconds: number }) => (
  <div className="w-full text-center">
    <p className="text-sm text-purple-700 mb-3 font-bold">⏰ Rebooking Unlocks In</p>
    <div className="flex justify-center items-center space-x-1.5 sm:space-x-2 text-gray-800 font-mono">
      <div className="flex flex-col items-center p-2 bg-gradient-to-br from-purple-200/80 to-pink-200/80 backdrop-blur-sm rounded-lg min-w-[45px] sm:min-w-[55px] border border-white/50 shadow-md">
        <span className="text-xl sm:text-2xl font-bold text-purple-800">{String(days).padStart(2, "0")}</span>
        <span className="text-xs opacity-70 text-purple-600 font-semibold">DAYS</span>
      </div>
      <div className="text-xl font-bold text-purple-600">:</div>
      <div className="flex flex-col items-center p-2 bg-gradient-to-br from-purple-200/80 to-pink-200/80 backdrop-blur-sm rounded-lg min-w-[45px] sm:min-w-[55px] border border-white/50 shadow-md">
        <span className="text-xl sm:text-2xl font-bold text-purple-800">{String(hours).padStart(2, "0")}</span>
        <span className="text-xs opacity-70 text-purple-600 font-semibold">HRS</span>
      </div>
      <div className="text-xl font-bold text-purple-600">:</div>
      <div className="flex flex-col items-center p-2 bg-gradient-to-br from-purple-200/80 to-pink-200/80 backdrop-blur-sm rounded-lg min-w-[45px] sm:min-w-[55px] border border-white/50 shadow-md">
        <span className="text-xl sm:text-2xl font-bold text-purple-800">{String(minutes).padStart(2, "0")}</span>
        <span className="text-xs opacity-70 text-purple-600 font-semibold">MIN</span>
      </div>
      <div className="text-xl font-bold text-purple-600">:</div>
      <div className="flex flex-col items-center p-2 bg-gradient-to-br from-purple-200/80 to-pink-200/80 backdrop-blur-sm rounded-lg min-w-[45px] sm:min-w-[55px] border border-white/50 shadow-md">
        <span className="text-xl sm:text-2xl font-bold text-purple-800">{String(seconds).padStart(2, "0")}</span>
        <span className="text-xs opacity-70 text-purple-600 font-semibold">SEC</span>
      </div>
    </div>
  </div>
)

export default function LinkCard({ link, index }: LinkCardProps) {
  const { animationSpeed, mood } = useMood()
  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isRebookersCard = link.id === "rebookers"

  // VIP rebooking period ends at midnight on September 3rd, 2025
  const vipEndDate = "2025-09-04T00:00:00" // Midnight = start of Sept 4th
  const vipCountdown = useCountdown(vipEndDate)
  const isVipPeriodActive = !vipCountdown?.isFinished

  const isPublicApplicationsCard = link.id === "public-applications"
  const publicAppsTargetDate = "2025-09-04T08:00:00"
  const publicAppsCountdown = useCountdown(publicAppsTargetDate)
  const isPublicAppsCountdownFinished = publicAppsCountdown?.isFinished ?? true

  // Mouse position values for 3D effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Transform mouse position into rotation values
  const rotateX = useTransform(y, [-100, 100], [5, -5])
  const rotateY = useTransform(x, [-100, 100], [-5, 5])

  // Handle mouse move for 3D effect
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  // Set mounted state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle link click with analytics tracking
  const handleLinkClick = () => {
    // Track the click event for analytics
    track("link_click", {
      linkId: link.id,
      linkTitle: link.title,
      linkUrl: link.url,
    })
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5 / animationSpeed,
      },
    },
  }

  // Icon animation variants - more dynamic now
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: link.icon === "🔄" ? 360 : 0,
      transition: {
        scale: { duration: 0.3 },
        rotate: {
          duration: 2,
          ease: "linear",
          repeat: link.icon === "🔄" ? Number.POSITIVE_INFINITY : 0,
        },
      },
    },
  }

  // Enhanced shadow for hover state
  const getHoverShadow = () => {
    switch (mood) {
      case "chill":
        return "0 10px 25px rgba(147, 197, 253, 0.4)"
      case "hustle":
        return "0 10px 25px rgba(253, 186, 116, 0.4)"
      case "study":
        return "0 10px 25px rgba(110, 231, 183, 0.4)"
      default:
        return "0 10px 25px rgba(147, 197, 253, 0.4)"
    }
  }

  // If it's the public applications card and the countdown is NOT finished, render the timer card.
  if (isPublicApplicationsCard && !isPublicAppsCountdownFinished) {
    return (
      <motion.div className="block" variants={item}>
        <div className="relative rounded-xl p-0.5 bg-gradient-to-r from-blue-400/60 to-green-400/60">
          <motion.div
            ref={cardRef}
            className="relative bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 hover:shadow-xl transition-all overflow-hidden shadow-lg"
            style={{
              rotateX,
              rotateY,
              boxShadow: isHovered ? "0 10px 25px rgba(59, 130, 246, 0.3)" : "0 8px 15px rgba(0, 0, 0, 0.1)",
            }}
            whileHover={{
              scale: 1.03,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Subtle animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.1))",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Subtle shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0"
              animate={isHovered ? { opacity: 0.5, left: ["100%", "-100%"] } : { opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            <motion.div className="flex items-start relative z-10">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl bg-gradient-to-br from-blue-100/80 to-green-100/80 backdrop-blur-sm rounded-full mr-3 sm:mr-4 overflow-hidden shadow-inner border border-blue-200/50 flex-shrink-0"
                whileHover="hover"
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                variants={iconVariants}
              >
                <span>{link.icon}</span>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base sm:text-lg mb-1 text-gray-800">Public Applications</h3>

                {/* Date display card */}
                <div className="bg-gradient-to-r from-blue-50/80 to-green-50/80 backdrop-blur-sm rounded-lg p-2 border border-blue-200/50 mb-3 shadow-sm">
                  <p className="text-xs text-blue-700 font-medium text-center">📅 Opens: September 4th, 2025</p>
                </div>

                {/* Countdown section with individual cards - Mobile optimized */}
                <div className="bg-gradient-to-r from-blue-50/60 to-green-50/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-blue-200/40">
                  <p className="text-xs text-blue-700 mb-2 sm:mb-3 font-medium text-center">⏰ Opens In</p>
                  <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                    {/* Days card */}
                    <div className="bg-gradient-to-br from-blue-100/90 to-green-100/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border border-blue-200/60 shadow-sm min-w-[35px] sm:min-w-[40px]">
                      <div className="text-center">
                        <div className="text-sm sm:text-lg font-bold text-blue-800">
                          {String(publicAppsCountdown.days).padStart(2, "0")}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-blue-600 font-semibold">DAYS</div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-blue-600">:</div>
                    {/* Hours card */}
                    <div className="bg-gradient-to-br from-blue-100/90 to-green-100/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border border-blue-200/60 shadow-sm min-w-[35px] sm:min-w-[40px]">
                      <div className="text-center">
                        <div className="text-sm sm:text-lg font-bold text-blue-800">
                          {String(publicAppsCountdown.hours).padStart(2, "0")}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-blue-600 font-semibold">HRS</div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-blue-600">:</div>
                    {/* Minutes card */}
                    <div className="bg-gradient-to-br from-blue-100/90 to-green-100/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border border-blue-200/60 shadow-sm min-w-[35px] sm:min-w-[40px]">
                      <div className="text-center">
                        <div className="text-sm sm:text-lg font-bold text-blue-800">
                          {String(publicAppsCountdown.minutes).padStart(2, "0")}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-blue-600 font-semibold">MIN</div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-blue-600">:</div>
                    {/* Seconds card */}
                    <div className="bg-gradient-to-br from-blue-100/90 to-green-100/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border border-blue-200/60 shadow-sm min-w-[35px] sm:min-w-[40px]">
                      <div className="text-center">
                        <div className="text-sm sm:text-lg font-bold text-blue-800">
                          {String(publicAppsCountdown.seconds).padStart(2, "0")}
                        </div>
                        <div className="text-[8px] sm:text-[10px] text-blue-600 font-semibold">SEC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Special handling for Rebookers card - clean and elegant
  if (isRebookersCard) {
    return (
      <Link href="https://campuskey.modus10.co.za/login" passHref legacyBehavior={false}>
        <motion.div
          className="block"
          variants={item}
          whileTap={{
            scale: 0.97,
            transition: { duration: 0.2 / animationSpeed },
          }}
          onClick={handleLinkClick}
        >
          <motion.div
            ref={cardRef}
            className="relative bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/40 hover:shadow-xl transition-all overflow-hidden shadow-lg"
            style={{
              rotateX,
              rotateY,
              boxShadow: isHovered ? "0 15px 30px rgba(168, 85, 247, 0.2)" : "0 8px 15px rgba(0, 0, 0, 0.1)",
            }}
            whileHover={{
              scale: 1.03,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Subtle shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0"
              animate={isHovered ? { opacity: 0.5, left: ["100%", "-100%"] } : { opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Subtle accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-purple-400/60 rounded-t-xl"></div>

            <motion.div className="flex items-center relative z-10">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl bg-white/50 backdrop-blur-sm rounded-full mr-3 sm:mr-4 overflow-hidden shadow-inner border border-white/50"
                whileHover="hover"
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                variants={iconVariants}
              >
                <span>{link.icon}</span>
              </motion.div>
              <div className="flex-1">
                <h3 className="font-medium text-base sm:text-lg mb-1 text-gray-800">Rebook for 2026</h3>
                <p className="text-sm text-gray-600 mb-3">Secure your spot for next year 🏠</p>

                {/* Clean status indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-700 font-medium">Now open</span>
                  {isVipPeriodActive && (
                    <>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-orange-600">
                        VIP period: {vipCountdown.days}d {vipCountdown.hours}h left
                      </span>
                    </>
                  )}
                </div>

                {/* Simple CTA */}
                <div className="text-xs text-purple-600 font-medium">→ Click to secure your spot</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Link>
    )
  }

  // For all other cases (other cards, or rebookers card after countdown finishes):
  const finalLink = isPublicApplicationsCard ? { ...link, description: "Applications are now open! 🎉" } : link

  // If it's a coming soon card (and not the rebookers card, which is handled above)
  if (finalLink.comingSoon) {
    return (
      <motion.div className="block" variants={item}>
        <motion.div
          ref={cardRef}
          className="relative bg-white/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/40 shadow-lg"
          style={{
            rotateX,
            rotateY,
            boxShadow: isHovered ? getHoverShadow() : "0 8px 15px rgba(0, 0, 0, 0.1)",
          }}
          whileHover={{
            scale: 1.03,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-center py-3 font-bold z-20 shadow-sm"
            initial={{ opacity: 0.9 }}
            animate={{
              opacity: [0.9, 1, 0.9],
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            Coming Soon
          </motion.div>
          <div className="p-5">
            <motion.div className="flex items-center relative z-10">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl bg-white/50 backdrop-blur-sm rounded-full mr-3 sm:mr-4 overflow-hidden shadow-inner border border-white/50"
                whileHover="hover"
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                variants={iconVariants}
              >
                <span>{finalLink.icon}</span>
              </motion.div>
              <div>
                <h3 className="font-medium text-base sm:text-lg">{finalLink.title}</h3>
                <p className="text-sm text-gray-600">{finalLink.description}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Regular clickable card
  const cardClasses =
    "relative bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/40 hover:shadow-xl transition-all overflow-hidden shadow-lg"

  return (
    <Link href={finalLink.url} passHref legacyBehavior={false}>
      <motion.div
        className="block"
        variants={item}
        whileTap={{
          scale: 0.97,
          transition: { duration: 0.2 / animationSpeed },
        }}
        onClick={handleLinkClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          boxShadow: isHovered ? getHoverShadow() : "0 8px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.div
          className={cardClasses}
          whileHover={{
            scale: 1.03,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0"
            animate={isHovered ? { opacity: 0.5, left: ["100%", "-100%"] } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.div className="flex items-center relative z-10">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl bg-white/50 backdrop-blur-sm rounded-full mr-3 sm:mr-4 overflow-hidden shadow-inner border border-white/50"
              whileHover="hover"
              initial="initial"
              animate={isHovered ? "hover" : "initial"}
              variants={iconVariants}
            >
              <span>{finalLink.icon}</span>
            </motion.div>
            <div>
              <h3 className="font-medium text-base sm:text-lg">{finalLink.title}</h3>
              <p className="text-sm text-gray-600">{finalLink.description}</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  )
}
