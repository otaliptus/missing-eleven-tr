import { GameData, PlayerData } from "@/types/game"

export async function getTodaysGame(): Promise<GameData> {
  // This function is no longer used, the data is fetched in app/page.tsx
  // Keeping it here for type compatibility
  return {
    game: "Placeholder Game",
    team: "Placeholder Team",
    formation: "4-4-2",
    lineup: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"]
  }
}

export function parseFormation(formation: string): number[] {
  return formation.split("-").map(Number)
}

export function assignPositions(formation: string, lineup: string[]): PlayerData[] {
  return lineup.map((name, index) => ({
    id: index,
    name,
    position: `P${index + 1}`
  }))
}