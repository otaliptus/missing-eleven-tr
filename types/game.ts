export interface GameData {
  game: string
  team: string
  formation: string
  lineup: string[]
  lineupNumbers?: Array<number | null>
  lineupGoals?: number[]
  lineupAssists?: number[]
  lineupCards?: number[]
  lineupSubstitutions?: number[]
  sourceMatchId?: string
}

export interface PlayerData {
  id: number
  name: string
  position: string
  shirtNumber?: number | null
  goals?: number
  assists?: number
  cards?: number
  substitutions?: number
}

export interface PlayerState {
  guesses: string[]
  isComplete: boolean
}
