"use client"

import { useState, useEffect } from "react"
import { PlayerCard } from "@/components/player-card"
import { WordleDialog } from "@/components/wordle-dialog"
import { parseFormation } from "@/lib/api"
import type { PlayerData, PlayerState } from "@/types/game"

interface FormationProps {
  formation: string
  players: PlayerData[]
}

export function Formation({ formation, players }: FormationProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null)
  const [playerStates, setPlayerStates] = useState<Record<number, PlayerState>>(() => {
    const savedStates = localStorage.getItem('playerStates');
    return savedStates ? JSON.parse(savedStates) : {};
  });
  
  const formationRows = [1, ...parseFormation(formation)]

  useEffect(() => {
    localStorage.setItem('playerStates', JSON.stringify(playerStates));
  }, [playerStates]);

  const handleGuessComplete = (playerId: number, guesses: string[], isComplete: boolean) => {
    setPlayerStates(prev => ({
      ...prev,
      [playerId]: {
        guesses,
        isComplete
      }
    }))
    setSelectedPlayer(null)
  }

  const getPlayersByRow = (rowIndex: number, players: PlayerData[]) => {
    const rowCounts = formationRows
    let startIndex = 0
    for (let i = 0; i < rowIndex; i++) {
      startIndex += rowCounts[i]
    }
    return players.slice(startIndex, startIndex + rowCounts[rowIndex])
  }

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-lg bg-[#1a3a2a] p-4">
      {/* Pitch Markings */}
      <div className="absolute inset-0 z-0">
        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20" />
        {/* Center Line */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/20" />
        {/* Penalty Areas */}
        <div className="absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 border-2 border-white/20" />
        <div className="absolute bottom-0 left-1/2 h-40 w-64 -translate-x-1/2 border-2 border-white/20" />
        {/* Goal Areas */}
        <div className="absolute left-1/2 top-0 h-20 w-48 -translate-x-1/2 border-2 border-white/20" />
        <div className="absolute bottom-0 left-1/2 h-20 w-48 -translate-x-1/2 border-2 border-white/20" />
      </div>

      {/* Players Grid */}
      <div 
        className="relative z-10 grid h-full" 
        style={{ 
          gridTemplateRows: `repeat(${formationRows.length}, 1fr)`,
          gap: "1rem"
        }}
      >
        {formationRows.map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-around px-4">
            {getPlayersByRow(rowIndex, players).map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                state={playerStates[player.id]}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>
        ))}
      </div>

      <WordleDialog
        player={selectedPlayer}
        state={selectedPlayer ? playerStates[selectedPlayer.id] : undefined}
        open={!!selectedPlayer}
        onOpenChange={() => setSelectedPlayer(null)}
        onGuessComplete={handleGuessComplete}
      />
    </div>
  )
}

