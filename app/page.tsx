"use client"

import { useEffect, useMemo, useState } from "react"
import { Formation } from "@/components/formation"
import { assignPositions } from "@/lib/api"

type GameData = {
  game: string
  team: string
  formation: string
  lineup: string[]
  gameId: number
}

function getDailyGameData(csvText: string): GameData {
  const allLines = csvText.trim().split(/\r?\n/)

  // Skip header row and filter valid data lines
  const dataLines = allLines.slice(1).filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return false
    const parts = trimmed.split(",")
    if (parts.length < 4) return false
    const lineupString = parts.slice(3).join(",")
    const lineup = lineupString.split(";")
    return lineup.length === 11
  })

  if (dataLines.length === 0) {
    throw new Error("No valid game rows found in games.csv")
  }

  // Use UTC day index for deterministic, timezone-safe daily selection
  const utcDayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const index = utcDayIndex % dataLines.length
  const gameLine = dataLines[index]

  const parts = gameLine.split(",")
  const game = parts[0]?.trim() ?? ""
  const team = parts[1]?.trim() ?? ""
  const formation = parts[2]?.trim() ?? ""
  const lineupString = parts.slice(3).join(",").trim()
  const lineup = lineupString ? lineupString.split(";") : []

  return {
    game,
    team,
    formation,
    lineup,
    gameId: utcDayIndex, // Include for localStorage keying
  }
}

export default function Home() {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const res = await fetch("/games.csv")
        if (!res.ok) {
          throw new Error(`Failed to load games.csv (${res.status})`)
        }
        const csvText = await res.text()
        const data = getDailyGameData(csvText)
        if (isMounted) {
          setGameData(data)
        }
      } catch (err) {
        if (!isMounted) return
        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const players = useMemo(() => {
    if (!gameData) return []
    return assignPositions(gameData.formation, gameData.lineup)
  }, [gameData])

  if (error) {
    return (
      <main className="min-h-screen gradient-dark text-white p-2 sm:p-4">
        <div className="container mx-auto flex flex-col items-center justify-center h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)]">
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-red-400 font-medium">Failed to load game: {error}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!gameData) {
    return (
      <main className="min-h-screen gradient-dark text-white p-2 sm:p-4">
        <div className="container mx-auto flex flex-col items-center justify-center h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)]">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="animate-pulse flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/30"></div>
              <p className="text-slate-300">Loading daily game...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen gradient-dark text-white p-1 sm:p-2 flex items-center justify-center">
      <div className="h-full w-full max-w-2xl">
          <Formation
            formation={gameData.formation}
            players={players}
            game={gameData.game}
            team={gameData.team}
            gameId={gameData.gameId}
          />
      </div>
    </main>
  )
}
