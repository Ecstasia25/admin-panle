import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateTeamId = () => {
  const uuid = uuidv4().replace(/-/g, "")
  let teamId = ""
  for (let i = 0; i < 6; i++) {
    const char = uuid[Math.floor(Math.random() * uuid.length)]
    teamId += char
  }
  return teamId.toUpperCase()
}

export const generateBookingId = () => {
  const uuid = uuidv4().replace(/-/g, "")
  let bookingId = ""
  for (let i = 0; i < 8; i++) {
    const char = uuid[Math.floor(Math.random() * uuid.length)]
    bookingId += char
  }
  return bookingId.toUpperCase()
}