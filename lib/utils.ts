import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizePlayerName(name: string): string {
  // Strip all punctuation: apostrophes, hyphens, periods, backticks
  // This is the canonical normalization used for all comparisons, 
  // length checks, and keyboard coloring
  return name.replace(/['\-\.`]/g, '')
}

export function normalizeKeyInput(key: string): string | null {
  if (key.length !== 1) return null

  const normalized = key
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

  return /^[A-Z]$/.test(normalized) ? normalized : null
}

export function getDisplayBoxes(name: string): { char: string; isSpecial: boolean }[] {
  return name.split('').map(char => ({
    char,
    isSpecial: char === '-' || char === "'" || char === '.' || char === '`'
  }))
}