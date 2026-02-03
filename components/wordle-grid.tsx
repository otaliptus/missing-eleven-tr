import type { CSSProperties } from "react"
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
  const boxCount = displayBoxes.length
  const denseGrid = boxCount > 18
  const gapPx = boxCount > 26 ? 2 : boxCount > 20 ? 3 : boxCount > 14 ? 4 : 6
  const sizeConfig =
    boxCount > 26
      ? { min: 12, vmin: 2.6, max: 20 }
      : boxCount > 22
        ? { min: 12, vmin: 2.8, max: 22 }
        : boxCount > 18
          ? { min: 14, vmin: 3.2, max: 24 }
          : boxCount > 14
            ? { min: 16, vmin: 3.6, max: 28 }
            : boxCount > 10
              ? { min: 18, vmin: 4.2, max: 32 }
              : { min: 20, vmin: 4.8, max: 36 }
  const cellSize = `clamp(${sizeConfig.min}px, ${sizeConfig.vmin}vmin, ${sizeConfig.max}px)`
  const letterSizeClass = boxCount > 26
    ? "text-[clamp(0.55rem,1.8vw,0.9rem)]"
    : denseGrid
      ? "text-[clamp(0.65rem,2vw,1rem)]"
      : "text-[clamp(0.75rem,2.6vw,1.125rem)]"
  const gridStyle = {
    "--cell": cellSize,
    "--gap": `${gapPx}px`,
    rowGap: `${gapPx + 2}px`,
  } as CSSProperties
  const rowStyle = {
    gridTemplateColumns: `repeat(${boxCount}, var(--cell))`,
    columnGap: "var(--gap)",
  } as CSSProperties
  const cellStyle = {
    width: "var(--cell)",
    height: "var(--cell)",
  } as CSSProperties

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
    <div className="grid" style={gridStyle}>
      {rows.map((_, rowIndex) => {
        const isCurrentRow = rowIndex === guesses.length
        const guess = isCurrentRow ? currentGuess : guesses[rowIndex]
        const shouldShowStatus = !isCurrentRow && guesses[rowIndex] !== undefined

        return (
          <div key={rowIndex} className="mx-auto grid w-fit justify-center" style={rowStyle}>
            {displayBoxes.map((box, colIndex) => {
              if (box.isSpecial) {
                return (
                  <span
                    key={colIndex}
                    className={`flex items-center justify-center px-0.5 sm:px-1 font-bold text-slate-400 ${letterSizeClass}`}
                    style={cellStyle}
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
                  className={`flex items-center justify-center rounded-lg font-bold transition-all duration-200 shadow-md ${letterSizeClass} ${
                    status === "empty" 
                      ? "bg-slate-700/80 border-2 border-slate-600/50" 
                      : status === "absent" 
                        ? "bg-slate-600 border-2 border-slate-500/50 text-slate-300" 
                        : status === "present" 
                          ? "bg-amber-500 border-2 border-amber-400 text-white shadow-amber-500/30" 
                          : "bg-emerald-500 border-2 border-emerald-400 text-white shadow-emerald-500/30"
                  } ${letter ? 'animate-pop' : ''}`}
                  style={cellStyle}
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
