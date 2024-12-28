import { Formation } from "@/components/formation"
import { MatchInfo } from "@/components/match-info"
import { assignPositions } from "@/lib/api"
import fs from 'fs/promises';
import path from 'path';

async function getDailyGameData() {
  const csvPath = path.join(process.cwd(), 'games.csv');
  const csvFile = await fs.readFile(csvPath, 'utf-8');
  const lines = csvFile.trim().split('\n');
  const numLines = lines.length;

  const today = new Date();
  const dateString = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
  const dateHash = parseInt(dateString, 10);
  const index = dateHash % numLines;
  const gameLine = lines[index];
  
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
    lineup
  }
}

export default async function Home() {
  const gameData = await getDailyGameData()
  const players = assignPositions(gameData.formation, gameData.lineup)

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="relative">
        <MatchInfo 
          game={gameData.game}
          team={gameData.team}
          formation={gameData.formation}
        />
        <Formation 
          formation={gameData.formation}
          players={players}
        />
      </div>
    </main>
  )
}