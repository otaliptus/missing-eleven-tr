"use client"

import { useState, useEffect } from "react"
import { PlayerCard } from "@/components/player-card"
import { WordleDialog } from "@/components/wordle-dialog"
import { parseFormation } from "@/lib/api"
import type { PlayerData, PlayerState } from "@/types/game"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Share2, Info, Trophy } from "lucide-react"

interface FormationProps {
  formation: string
  players: PlayerData[]
  game: string
  team: string
}

export function Formation({ formation, players, game, team }: FormationProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null)
  const [playerStates, setPlayerStates] = useState<Record<number, PlayerState>>({});
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const savedStates = localStorage.getItem('playerStates');
    if (savedStates) {
      setPlayerStates(JSON.parse(savedStates));
    }
  }, []);
  
  const [showCopyModal, setShowCopyModal] = useState(false)
  const formationRows = [1, ...parseFormation(formation)]

  const handleGuessComplete = (playerId: number, guesses: string[], isComplete: boolean) => {
    setPlayerStates(prev => ({
      ...prev,
      [playerId]: {
        guesses,
        isComplete
      }
    }))
    setSelectedPlayer(null)
  }

  const getPlayersByRow = (rowIndex: number, players: PlayerData[]) => {
    const rowCounts = formationRows
    let startIndex = 0
    for (let i = 0; i < rowIndex; i++) {
      startIndex += rowCounts[i]
    }
    return players.slice(startIndex, startIndex + rowCounts[rowIndex])
  }

  const generateCopyableTable = () => {
    const gameData = {
      game,
      team,
      formation,
      lineup: players.map(player => player.name)
    }

    if (!gameData) return '';

    let table = `${gameData.game}\n${gameData.team}\n${gameData.formation}\n\nSCORE: ${Object.keys(playerStates).length}\n\n`;
    const formationArray = gameData.formation.split('-').map(Number);
    const rows: string[][] = [];
    let index = 0;

    // First row for the goalkeeper
    rows.push([gameData.lineup[0]]);

    for (const num of formationArray) {
      const row = [];
      for (let i = 0; i < num; i++) {
        row.push(gameData.lineup[index + 1]);
        index++;
      }
      rows.push(row);
    }

    // Function to generate row with correct player placement and green padding
    const generateRow = (players: string[]) => {
      let rowString = '';

      switch (players.length) {
        case 0:
          rowString = '🟩🟩🟩🟩🟩🟩🟩🟩🟩';
          break;
        case 1:
          rowString = '🟩🟩🟩🟩' + getPlayerEmoji(players[0]) + '🟩🟩🟩🟩';
          break;
        case 2:
          rowString = '🟩🟩🟩' + getPlayerEmoji(players[0]) + '🟩' + getPlayerEmoji(players[1]) + '🟩🟩🟩';
          break;
        case 3:
          rowString = '🟩🟩' + getPlayerEmoji(players[0]) + '🟩' + getPlayerEmoji(players[1]) + '🟩' + getPlayerEmoji(players[2]) + '🟩🟩';
          break;
        case 4:
          rowString = '🟩' + getPlayerEmoji(players[0]) + '🟩' + getPlayerEmoji(players[1]) + '🟩' + getPlayerEmoji(players[2]) + '🟩' + getPlayerEmoji(players[3]) + '🟩';
          break;
        case 5:
          rowString = getPlayerEmoji(players[0]) + '🟩' + getPlayerEmoji(players[1]) + '🟩' + getPlayerEmoji(players[2]) + '🟩' + getPlayerEmoji(players[3]) + '🟩' + getPlayerEmoji(players[4]);
          break;
        default:
          break;
      }

      return rowString;
    };

    // Helper function to get player emoji based on their state
    const getPlayerEmoji = (player: string) => {
      const playerId = players.find(p => p.name === player)?.id
      const playerState = playerId !== undefined ? playerStates[playerId] : undefined;

      if (playerState?.isComplete) {
        return `${playerState.guesses.length}️⃣`; // Number emoji based on attempts
      } else if (playerState?.guesses.length === 8) {
        return '❌'; // X for players with 9 attempts
      } else {
        return '❔'; // Question mark for unattempted players
      }
    };

    // Generate emoji table based on player state
    rows.forEach((row, rowIndex) => {
      if (rowIndex > 0) table += '🟩🟩🟩🟩🟩🟩🟩🟩🟩\n'; // Add green row between rows
      table += generateRow(row) + '\n'; // Centered player row
    });

    return table;
  };

  const copyTableToClipboard = () => {
    const table = generateCopyableTable();
  
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(table)
        .catch((err) => console.error('Failed to copy table using clipboard API:', err));
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = table;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        document.execCommand('copy');
        console.log('Table copied using fallback method!');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
  
      document.body.removeChild(textArea);
      }
      setShowCopyModal(false)
    };

  return (
    <div className="relative h-full w-full mx-auto overflow-hidden rounded-lg bg-[#0f8028] p-2 px-8 sm:p-6 sm:px-12">
    {/* Pitch Markings */}
    <div className="absolute inset-0 z-0">
      {/* Center Circle */}
      <div className="absolute left-1/2 top-1/2 h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20" />
      {/* Center Line */}
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/20" />
      {/* Penalty Areas */}
      <div className="absolute left-1/2 top-0 h-[25%] w-[40%] -translate-x-1/2 border-2 border-white/20" />
      <div className="absolute bottom-0 left-1/2 h-[25%] w-[40%] -translate-x-1/2 border-2 border-white/20" />
      {/* Goal Areas */}
      <div className="absolute left-1/2 top-0 h-[12%] w-[20%] -translate-x-1/2 border-2 border-white/20" />
      <div className="absolute bottom-0 left-1/2 h-[12%] w-[20%] -translate-x-1/2 border-2 border-white/20" />
    </div>
    {/* Players Grid */}
    <div 
      className="relative z-10 grid h-full" 
      style={{ 
        gridTemplateRows: `repeat(${formationRows.length}, 1fr)`,
        gap: "0.25rem"
      }}
    >
      {formationRows.map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-around px-2 sm:px-4">
          {getPlayersByRow(rowIndex, players).map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              state={playerStates[player.id]}
              onClick={() => setSelectedPlayer(player)}
            />
          ))}
        </div>
      ))}
    </div>
    <>
    {/* Info Button - Left */}
    <div className="absolute top-4 left-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="bg-green-800/50 hover:bg-green-700/50 text-white border-white/20"
        onClick={() => setShowModal(true)}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>

    {/* Share Button - Right */}
    <div className="absolute top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="bg-green-800/50 hover:bg-green-700/50 text-white border-white/20"
        onClick={() => setShowCopyModal(true)}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  </>

    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="font-mono sm:max-w-md bg-gray-900 border border-white/20 flex flex-col items-center">
        <div className="pb-2">
          <Trophy className="h-8 w-8 text-green-500 mx-auto" />
          <div className="text-center">
            <h2 className="text-lg font-bold text-white">{game}</h2>
            <p className="text-sm text-gray-400">
              {team} • {formation}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>

      <Dialog open={showCopyModal} onOpenChange={setShowCopyModal}>
        <DialogContent className="font-mono sm:max-w-md flex flex-col items-center bg-gray-900 border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Share Results</DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap break-words text-sm text-center text-white/90 bg-gray-800/50 p-4 rounded-lg w-full">
            {generateCopyableTable()}
          </pre>
          <Button 
            onClick={copyTableToClipboard}
            className="bg-green-800 hover:bg-green-700 text-white"
          >
            Copy to Clipboard
          </Button>
        </DialogContent>
      </Dialog>

      <WordleDialog
        player={selectedPlayer}
        state={selectedPlayer ? playerStates[selectedPlayer.id] : undefined}
        open={!!selectedPlayer}
        onOpenChange={() => setSelectedPlayer(null)}
        onGuessComplete={handleGuessComplete}
      />
    </div>
  )
}