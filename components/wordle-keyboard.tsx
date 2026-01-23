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

  return <div className="grid gap-1.5 w-full mx-auto px-1">
    {KEYBOARD_ROWS.map((row, i) => (
      <div key={i} className="flex justify-center gap-1">
        {row.map(key => {
          const status = getKeyStatus(key)
          return (
            <button
              key={key}
              className={`
                h-11 sm:h-12 md:h-14
                ${key === "Enter" || key === "Backspace" 
                  ? "min-w-[3.25rem] sm:min-w-[4.25rem] md:min-w-[4.5rem]" 
                  : "min-w-[1.85rem] sm:min-w-[2.4rem] md:min-w-[2.6rem]"
                }
                rounded-lg
                px-0.5 sm:px-1.5 
                text-xs sm:text-sm md:text-base
                font-semibold 
                transition-all duration-150
                active:scale-95
                shadow-md
                ${
                  status === "default" 
                    ? "bg-slate-600 hover:bg-slate-500 text-white border border-slate-500/50" 
                    : status === "absent" 
                      ? "bg-slate-700 text-slate-400 border border-slate-600/30" 
                      : status === "present" 
                        ? "bg-amber-500 text-white border border-amber-400 shadow-amber-500/20" 
                        : "bg-emerald-500 text-white border border-emerald-400 shadow-emerald-500/20"
                }
              `}
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
