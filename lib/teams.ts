export type TeamConfig = {
  primary: string
  secondary: string
  accent?: string
  pattern?: "solid" | "striped" | "half"
}

export const TEAM_CONFIGS: Record<string, TeamConfig> = {
  // Big 4
  "Galatasaray": { primary: "#A90432", secondary: "#FDB912", pattern: "half" },
  "Fenerbahce": { primary: "#FFED00", secondary: "#002749", pattern: "striped" },
  "Besiktas": { primary: "#FFFFFF", secondary: "#000000", accent: "#E00505", pattern: "striped" },
  "Trabzonspor": { primary: "#4E0727", secondary: "#82C8FC", pattern: "striped" },

  // Others
  "Sivasspor": { primary: "#E00000", secondary: "#FFFFFF", pattern: "striped" },
  "Antalyaspor": { primary: "#FF0000", secondary: "#FFFFFF", pattern: "striped" }, // Often striped
  "Istanbulspor": { primary: "#FFFF00", secondary: "#000000", pattern: "striped" },
  "Kasimpasa": { primary: "#FFFFFF", secondary: "#000040", pattern: "solid" }, // Typically white or navy
  "Hatayspor": { primary: "#780000", secondary: "#FFFFFF", pattern: "solid" },
  "Kayserispor": { primary: "#FF0000", secondary: "#FFFF00", pattern: "solid" },
  "Gaziantep FK": { primary: "#FF0000", secondary: "#000000", pattern: "striped" },
  "Konyaspor": { primary: "#008250", secondary: "#FFFFFF", pattern: "striped" },
  "Alanyaspor": { primary: "#FC5A0E", secondary: "#148736", pattern: "solid" }, // Orange/Green usually solid or distinct
  "Rizespor": { primary: "#1D54AC", secondary: "#00763B", pattern: "striped" },
  "Basaksehir": { primary: "#FF7B0D", secondary: "#000060", pattern: "solid" }, // Orange/Navy
  "Giresunspor": { primary: "#007700", secondary: "#FFFFFF", pattern: "solid" },
  "Altay": { primary: "#000000", secondary: "#FFFFFF", pattern: "striped" }, // Black/White
  "Fatih Karagumruk": { primary: "#BF282A", secondary: "#101010", pattern: "striped" }, // Red/Black
  "Ankaragucu": { primary: "#EFDD00", secondary: "#040D42", pattern: "solid" },
  "Pendikspor": { primary: "#FF0000", secondary: "#FFFFFF", pattern: "solid" },
  "Adana Demirspor": { primary: "#0000FF", secondary: "#000055", pattern: "striped" }, // Light/Dark Blue
  "Goztepe": { primary: "#EE3124", secondary: "#FFE800", pattern: "half" }, // Red/Yellow
  "Samsunspor": { primary: "#EE2E24", secondary: "#FFFFFF", pattern: "solid" },
  "Umraniyespor": { primary: "#DC143C", secondary: "#FFFFFF", pattern: "solid" },
  "Yeni Malatyaspor": { primary: "#F5D20A", secondary: "#000000", pattern: "striped" },
}

// Fallback for unknown teams
export const DEFAULT_TEAM_CONFIG: TeamConfig = {
  primary: "#3b82f6", // Blue-500
  secondary: "#1d4ed8", // Blue-700
  pattern: "solid",
}
