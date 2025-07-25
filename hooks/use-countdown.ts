"use client"

import { useEffect, useState } from "react"

/**
 * A custom hook to manage a countdown to a specific target date.
 * @param targetDate - The target date and time in a string format parsable by `new Date()`.
 * @returns An object with the remaining days, hours, minutes, seconds, and a flag indicating if the countdown is finished.
 */
export const useCountdown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime()

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  return getReturnValues(countDown)
}

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)
  const isFinished = countDown < 0

  return { days, hours, minutes, seconds, isFinished }
}
