import type { CSSProperties } from "react"
import { normalizePlayerName } from "@/lib/utils"

interface WordleKeyboardProps {
  word: string
  guesses: string[]
  onKeyPress: (key: string) => void
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Backspace", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
]

export function WordleKeyboard({ word, guesses, onKeyPress }: WordleKeyboardProps) {
  // Use normalized word for all status calculations
  const normalizedWord = normalizePlayerName(word)
  // Mobile-first: 44px min height for proper touch targets, scales up on larger screens
  const keyHeight = "clamp(2.6rem, 6.5vh, 3.4rem)"
  const keyGap = "clamp(3px, 0.8vw, 5px)"
  const keyFont = "clamp(0.75rem, 2vw, 1rem)"
  const gridStyle = { rowGap: "clamp(4px, 1vh, 8px)" } as CSSProperties
  const rowStyle = { columnGap: keyGap } as CSSProperties
  const keyStyle = { height: keyHeight, fontSize: keyFont } as CSSProperties
  
  const getKeyStatus = (key: string) => {
    if (key === "Enter" || key === "Backspace") return "default"

    let bestStatus = "default"
    const keyUpperCase = key.toUpperCase()

    // Count occurrences of each letter in the normalized target word
    const letterCounts = new Map<string, number>()
    for (const char of normalizedWord) {
      letterCounts.set(char, (letterCounts.get(char) || 0) + 1)
    }

    for (const guess of guesses) {
      // First mark all correct positions
      const correctPositions = new Set<number>()
      const remainingCounts = new Map(letterCounts)

      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === normalizedWord[i]) {
          correctPositions.add(i)
          const currentCount = remainingCounts.get(guess[i]) || 0
          remainingCounts.set(guess[i], currentCount - 1)
        }
      }

      // Then check for present letters
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === keyUpperCase) {
          if (correctPositions.has(i)) {
            bestStatus = "correct"
            break
          } else {
            const remainingCount = remainingCounts.get(keyUpperCase) || 0
            if (remainingCount > 0) {
              remainingCounts.set(keyUpperCase, remainingCount - 1)
              if (bestStatus !== "correct") {
                bestStatus = "present"
              }
            } else if (bestStatus === "default") {
              bestStatus = "absent"
            }
          }
        }
      }
    }

    return bestStatus
  }

  return <div className="grid w-full max-w-[34rem] mx-auto px-[2px] sm:px-2" style={gridStyle}>
    {KEYBOARD_ROWS.map((row, i) => (
      <div key={i} className="flex w-full justify-center" style={rowStyle}>
        {row.map(key => {
          const status = getKeyStatus(key)
          return (
            <button
              key={key}
              className={`
                ${key === "Enter" || key === "Backspace" 
                  ? "flex-[1.5]" 
                  : "flex-1"
                }
                min-w-0 rounded-md sm:rounded-lg
                px-0 sm:px-1 
                leading-none whitespace-nowrap
                font-bold 
                select-none touch-manipulation
                transition-colors duration-100
                active:brightness-125 active:scale-[0.93]
                ${
                  status === "default" 
                    ? "bg-slate-500/90 hover:bg-slate-400 text-white border border-slate-400/50" 
                    : status === "absent" 
                      ? "bg-slate-800 text-slate-500 border border-slate-700/60" 
                      : status === "present" 
                        ? "bg-amber-500 text-white border border-amber-400 shadow-sm shadow-amber-500/30" 
                        : "bg-emerald-500 text-white border border-emerald-400 shadow-sm shadow-emerald-500/30"
                }
              `}
              style={keyStyle}
              onClick={() => onKeyPress(key)}
              type="button"
              tabIndex={-1}
              aria-label={key === "Backspace" ? "Delete" : key === "Enter" ? "Submit guess" : `Letter ${key}`}
            >
              {key === "Backspace" ? "⌫" : key}
            </button>
          )
        })}
      </div>
    ))}
  </div>
}
