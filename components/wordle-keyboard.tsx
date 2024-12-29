interface WordleKeyboardProps {
  word: string
  guesses: string[]
  onKeyPress: (key: string) => void
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
]

export function WordleKeyboard({ word, guesses, onKeyPress }: WordleKeyboardProps) {
  const getKeyStatus = (key: string) => {
    if (key === "Enter" || key === "Backspace") return "default"

    let bestStatus = "default"
    const keyUpperCase = key.toUpperCase()

    // Count occurrences of each letter in the target word
    const letterCounts = new Map<string, number>()
    for (const char of word) {
      letterCounts.set(char, (letterCounts.get(char) || 0) + 1)
    }

    for (const guess of guesses) {
      // First mark all correct positions
      const correctPositions = new Set<number>()
      const remainingCounts = new Map(letterCounts)

      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === word[i]) {
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

  return (
    <div className="grid gap-2 sm:gap-3 w-full max-w-3xl mx-auto">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 sm:gap-2">
          {row.map(key => {
            const status = getKeyStatus(key)
            return (
              <button
                key={key}
                className={`h-12 sm:h-14 min-w-[2.25rem] sm:min-w-[2.75rem] rounded-md px-1 sm:px-2 text-sm sm:text-base font-semibold transition-colors ${
                  status === "default" ? "bg-gray-700 hover:bg-gray-600" :
                  status === "absent" ? "bg-gray-800" :
                  status === "present" ? "bg-yellow-500" :
                  "bg-green-500"
                }`}
                onClick={() => onKeyPress(key)}
                type="button"
                tabIndex={-1}
              >
                {key === "Backspace" ? "⌫" : key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

