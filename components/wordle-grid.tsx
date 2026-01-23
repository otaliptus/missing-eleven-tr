import { getDisplayBoxes, normalizePlayerName } from "@/lib/utils"

interface WordleGridProps {
  word: string
  guesses: string[]
  currentGuess: string
}

export function WordleGrid({ word, guesses, currentGuess }: WordleGridProps) {
  const rows = Array(8).fill(null)
  const displayBoxes = getDisplayBoxes(word)
  const normalizedWord = normalizePlayerName(word)

  const getLetterStatus = (guess: string, position: number) => {
    const letter = guess[position]
    if (!letter) return "empty"

    // First mark all correct letters
    const correctPositions = new Set<number>()
    const letterCounts = new Map<string, number>()
    
    // Count occurrences of each letter in the target word
    for (const char of normalizedWord) {
      letterCounts.set(char, (letterCounts.get(char) || 0) + 1)
    }

    // First pass: mark correct positions
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === normalizedWord[i]) {
        correctPositions.add(i)
        const currentCount = letterCounts.get(guess[i]) || 0
        letterCounts.set(guess[i], currentCount - 1)
      }
    }

    // If this position is correct, return immediately
    if (correctPositions.has(position)) {
      return "correct"
    }

    // Second pass: check for present letters
    const remainingCount = letterCounts.get(letter) || 0
    if (remainingCount > 0) {
      let yellowsUsed = 0
      for (let i = 0; i < position; i++) {
        if (guess[i] === letter && !correctPositions.has(i)) {
          yellowsUsed++
        }
      }

      if (yellowsUsed < remainingCount) {
        letterCounts.set(letter, remainingCount - 1)
        return "present"
      }
    }

    return "absent"
  }

  return (
    <div className="grid gap-2 sm:gap-3">
      {rows.map((_, rowIndex) => {
        const isCurrentRow = rowIndex === guesses.length
        const guess = isCurrentRow ? currentGuess : guesses[rowIndex]
        const shouldShowStatus = !isCurrentRow && guesses[rowIndex] !== undefined

        return (
          <div key={rowIndex} className="flex gap-1.5 sm:gap-2 justify-center">
            {displayBoxes.map((box, colIndex) => {
              if (box.isSpecial) {
                return (
                  <span
                    key={colIndex}
                    className="flex h-10 sm:h-12 items-center justify-center px-0.5 sm:px-1 text-sm sm:text-lg font-bold text-slate-400 -mx-0.5 sm:-mx-1"
                    aria-hidden="true"
                  >
                    {box.char}
                  </span>
                )
              }

              const normalizedGuessIndex = displayBoxes
                .slice(0, colIndex)
                .filter(b => b.isSpecial)
                .length
              const letter = guess?.[colIndex - normalizedGuessIndex] ?? ""
              const status = shouldShowStatus ? 
                getLetterStatus(guess, colIndex - normalizedGuessIndex) : 
                "empty"

              return (
                <div
                  key={colIndex}
                  className={`flex h-10 w-7 sm:h-12 sm:w-9 items-center justify-center rounded-lg text-sm sm:text-lg font-bold transition-all duration-200 shadow-md ${
                    status === "empty" 
                      ? "bg-slate-700/80 border-2 border-slate-600/50" 
                      : status === "absent" 
                        ? "bg-slate-600 border-2 border-slate-500/50 text-slate-300" 
                        : status === "present" 
                          ? "bg-amber-500 border-2 border-amber-400 text-white shadow-amber-500/30" 
                          : "bg-emerald-500 border-2 border-emerald-400 text-white shadow-emerald-500/30"
                  } ${letter ? 'animate-pop' : ''}`}
                >
                  {letter}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
