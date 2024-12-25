import { GameData, PlayerData } from "@/types/game"

export async function getTodaysGame(): Promise<GameData> {
  return {
    game: "Istanbulspor vs. Kasimpasa - Sunday March 10 - 2024",
    team: "Kasimpasa",
    formation: "4-2-3-1",
    lineup: ["GIANNIOTIS", "WINCK", "OMERUO", "OZCAN", "OUANNES", "GUL", "FALL", "HAJRADINOVIC", "KARA", "ROCHINHA", "COSTA"]
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

