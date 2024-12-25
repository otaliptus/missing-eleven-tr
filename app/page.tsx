import { Formation } from "@/components/formation"
import { MatchInfo } from "@/components/match-info"
import { getTodaysGame, assignPositions } from "@/lib/api"

export default async function Home() {
  const gameData = await getTodaysGame()
  const players = assignPositions(gameData.formation, gameData.lineup)

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <MatchInfo 
        game={gameData.game}
        team={gameData.team}
        formation={gameData.formation}
      />
      <Formation 
        formation={gameData.formation}
        players={players}
      />
    </main>
  )
}

