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

  return <div className="grid gap-1.5 w-full max-w-[34rem] mx-auto px-1 sm:px-2">
    {KEYBOARD_ROWS.map((row, i) => (
      <div key={i} className="flex w-full justify-center gap-1 sm:gap-1.5">
        {row.map(key => {
          const status = getKeyStatus(key)
          return (
            <button
              key={key}
              className={`
                h-10 sm:h-11 md:h-12
                ${key === "Enter" || key === "Backspace" 
                  ? "flex-[1.6] sm:flex-[1.8]" 
                  : "flex-1"
                }
                min-w-0 rounded-lg
                px-0.5 sm:px-1 
                text-[10px] sm:text-xs md:text-sm
                leading-none whitespace-nowrap
                font-semibold 
                transition-all duration-150
                active:scale-95
                shadow-md
                ${
                  status === "default" 
                    ? "bg-slate-500 hover:bg-slate-400 text-white border border-slate-400/70" 
                    : status === "absent" 
                      ? "bg-slate-950 text-slate-500 border border-slate-800/80" 
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
