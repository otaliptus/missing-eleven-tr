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
  lineupNumbers: Array<number | null>
  gameId: number
}

const UTC_DAY_INDEX = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev"
const GAMES_CSV_URL = `/games.csv?v=${encodeURIComponent(BUILD_ID)}`

type CsvColumnIndexes = {
  game: number
  team: number
  difficulty: number
  formation: number
  lineup: number
  lineupNumbers: number
}

function getCsvColumnIndexes(headerLine: string): CsvColumnIndexes {
  const columns = headerLine.split(",").map((value) => value.trim().toLowerCase())
  const getIndex = (field: string, fallback: number) => {
    const idx = columns.indexOf(field)
    return idx >= 0 ? idx : fallback
  }

  return {
    game: getIndex("game", 0),
    team: getIndex("team", 1),
    difficulty: getIndex("difficulty", 2),
    formation: getIndex("formation", 3),
    lineup: getIndex("lineup", 4),
    lineupNumbers: getIndex("lineup_numbers", -1),
  }
}

function parseLineupNumbers(raw: string, expectedLength: number): Array<number | null> {
  if (!raw) return Array.from({ length: expectedLength }, () => null)

  const parsed = raw.split(";").map((token) => {
    const trimmed = token.trim()
    if (!trimmed) return null
    const value = Number(trimmed)
    return Number.isInteger(value) && value > 0 ? value : null
  })

  return Array.from({ length: expectedLength }, (_, index) => parsed[index] ?? null)
}

// Pick the daily game for a difficulty pool
function getGameForDifficulty(csvText: string, difficulty: Difficulty): GameData {
  const allLines = csvText.trim().split(/\r?\n/)
  if (allLines.length < 2) {
    throw new Error("games.csv is empty")
  }

  const columnIndexes = getCsvColumnIndexes(allLines[0])

  const poolLines = allLines.slice(1).filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return false
    const parts = trimmed.split(",")
    if (parts.length <= columnIndexes.lineup) return false
    if (parts[columnIndexes.difficulty]?.trim() !== difficulty) return false
    const lineupString = parts[columnIndexes.lineup]?.trim() ?? ""
    return lineupString.split(";").filter(Boolean).length === 11
  })

  if (poolLines.length === 0) {
    throw new Error(`No valid game rows found for difficulty: ${difficulty}`)
  }

  const index = UTC_DAY_INDEX % poolLines.length
  const gameLine = poolLines[index]

  const parts = gameLine.split(",")
  const game = parts[columnIndexes.game]?.trim() ?? ""
  const team = parts[columnIndexes.team]?.trim() ?? ""
  const diff = parts[columnIndexes.difficulty]?.trim() ?? ""
  const formation = parts[columnIndexes.formation]?.trim() ?? ""
  const lineupString = parts[columnIndexes.lineup]?.trim() ?? ""
  const lineup = lineupString ? lineupString.split(";") : []
  const lineupNumbersRaw =
    columnIndexes.lineupNumbers >= 0 ? parts[columnIndexes.lineupNumbers]?.trim() ?? "" : ""
  const lineupNumbers = parseLineupNumbers(lineupNumbersRaw, lineup.length)

  const gameId = UTC_DAY_INDEX * 2 + (difficulty === "easy" ? 0 : 1)

  return { game, team, difficulty: diff, formation, lineup, lineupNumbers, gameId }
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
    return assignPositions(gameData.formation, gameData.lineup, gameData.lineupNumbers)
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
    <main className="h-screen gradient-dark text-white p-1 sm:p-2 flex flex-col">
      {/* Difficulty selection modal – shown until user picks easy/hard for today */}
      <DifficultySelectionModal
        open={showDifficultySelection}
        onSelect={handleDifficultySelect}
      />

      <div className="h-full w-full min-h-0 flex-1 flex items-center justify-center">
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
      </div>

      <footer className="pt-2 pb-1 flex justify-center">
        <div className="flex items-center gap-4 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-sm leading-none text-slate-200 backdrop-blur-sm">
          <a
            href="https://github.com/otaliptus/ilk11"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.2c-3.2.69-3.87-1.35-3.87-1.35-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.72 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.02 11.02 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.73.81 1.17 1.84 1.17 3.1 0 4.45-2.69 5.43-5.26 5.72.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://x.com/otaliptus"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M18.901 1.153h3.68l-8.04 9.188L24 22.847h-7.406l-5.8-7.584-6.639 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
            </svg>
            @otaliptus
          </a>
        </div>
      </footer>
    </main>
  )
}
