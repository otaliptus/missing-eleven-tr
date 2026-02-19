"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

interface DifficultySelectionModalProps {
  open: boolean
  onSelect: (difficulty: "easy" | "hard") => void
}

export function DifficultySelectionModal({ open, onSelect }: DifficultySelectionModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="font-mono sm:max-w-sm glass rounded-2xl flex flex-col items-center gap-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="w-full flex flex-col items-center pb-4">
          <Trophy className="h-10 w-10 text-emerald-400 mx-auto mb-2 drop-shadow-lg" />
          <DialogTitle className="text-2xl font-extrabold text-white tracking-tight text-center">
            İlk 11!
          </DialogTitle>
          <p className="text-slate-300 text-sm text-center mt-1">
            Zorluk seviyesi seç
          </p>
        </DialogHeader>

        <div className="flex gap-4 w-full mt-2">
          <Button
            onClick={() => onSelect("easy")}
            className="flex-1 py-6 text-base font-bold rounded-xl bg-emerald-600/80 hover:bg-emerald-500 border border-emerald-400/40 text-white transition-all duration-150 flex flex-col gap-1 h-auto"
          >
            <span className="text-lg">🟢</span>
            <span>Easy</span>
            <span className="text-xs font-normal text-emerald-100/80">Büyük kulüpler</span>
          </Button>

          <Button
            onClick={() => onSelect("hard")}
            className="flex-1 py-6 text-base font-bold rounded-xl bg-red-700/70 hover:bg-red-600 border border-red-500/40 text-white transition-all duration-150 flex flex-col gap-1 h-auto"
          >
            <span className="text-lg">🔴</span>
            <span>Hard</span>
            <span className="text-xs font-normal text-red-100/80">Diğer takımlar</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
