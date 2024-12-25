"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { WordleKeyboard } from "@/components/wordle-keyboard"
import { WordleGrid } from "@/components/wordle-grid"
import type { PlayerData, PlayerState } from "@/types/game"

interface WordleDialogProps {
  player: PlayerData | null
  state?: PlayerState
  open: boolean
  onOpenChange: (open: boolean) => void
  onGuessComplete: (playerId: number, guesses: string[], isComplete: boolean) => void
}

export function WordleDialog({ 
  player, 
  state,
  open, 
  onOpenChange, 
  onGuessComplete 
}: WordleDialogProps) {
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [showGuess, setShowGuess] = useState(false)

  useEffect(() => {
    if (open && player) {
      setCurrentGuess("")
      setGuesses(state?.guesses || [])
      setShowGuess(false)
    }
  }, [open, player, state])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || !player || state?.isComplete) return

      if (e.key === "Enter") {
        if (currentGuess.length === player.name.length) {
          const newGuesses = [...guesses, currentGuess]
          setGuesses(newGuesses)
          setCurrentGuess("")
          setShowGuess(true)

          const isComplete = currentGuess === player.name
          if (isComplete || newGuesses.length >= 8) {
            onGuessComplete(player.id, newGuesses, isComplete)
          }
        }
      } else if (e.key === "Backspace") {
        setCurrentGuess(prev => prev.slice(0, -1))
        setShowGuess(false)
      } else if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < player.name.length) {
        setCurrentGuess(prev => prev + e.key.toUpperCase())
        setShowGuess(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, player, state, currentGuess, guesses, onGuessComplete])

  const handleClose = () => {
    if (player && guesses.length > 0 && !state?.isComplete) {
      onGuessComplete(player.id, guesses, false)
    }
    onOpenChange(false)
  }

  if (!player) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="font-mono sm:max-w-fit bg-gray-900 text-white">
        <div className="grid gap-4 place-items-center">
          <WordleGrid
            word={player.name}
            guesses={guesses}
            currentGuess={currentGuess}
            showCurrentGuess={showGuess}
          />
          <WordleKeyboard
            word={player.name}
            guesses={guesses}
            onKeyPress={(key) => {
              if (key === "Enter") {
                if (currentGuess.length === player.name.length) {
                  const newGuesses = [...guesses, currentGuess]
                  setGuesses(newGuesses)
                  setCurrentGuess("")
                  setShowGuess(true)

                  const isComplete = currentGuess === player.name
                  if (isComplete || newGuesses.length >= 8) {
                    onGuessComplete(player.id, newGuesses, isComplete)
                  }
                }
              } else if (key === "Backspace") {
                setCurrentGuess(prev => prev.slice(0, -1))
                setShowGuess(false)
              } else if (currentGuess.length < player.name.length) {
                setCurrentGuess(prev => prev + key)
                setShowGuess(false)
              }
            }}
          />
          {guesses.length === 8 && !state?.isComplete && (
            <div className="text-red-500 font-bold">
              Correct answer: {player.name}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

