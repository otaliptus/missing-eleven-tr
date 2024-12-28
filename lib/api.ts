import { GameData, PlayerData } from "@/types/game"

export async function getTodaysGame(): Promise<GameData> {
  // This function is no longer used, the data is fetched in app/page.tsx
  // Keeping it here for type compatibility
  return {
    game: "Placeholder Game",
    team: "Placeholder Team",
    formation: "4-4-2",
    lineup: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"]
  }
}

export function parseFormation(formation: string): number[] {
  return formation.split("-").map(Number)
}

export function assignPositions(formation: string, lineup: string[]): PlayerData[] {
  const formationArray = formation.split('-').map(Number);
  const positions: string[] = [];

  // Handle different formations
    if (formationArray.length === 3) {
        positions.push("GK"); // Goalkeeper
        
        // Example for 4-3-3
        if (formation === "4-3-3") {
            positions.push("LB", "CB", "CB", "RB");
            positions.push("CM", "CM", "CM");
            positions.push("LW", "ST", "RW");
        }
        // Example for 4-4-2
        else if (formation === "4-4-2") {
            positions.push("LB", "CB", "CB", "RB");
            positions.push("LM", "CM", "CM", "RM");
            positions.push("ST", "ST");
        }
        // Example for 3-5-2
        else if (formation === "3-5-2") {
            positions.push("CB", "CB", "CB");
            positions.push("LWB", "CM", "CM", "CM", "RWB");
            positions.push("ST", "ST");
        }
        // Example for 3-4-3
        else if (formation === "3-4-3") {
            positions.push("CB", "CB", "CB");
            positions.push("LM", "CM", "CM", "RM");
            positions.push("LW", "ST", "RW");
        }
        // Example for 5-3-2
        else if (formation === "5-3-2") {
            positions.push("LWB", "CB", "CB", "CB", "RWB");
            positions.push("CM", "CM", "CM");
            positions.push("ST", "ST");
        }
        else {
            // Default positions if formation is not recognized
            for (let i = 0; i < lineup.length; i++) {
                positions.push(`P${i + 1}`);
            }
        }
    }  else if (formation === "4-2-3-1") {
      positions.push("GK");
        positions.push("LB", "CB", "CB", "RB");
        positions.push("CDM", "CDM");
        positions.push("LM", "CAM", "RM");
        positions.push("ST");
    } else {
        // Default positions if formation is not recognized
        for (let i = 0; i < lineup.length; i++) {
            positions.push(`P${i + 1}`);
        }
    }


  return lineup.map((name, index) => ({
    id: index,
    name,
    position: positions[index]
  }))
}