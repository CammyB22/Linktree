"use client"

import { useState, useEffect } from "react"

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    beta: null as number | null,
    gamma: null as number | null,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return orientation
}
