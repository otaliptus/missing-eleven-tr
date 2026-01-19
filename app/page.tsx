import { Formation } from "@/components/formation"
import { assignPositions } from "@/lib/api"
import fs from 'fs/promises';
import path from 'path';

// Ensure the page is dynamically rendered, not statically built
export const dynamic = "force-dynamic"

async function getDailyGameData() {
  const csvPath = path.join(process.cwd(), 'games.csv');
  const csvFile = await fs.readFile(csvPath, 'utf-8');
  const allLines = csvFile.trim().split('\n');
  
  // Skip header row and filter valid data lines
  const dataLines = allLines.slice(1).filter(line => {
    const parts = line.split(',');
    if (parts.length < 4) return false;
    const lineupString = parts.slice(3).join(',');
    const lineup = lineupString.split(';');
    return lineup.length === 11;
  });
  if (dataLines.length === 0) {
    throw new Error("No valid game rows found in games.csv");
  }

  // Use UTC day index for deterministic, timezone-safe daily selection
  const today = new Date();
  const utcDayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = utcDayIndex % dataLines.length;
  const gameLine = dataLines[index];
  
  const parts = gameLine.split(',');
  const game = parts[0];
  const team = parts[1];
  const formation = parts[2];
  const lineupString = parts.slice(3).join(',');

  const lineup = lineupString.split(';');

  return {
    game,
    team,
    formation,
    lineup,
    gameId: utcDayIndex // Include for localStorage keying
  }
}

export default async function Home() {
  const gameData = await getDailyGameData()
  const players = assignPositions(gameData.formation, gameData.lineup)

  return (
    <main className="min-h-screen bg-gray-900 text-white p-2 sm:p-4">
      <div className="container mx-auto flex flex-col h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)]">
        <div className="flex-1 mt-4">
        <Formation 
          formation={gameData.formation}
          players={players}
          game={gameData.game}
          team={gameData.team}
          gameId={gameData.gameId}
        />
        </div>
      </div>
    </main>
  )
}
