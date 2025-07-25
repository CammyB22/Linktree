"use client"
import { motion } from "framer-motion"
import { MoodProvider } from "@/context/mood-context"
import AnimatedBackground from "@/components/animated-background"
import DynamicGreeting from "@/components/dynamic-greeting"
import MoodToggle from "@/components/mood-toggle"
import LinkGrid from "@/components/link-grid"
import Footer from "@/components/footer"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useDeviceOrientation } from "@/hooks/use-device-orientation"
import Logo from "@/components/logo"
import { useEffect } from "react"

export default function Home() {
  const mousePosition = useMousePosition()
  const deviceOrientation = useDeviceOrientation()

  // Try to enable device orientation API on iOS without requiring permission UI
  useEffect(() => {
    // Check if it's an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

    if (isIOS) {
      // Try to enable device orientation without explicit permission UI
      // This will work on some iOS versions and fallback to the animation if not
      try {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          // @ts-ignore - TypeScript doesn't know about this method yet
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          // @ts-ignore
          DeviceOrientationEvent.requestPermission().catch(() => {
            // Silently fail - we'll use the animation fallback
            console.log("Using animation fallback for holographic effect")
          })
        }
      } catch (error) {
        // Silently fail - we'll use the animation fallback
        console.log("Using animation fallback for holographic effect")
      }
    }
  }, [])

  return (
    <MoodProvider>
      <main className="min-h-screen relative overflow-hidden">
        <AnimatedBackground mousePosition={mousePosition} deviceOrientation={deviceOrientation} />

        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pt-4 md:pt-6"
          >
            <Logo />
            <DynamicGreeting />
            <MoodToggle />
            <LinkGrid />
            <Footer />
          </motion.div>
        </div>
      </main>
    </MoodProvider>
  )
}
