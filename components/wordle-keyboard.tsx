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

  return <div className="grid gap-1 w-full mx-auto px-1">
    {KEYBOARD_ROWS.map((row, i) => (
      <div key={i} className="flex justify-center gap-1">
        {row.map(key => {
          const status = getKeyStatus(key)
          return (
            <button
              key={key}
              className={`
                h-10 sm:h-12 md:h-14
                ${key === "Enter" || key === "Backspace" 
                  ? "min-w-[3rem] sm:min-w-[4rem] md:min-w-[4.25rem]" 
                  : "min-w-[1.75rem] sm:min-w-[2.25rem] md:min-w-[2.5rem]"
                }
                rounded-md 
                px-0.5 sm:px-1 
                text-xs sm:text-sm md:text-base
                font-semibold 
                transition-colors
                ${
                  status === "default" ? "bg-gray-700 hover:bg-gray-600" :
                  status === "absent" ? "bg-gray-800" :
                  status === "present" ? "bg-yellow-500" :
                  "bg-green-500"
                }
              `}
              onClick={() => onKeyPress(key)}
              type="button"
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

