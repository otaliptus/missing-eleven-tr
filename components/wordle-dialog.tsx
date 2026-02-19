"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { WordleKeyboard } from "@/components/wordle-keyboard"
import { WordleGrid } from "@/components/wordle-grid"
import type { PlayerData, PlayerState } from "@/types/game"
import { normalizePlayerName, normalizeKeyInput } from "@/lib/utils"

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
  const [isCelebrating, setIsCelebrating] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)

  // Compute normalized name once for consistent use
  const normalizedName = player ? normalizePlayerName(player.name) : ""
  const isSolved = !!state?.isComplete || guesses.includes(normalizedName)
  
  // Game is over if solved OR 8 guesses reached (check both state and local guesses for race safety)
  const isGameOver = isSolved || guesses.length >= 8 || (state?.guesses?.length ?? 0) >= 8

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (open && player) {
      // Only reset when dialog initially opens, not when state updates during celebration
      if (!isCelebrating) {
        clearCloseTimeout()
        setCurrentGuess("")
        setGuesses(state?.guesses || [])
      }
    }
    if (!open) {
      clearCloseTimeout()
      setIsCelebrating(false)
    }
  }, [open, player, state, clearCloseTimeout, isCelebrating])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || !player || isGameOver || isCelebrating) return
  
      if (e.key === "Enter") {
        if (currentGuess.length === normalizedName.length) {
          const newGuesses = [...guesses, currentGuess]
          setGuesses(newGuesses)
          setCurrentGuess("")
  
          const isComplete = currentGuess === normalizedName
          if (isComplete || newGuesses.length >= 8) {
            onGuessComplete(player.id, newGuesses, isComplete)
            if (isComplete) {
              setIsCelebrating(true)
              clearCloseTimeout()
              closeTimeoutRef.current = window.setTimeout(() => {
                onOpenChange(false)
              }, 1000)
            }
          }
        }
      } else if (e.key === "Backspace") {
        setCurrentGuess(prev => prev.slice(0, -1))
      } else {
        const letter = normalizeKeyInput(e.key)
        if (letter && currentGuess.length < normalizedName.length) {
          setCurrentGuess(prev => prev + letter)
        }
      }
    }
  
    const cleanup = () => window.removeEventListener("keydown", handleKeyDown)
  
    if (open && player && !isGameOver) {
      window.addEventListener("keydown", handleKeyDown)
    }
  
    return cleanup
  }, [open, player, isGameOver, isCelebrating, currentGuess, guesses, normalizedName, onGuessComplete, onOpenChange, clearCloseTimeout])

  const handleClose = (nextOpen: boolean) => {
    if (nextOpen) return
    clearCloseTimeout()

    if (player && guesses.length > 0 && !isSolved) {
      onGuessComplete(player.id, guesses, false)
    }
    onOpenChange(false)
  }

  // Handler for on-screen keyboard - uses normalized name consistently
  const handleKeyPress = (key: string) => {
    if (isGameOver || isCelebrating) return
    
    if (key === "Enter") {
      if (currentGuess.length === normalizedName.length) {
        const newGuesses = [...guesses, currentGuess]
        setGuesses(newGuesses)
        setCurrentGuess("")

        const isComplete = currentGuess === normalizedName
        if (isComplete || newGuesses.length >= 8) {
          onGuessComplete(player!.id, newGuesses, isComplete)
          if (isComplete) {
            setIsCelebrating(true)
            clearCloseTimeout()
            closeTimeoutRef.current = window.setTimeout(() => {
              onOpenChange(false)
            }, 1000)
          }
        }
      }
    } else if (key === "Backspace") {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else {
      const letter = normalizeKeyInput(key)
      if (letter && currentGuess.length < normalizedName.length) {
        setCurrentGuess(prev => prev + letter)
      }
    }
  }

  if (!player) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="font-mono glass rounded-2xl text-white p-2 sm:p-4 max-h-[92dvh] w-[94vw] sm:w-[90vw] md:w-[80vw] lg:w-[60vw] overflow-hidden">
        <div className="grid gap-4 sm:gap-5">
          <div className="w-full">
            <WordleGrid
              word={player.name}
              guesses={guesses}
              currentGuess={currentGuess}
            />
          </div>      
          <div className="w-full">
           <WordleKeyboard
              word={player.name}
              guesses={guesses}
              onKeyPress={handleKeyPress}
            />
          </div>
          {guesses.length >= 8 && !state?.isComplete && (
            <div className="text-red-400 font-bold text-sm sm:text-base text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20 break-words">
              Correct answer: {player.name}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
