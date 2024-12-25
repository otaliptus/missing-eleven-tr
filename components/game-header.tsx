import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from 'lucide-react'

interface GameHeaderProps {
  game: string
  team: string
  formation: string
}

export function GameHeader({ game, team, formation }: GameHeaderProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Trophy className="h-8 w-8 text-primary" />
        <div className="space-y-1.5">
          <CardTitle>{game}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {team} • {formation}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Guess all 11 players from this match. Each player name is a Wordle puzzle - green tiles mean correct letter in correct spot, yellow means correct letter in wrong spot.
        </p>
      </CardContent>
    </Card>
  )
}

