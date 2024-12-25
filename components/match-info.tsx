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
  const [gameParts, setGameParts] = useState<string[]>(() => {
    const parts = game.split(/-(.+)/);
    return parts.filter(Boolean);
  });

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
        className="absolute top-4 left-4 z-50 flex gap-2 bg-green-800/50 hover:bg-green-700/50 text-white border-white/20"
        onClick={() => setShowModal(true)}
      >
        <Info className="h-4 w-4" />
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="font-mono sm:max-w-md bg-gray-900 border border-white/20 flex flex-col items-center">
          <div className="pb-2">
            <Trophy className="h-8 w-8 text-green-500 mx-auto" />
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">{gameParts[0]}</h2>
              <p className="text-sm text-gray-400">
                {gameParts.slice(1).join('\n')}
                <br />
                {team} • {formation}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}