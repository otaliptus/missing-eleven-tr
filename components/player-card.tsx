import { Button } from "@/components/ui/button"
import { Jersey } from "@/components/jersey"
import type { PlayerData, PlayerState } from "@/types/game"

interface PlayerCardProps {
  player: PlayerData
  state?: PlayerState
  onClick: () => void
  team?: string
}

export function PlayerCard({ player, state, onClick, team }: PlayerCardProps) {
  return (
    <Button
      variant="ghost"
      className="relative h-20 w-16 sm:h-24 sm:w-20 p-0 hover:bg-transparent hover:scale-105 transition-transform active:scale-95 [&_svg]:!size-full [&_svg]:!w-full [&_svg]:!h-full"
      onClick={onClick}
    >
      <Jersey player={player} state={state} team={team} className="w-full h-full" />
    {/* Player Card Redesign */}
    </Button>
  )
}