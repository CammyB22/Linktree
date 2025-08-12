"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import LinkCard from "./link-card"
import { useMood } from "@/context/mood-context"

// Mock data - would be fetched from Airtable in production
const linkData = [
  {
    id: "rebookers",
    title: "Rebookers 2026",
    url: "https://campuskey.modus10.co.za/login",
    description: "Secure your spot for next year 🏠",
    icon: "🔄",
    active: true,
    order: 1, // Changed from 10 to 1
  },
  {
    id: "rebookers-info",
    title: "Rebooking Guide & Competitions",
    url: "https://rebook2026.vercel.app/rebook",
    description: "Everything you need to know about rebooking + exclusive competitions 🏆",
    icon: "📋",
    active: true,
    order: 1.5, // Place it right after rebookers (order 1)
  },
  {
    id: "public-applications",
    title: "Public Applications",
    url: "https://campuskey.co.za/apply", // Update this URL as needed
    description: "Applications open to the public 📝",
    icon: "📝",
    active: true,
    order: 3, // Place it second in the list
  },
  {
    id: "1",
    title: "CampusKey Website",
    url: "https://campuskey.co.za/",
    description: "Visit our full site 🌐",
    icon: "🌐",
    active: true,
    order: 2,
  },
  {
    id: "book-viewing",
    title: "Book a Viewing",
    url: "https://form.asana.com/?k=_1bpNP5dLgGSorUeSAI2zg&d=279345687743318",
    description: "See your future home in person 🏠",
    icon: "👁️",
    active: true,
    order: 4,
  },
  {
    id: "2",
    title: "CK mini Café",
    url: "https://www.instagram.com/ckmini_cafe",
    description: "Get your daily drip ☕",
    icon: "☕",
    active: true,
    order: 5,
  },
  {
    id: "3",
    title: "Staycation in CPT",
    url: "https://www.booking.com/hotel/za/campuskey-staycations.en-gb.html?aid=318615&label=English_South_Africa_EN_ZA_20053122505-dh3Fh87GJDQFuEV_TL5HvQS637942139684%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atidsa-199155874585%3Alp1028746%3Ali%3Adec%3Adm%3Aag20053122505%3Acmp313260865&sid=d56615180567f76c23a1914c3b3697cf&dest_id=-1217214&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1744731652&srpvid=916b6e3edc6003f9&type=total&ucfs=1&",
    description: "Weekend reset? Book now 🌴",
    icon: "🌴",
    active: true,
    order: 6,
  },
  {
    id: "4",
    title: "CK Club",
    url: "https://campuskey.co.za/ck-club/",
    description: "Connect. Collaborate. CK Club 💼",
    icon: "💼",
    active: true,
    order: 7,
  },
  {
    id: "5",
    title: "CK Stores",
    url: "https://campuskey.co.za/online-stores/",
    description: "Room cleans, Wi-Fi upgrades + merch 🛍️",
    icon: "🛍️",
    active: true,
    order: 8,
  },
  {
    id: "6",
    title: "TikTok",
    url: "https://www.tiktok.com/@campuskey",
    description: "Watch our story unfold 🎥",
    icon: "🎥",
    active: true,
    order: 9,
  },
  {
    id: "7",
    title: "iStore Deal",
    url: "https://form.jotform.com/230290867120552",
    description: "Exclusive tech perks for CK students 🍏",
    icon: "🍏",
    active: true,
    order: 10,
  },
  {
    id: "8",
    title: "Careers @ CK",
    url: "https://campuskey.bamboohr.com/careers",
    description: "Work where you stay 💻",
    icon: "💻",
    active: true,
    order: 11,
  },
]

export default function LinkGrid() {
  const [links, setLinks] = useState([])
  const [rebookersCard, setRebookersCard] = useState([])
  const [otherCards, setOtherCards] = useState([])
  const { animationSpeed } = useMood()

  useEffect(() => {
    // Simulate fetching from Airtable
    const fetchLinks = async () => {
      // In a real implementation, this would be an API call to Airtable
      const activeLinks = linkData.filter((link) => link.active).sort((a, b) => a.order - b.order)

      // Separate rebookers cards from other cards
      const rebookersCards = activeLinks.filter((link) => link.id === "rebookers" || link.id === "rebookers-info")
      const others = activeLinks.filter((link) => link.id !== "rebookers" && link.id !== "rebookers-info")

      setRebookersCard(rebookersCards)
      setOtherCards(others)
      setLinks(activeLinks)
    }

    fetchLinks()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 / animationSpeed,
        delayChildren: 0.3,
      },
    },
  }

  const rebookersContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 / animationSpeed,
        delayChildren: 0.3,
      },
    },
  }

  const otherCardsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 / animationSpeed,
        delayChildren: 0.7, // Increased delay after the rebookers cards
      },
    },
  }

  return (
    <div className="space-y-8">
      {/* Top Section Divider */}
      <motion.div
        className="flex items-center justify-center py-4"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-400/60"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500/50 backdrop-blur-sm border border-gray-400/60 shadow-sm"></div>
          <div className="w-16 h-px bg-gray-400/60"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500/50 backdrop-blur-sm border border-gray-400/60 shadow-sm"></div>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-400/60"></div>
        </div>
      </motion.div>

      {/* Top Section - Rebookers Cards */}
      {rebookersCard && rebookersCard.length > 0 && (
        <motion.div className="w-full" variants={rebookersContainer} initial="hidden" animate="show">
          <div className="max-w-2xl mx-auto">
            {rebookersCard.map((card, index) => (
              <div key={card.id} className={`${index > 0 ? "mt-6" : ""}`}>
                <LinkCard link={card} index={index} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Middle Section Divider */}
      <motion.div
        className="flex items-center justify-center py-4"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-400/60"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500/50 backdrop-blur-sm border border-gray-400/60 shadow-sm"></div>
          <div className="w-16 h-px bg-gray-400/60"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500/50 backdrop-blur-sm border border-gray-400/60 shadow-sm"></div>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-400/60"></div>
        </div>
      </motion.div>

      {/* Bottom Section - Other Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        variants={otherCardsContainer}
        initial="hidden"
        animate="show"
      >
        {otherCards.map((link, index) => (
          <LinkCard key={link.id} link={link} index={index + 2} />
        ))}
      </motion.div>
    </div>
  )
}
