export interface GameData {
  game: string
  team: string
  formation: string
  lineup: string[]
}

export interface PlayerData {
  id: number
  name: string
  position: string
}

export interface PlayerState {
  guesses: string[]
  isComplete: boolean
}

