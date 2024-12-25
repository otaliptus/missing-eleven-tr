"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Trophy, Info } from 'lucide-react'

interface MatchInfoProps {
  game: string
  team: string
  formation: string
}

export function MatchInfo({ game, team, formation }: MatchInfoProps) {
  const [showModal, setShowModal] = useState(true)

  // Show modal on first visit only
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (hasVisited) {
      setShowModal(false)
    } else {
      sessionStorage.setItem('hasVisited', 'true')
    }
  }, [])

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 top-4 z-50"
        onClick={() => setShowModal(true)}
      >
        <Info className="h-4 w-4" />
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="font-mono sm:max-w-md">
          <div className="flex items-center gap-4 pb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-lg font-bold">{game}</h2>
              <p className="text-sm text-muted-foreground">
                {team} • {formation}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Guess all 11 players from this match. Each player name is a Wordle puzzle - green tiles mean correct letter in correct spot, yellow means correct letter in wrong spot.
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

