import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizePlayerName(name: string): string {
  return name.replace(/['-]/g, '')
}

export function getDisplayBoxes(name: string): { char: string; isSpecial: boolean }[] {
  return name.split('').map(char => ({
    char,
    isSpecial: char === '-' || char === "'"
  }))
}