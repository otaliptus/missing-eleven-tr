import { cn, normalizePlayerName } from "@/lib/utils"
import type { PlayerData, PlayerState } from "@/types/game"
import { TEAM_CONFIGS, DEFAULT_TEAM_CONFIG } from "@/lib/teams"

interface JerseyProps {
  player: PlayerData
  state?: PlayerState
  className?: string
  team?: string
}

export function Jersey({ player, state, className, team }: JerseyProps) {
  const guessCount = state?.guesses?.length ?? 0
  const isFailed = guessCount >= 8 && !state?.isComplete
  const isSolved = !!state?.isComplete

  const isGoalkeeper = player.position === "GK"
  const teamConfig = team && TEAM_CONFIGS[team] ? TEAM_CONFIGS[team] : DEFAULT_TEAM_CONFIG
  
  // Create gradient ID based on team colors to be unique for this team
  // Just using "team-gradient" with a salt if needed, but since all players share same team, one ID is fine.
  // We'll append team name to ID to handle potential hydration mismatches if different teams were shown (not here though).
  const teamId = team ? team.replace(/\s+/g, '-') : 'default'
  const gradId = `grad-${teamId}`
  
  // Helper to adjust color brightness for the gradient
  // Simplistic approach: just use the primary color directly and adding stops 
  // We can let the browser interpolate or just use primary color in middle and slightly modulated version at ends?
  // For better results without a color manipulation library, we can just use the Primary Color as the base
  // and use a white/black overlay gradient for 3D effect.
  // Actually, we can just use the primary color.
  
  const primaryColor = isGoalkeeper ? "#0EA5E9" : teamConfig.primary
  const secondaryColor = isGoalkeeper ? "#082F49" : teamConfig.secondary
  const pattern = isGoalkeeper ? "solid" : (teamConfig.pattern ?? "solid")

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 100 110"
        className={cn(
          "w-full h-full transition-all duration-300 hover:scale-105"
        )}
        style={{
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
        }}
      >
        <defs>
          {/* Dynamic Team Gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.9" />
          </linearGradient>

          {/* Shine effect */}
          <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Stripes Pattern */}
          <pattern id={`stripes-${teamId}`} x="0" y="0" width="20" height="100" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="10" height="100" fill={primaryColor} />
            <rect x="10" y="0" width="10" height="100" fill={secondaryColor} />
          </pattern>
        </defs>

        {/* Main Shirt Body */}
        <path
          d="M12 22 
             L22 8 
             Q50 18 78 8 
             L88 22 
             L95 38 
             L82 44 
             L82 95 
             Q50 102 18 95 
             L18 44 
             L5 38 
             Z"
          fill={pattern === 'striped' ? `url(#stripes-${teamId})` : `url(#${gradId})`}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1"
        />
        
        {/* Half Pattern Overlay if needed */}
        {pattern === 'half' && (
           <path
             d="M50 8 
                L50 102
                Q18 95 18 95
                L18 44 
                L5 38
                L12 22
                L22 8 
                Q50 18 50 18 Z"
             fill={primaryColor}
            />
        )}
        {pattern === 'half' && (
           <path
             d="M50 8 
                L50 102
                Q82 95 82 95
                L82 44 
                L95 38
                L88 22 
                L78 8 
                Q50 18 50 18 Z"
             fill={secondaryColor}
            />
        )}

        {/* Shirt Shine Overlay for 3D effect */}
        <path
          d="M12 22 
             L22 8 
             Q50 18 78 8 
             L88 22 
             L95 38 
             L82 44 
             L82 95 
             Q50 102 18 95 
             L18 44 
             L5 38 
             Z"
          fill="url(#shine)"
          style={{ mixBlendMode: 'soft-light' }}
        />

        {/* Collar - Using Secondary Color */}
        <path
          d="M38 12 Q50 22 62 12"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Collar inner detail */}
        <ellipse cx="50" cy="16" rx="8" ry="4" fill="rgba(0,0,0,0.15)" />

        {/* Sleeve edges - Using Secondary Color */}
        <path d="M10 24 L24 6" stroke={secondaryColor} strokeWidth="3" opacity="0.8" />
        <path d="M90 24 L76 6" stroke={secondaryColor} strokeWidth="3" opacity="0.8" />
        
        {/* Bottom hem highlight */}
        <path
          d="M18 95 Q50 102 82 95"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />

        {/* Question Mark / Check / X */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          stroke="rgba(0,0,0,0.7)"
          strokeWidth="3"
          paintOrder="stroke"
          fontSize="32"
          fontWeight="bold"
          style={{ 
            textShadow: "0 2px 4px rgba(0,0,0,0.6)",
            fontFamily: "system-ui, sans-serif"
          }}
        >
          {isSolved ? "✓" : isFailed ? "✗" : "?"}
        </text>

        {/* Number Badge (if attempts exist) */}
        {state?.guesses?.length ? (
          <g>
            <circle
              cx="82"
              cy="18"
              r="12"
              fill={isSolved ? "#059669" : isFailed ? "#dc2626" : "#d97706"}
              stroke="white"
              strokeWidth="2"
            />
            <text
              x="82"
              y="19"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="13"
              fontWeight="bold"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {state.guesses.length}
            </text>
          </g>
        ) : null}
      </svg>

      {/* Name/Length Label Below */}
      <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center">
        {(isSolved || isFailed) ? (
          <div className="bg-black/70 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/20 shadow-lg max-w-full truncate">
            <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-[0.03em] sm:tracking-wide leading-tight">
              {player.name}
            </span>
          </div>
        ) : (
          <div className="bg-black/70 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
            <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide">
              {normalizePlayerName(player.name).length}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
