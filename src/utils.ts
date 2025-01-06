import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatedString(value: string) {
  let str = value.trim()
  if (str.length > 10) {
    str = str.substring(0, 8) + "..." + str.substring(str.length - 5)
  }
  return str
}
