"use client"

import { useEffect, useMemo, useState } from "react"
import { Formation } from "@/components/formation"
import { DifficultySelectionModal } from "@/components/team-selection-modal"
import { assignPositions } from "@/lib/api"

type Difficulty = "easy" | "hard"

type GameData = {
  game: string
  team: string
  difficulty: string
  formation: string
  lineup: string[]
  gameId: number
}

const UTC_DAY_INDEX = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev"
const GAMES_CSV_URL = `/games.csv?v=${encodeURIComponent(BUILD_ID)}`

// Pick the daily game for a difficulty pool
function getGameForDifficulty(csvText: string, difficulty: Difficulty): GameData {
  const allLines = csvText.trim().split(/\r?\n/)

  const poolLines = allLines.slice(1).filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return false
    const parts = trimmed.split(",")
    if (parts.length < 5) return false
    if (parts[2]?.trim() !== difficulty) return false
    const lineupString = parts.slice(4).join(",")
    return lineupString.split(";").length === 11
  })

  if (poolLines.length === 0) {
    throw new Error(`No valid game rows found for difficulty: ${difficulty}`)
  }

  const index = UTC_DAY_INDEX % poolLines.length
  const gameLine = poolLines[index]

  const parts = gameLine.split(",")
  const game = parts[0]?.trim() ?? ""
  const team = parts[1]?.trim() ?? ""
  const diff = parts[2]?.trim() ?? ""
  const formation = parts[3]?.trim() ?? ""
  const lineupString = parts.slice(4).join(",").trim()
  const lineup = lineupString ? lineupString.split(";") : []

  const gameId = UTC_DAY_INDEX * 2 + (difficulty === "easy" ? 0 : 1)

  return { game, team, difficulty: diff, formation, lineup, gameId }
}

export default function Home() {
  const [csvText, setCsvText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [gameData, setGameData] = useState<GameData | null>(null)

  // Load CSV once
  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const res = await fetch(GAMES_CSV_URL)
        if (!res.ok) throw new Error(`Failed to load games.csv (${res.status})`)
        const text = await res.text()
        if (isMounted) setCsvText(text)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const handleDifficultySelect = (d: Difficulty) => {
    setDifficulty(d)
  }

  // When both CSV and difficulty are ready, compute game data
  useEffect(() => {
    if (!csvText || !difficulty) return
    try {
      const data = getGameForDifficulty(csvText, difficulty)
      setGameData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [csvText, difficulty])

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

  const showDifficultySelection = !difficulty
  const showLoading = !!difficulty && !gameData

  return (
    <main className="h-screen gradient-dark text-white p-1 sm:p-2 flex items-center justify-center">
      {/* Difficulty selection modal – shown until user picks easy/hard for today */}
      <DifficultySelectionModal
        open={showDifficultySelection}
        onSelect={handleDifficultySelect}
      />

      {showLoading && (
        <div className="glass rounded-2xl p-6 text-center">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-500/30" />
            <p className="text-slate-300">Loading game...</p>
          </div>
        </div>
      )}

      {gameData && (
        <div className="h-full w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[720px]">
          <Formation
            formation={gameData.formation}
            players={players}
            game={gameData.game}
            team={gameData.team}
            gameId={gameData.gameId}
            difficulty={difficulty!}
          />
        </div>
      )}
    </main>
  )
}
