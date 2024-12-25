import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PlayerData, PlayerState } from "@/types/game"

interface PlayerCardProps {
  player: PlayerData
  state?: PlayerState
  onClick: () => void
}

export function PlayerCard({ player, state, onClick }: PlayerCardProps) {
  const isAttempting = state?.guesses.length && !state.isComplete
  const isFailed = state?.guesses.length === 8 && !state.isComplete

  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-14 w-14 shrink-0 rounded-full border-2 p-0 font-mono",
        state?.isComplete ? "border-green-500 bg-green-500/20" : 
        isFailed ? "border-red-500 bg-red-500/20" :
        isAttempting ? "border-yellow-500 bg-yellow-500/20" :
        "border-white/50 bg-white/10"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="text-lg font-bold text-white">
          {state?.isComplete ? "✓" : isFailed ? "✗" : "?"}
        </span>
        <span className="text-[8px] text-white">
          {(state?.isComplete || isFailed) ? player.name : "*".repeat(Math.min(player.name.length, 8))}
        </span>
      </div>
      {state?.guesses.length ? (
        <Badge
          variant={state.isComplete ? "default" : "destructive"}
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {state.guesses.length}
        </Badge>
      ) : null}
    </Button>
  )
}

