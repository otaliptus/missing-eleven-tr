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
        "relative h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-full border-2 p-0 font-mono",
        state?.isComplete ? "border-green-500 bg-green-500/20" : 
        isFailed ? "border-red-500 bg-red-500/20" :
        isAttempting ? "border-yellow-500 bg-yellow-500/20" :
        "border-white/50 bg-gray-600 hover:bg-blue-500"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
        <span className="text-sm sm:text-md text-white">
          {state?.isComplete ? "✓" : isFailed ? "✗" : player.position}
        </span>
        <span className="text-[6px] sm:text-[8px] font-bold text-white">
          {(state?.isComplete || isFailed) ? player.name : "*".repeat(Math.min(player.name.length, 8))}
        </span>
      </div>
      {state?.guesses.length ? (
        <Badge
          variant={state.isComplete ? "default" : "destructive"}
          className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full p-0 text-[10px] sm:text-xs"
        >
          {state.guesses.length}
        </Badge>
      ) : null}
    </Button>
  )
}