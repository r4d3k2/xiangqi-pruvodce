// Simple monochrome SVG icons for the "icon mode" piece display.
// Each icon is drawn into a roughly 24×24 viewBox, colored via `currentColor`.
import type { PieceType } from "../../lib/xiangqi";

interface IconProps {
  type: PieceType;
}

export function PieceIcon({ type }: IconProps) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "G":
      // Crown
      return (
        <svg {...common}>
          <path d="M4 17 L4 9 L8 12 L12 6 L16 12 L20 9 L20 17 Z" />
          <line x1="4" y1="19" x2="20" y2="19" />
        </svg>
      );
    case "A":
      // Diagonal cross — diagonal movement
      return (
        <svg {...common}>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      );
    case "E":
      // Diamond
      return (
        <svg {...common}>
          <path d="M12 4 L20 12 L12 20 L4 12 Z" />
        </svg>
      );
    case "H":
      // Stylized horse head
      return (
        <svg {...common}>
          <path d="M7 19 L7 13 Q7 7 13 6 L16 6 L16 9 L14 10 L17 12 L17 17 Q17 19 15 19 Z" />
          <circle cx="14" cy="9" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "R":
      // Cart — rectangle with wheels
      return (
        <svg {...common}>
          <rect x="4" y="7" width="16" height="8" rx="1" />
          <circle cx="8" cy="18" r="2" />
          <circle cx="16" cy="18" r="2" />
        </svg>
      );
    case "C":
      // Cannon — circle with dot (barrel)
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "S":
      // Soldier — upward arrow / triangle
      return (
        <svg {...common}>
          <path d="M12 5 L19 18 L5 18 Z" />
        </svg>
      );
  }
}
