"use client"

import type React from "react"
import Link from "next/link" // Import Link from next/link
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useMood } from "@/context/mood-context"
import { useEffect, useState, useRef } from "react"
import { track } from "@vercel/analytics"

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

export default function LinkCard({ link, index }: LinkCardProps) {
  const { animationSpeed, mood } = useMood()
  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

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
        rotate: { duration: 2, ease: "linear", repeat: link.icon === "🔄" ? Number.POSITIVE_INFINITY : 0 },
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

  // If it's a coming soon card, render a div instead of an anchor
  if (link.comingSoon) {
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
          {/* Coming Soon Banner */}
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
                className="w-12 h-12 flex items-center justify-center text-2xl bg-white/50 backdrop-blur-sm rounded-full mr-4 overflow-hidden shadow-inner border border-white/50"
                whileHover="hover"
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                variants={iconVariants}
              >
                <span>{link.icon}</span>
              </motion.div>
              <div>
                <h3 className="font-medium text-lg">{link.title}</h3>
                <p className="text-sm text-gray-600">
                  {link.title === "Careers @ CK" ? "Join our team" : link.description}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Add special highlight for Book a Viewing card
  const isBookViewing = link.id === "book-viewing"
  const cardClasses =
    "relative bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/40 hover:shadow-xl transition-all overflow-hidden shadow-lg"

  // Regular clickable card
  return (
    <Link // Use Next.js Link component
      href={link.url}
      passHref
      legacyBehavior={false} // Use new Link behavior
    >
      <motion.div // This div is now the direct child of Link and will receive the href
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
        ref={cardRef} // Ref moved here
        style={{
          // Motion styles moved here
          rotateX,
          rotateY,
          boxShadow: isHovered ? getHoverShadow() : "0 8px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.div // This div is for styling and hover effects, not for click handling
          className={cardClasses}
          whileHover={{
            // whileHover should be on the clickable element or its direct motion child
            scale: 1.03,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
        >
          {/* Subtle shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0"
            animate={isHovered ? { opacity: 0.5, left: ["100%", "-100%"] } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <motion.div className="flex items-center relative z-10">
            <motion.div
              className="w-12 h-12 flex items-center justify-center text-2xl bg-white/50 backdrop-blur-sm rounded-full mr-4 overflow-hidden shadow-inner border border-white/50"
              whileHover="hover"
              initial="initial"
              animate={isHovered ? "hover" : "initial"}
              variants={iconVariants}
            >
              <span>{link.icon}</span>
            </motion.div>
            <div>
              <h3 className="font-medium text-lg">{link.title}</h3>
              <p className="text-sm text-gray-600">
                {link.title === "Careers @ CK" ? "Join our team" : link.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  )
}
