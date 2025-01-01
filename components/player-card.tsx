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
        "relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-full border-2 p-0 font-mono",
        state?.isComplete ? "border-green-500 bg-green-500/60" : 
        isFailed ? "border-red-500 bg-red-500/60" :
        isAttempting ? "border-yellow-500 bg-yellow-500/60" :
        "border-white/50 bg-gray-600 hover:bg-blue-500"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
      <span className="text-base sm:text-lg text-white">
        {state?.isComplete ? "✓" : isFailed ? "✗" : player.position}
      </span>
      <span className="text-[8px] sm:text-[10px] font-bold text-white">
        {(state?.isComplete || isFailed) ? player.name : "(" + player.name.length + ")"}
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