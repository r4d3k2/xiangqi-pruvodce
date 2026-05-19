// Detailed monochrome SVG illustrations for the "icon mode" piece display.
// Inspired by play.xiangqi.com. Each icon is drawn as filled paths within a
// 24×24 viewBox, using `fill="currentColor"` so theme colors carry through.
import type { PieceType } from "../../lib/xiangqi";

interface IconProps {
  type: PieceType;
}

const COMMON = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "currentColor",
} as const;

export function PieceIcon({ type }: IconProps) {
  switch (type) {
    case "G":
      // Royal crown — front view, 3 peaks (middle tallest) on a band.
      return (
        <svg {...COMMON}>
          {/* Band base */}
          <path d="M3 17 L21 17 L21 20 L3 20 Z" />
          {/* Three peaks */}
          <path d="M3 17 L5 9 L8 13 L12 4 L16 13 L19 9 L21 17 Z" />
          {/* Jewels on each peak tip */}
          <circle cx="5" cy="8.5" r="1.2" />
          <circle cx="12" cy="3.5" r="1.5" />
          <circle cx="19" cy="8.5" r="1.2" />
        </svg>
      );

    case "A":
      // Mandarin / court official hat — domed cap with a small finial on top.
      return (
        <svg {...COMMON}>
          {/* Brim */}
          <path d="M3 17 L21 17 L21 20 L3 20 Z" />
          {/* Dome */}
          <path d="M5 17 Q5 9 12 8 Q19 9 19 17 Z" />
          {/* Finial / topknot */}
          <rect x="11" y="3" width="2" height="5" />
          <circle cx="12" cy="3" r="1.8" />
        </svg>
      );

    case "E":
      // Elephant head — front view: dome, two flared ears, central trunk, tusks.
      return (
        <svg {...COMMON}>
          {/* Left ear — large flared shape */}
          <path d="M2 9 Q1 14 4 16 Q7 16 8 13 Q8 8 4 7 Q2 7 2 9 Z" />
          {/* Right ear — mirrored */}
          <path d="M22 9 Q23 14 20 16 Q17 16 16 13 Q16 8 20 7 Q22 7 22 9 Z" />
          {/* Head + trunk silhouette (central) */}
          <path
            d="M8 9
               Q8 5 12 5
               Q16 5 16 9
               L16 13
               Q14 13 13.5 14
               L13 19
               L14 22
               L12 22
               L10 22
               L11 19
               L10.5 14
               Q10 13 8 13 Z"
          />
          {/* Eye */}
          <circle cx="10" cy="9" r="0.8" fill="#fff" />
          <circle cx="14" cy="9" r="0.8" fill="#fff" />
          {/* Tusks (small triangles flanking the trunk) */}
          <path d="M9 15 L9 18 L10.5 16 Z" />
          <path d="M15 15 L15 18 L13.5 16 Z" />
        </svg>
      );

    case "H":
      // Horse head in profile — classic knight silhouette facing left.
      return (
        <svg {...COMMON}>
          <path
            d="M16 21
               L16 16
               Q19 14 19 11
               Q19 7 16 6
               L14 4
               Q12 3 11 5
               L10 7
               Q8 8 7 11
               L5 11
               Q4 11 4 12
               Q4 13 6 14
               L7 13
               L8 14
               Q8 16 7 17
               L7 21 Z"
          />
          {/* Eye */}
          <circle cx="13" cy="9" r="0.9" fill="#fff" />
          <circle cx="13" cy="9" r="0.5" />
          {/* Mane notch */}
          <path d="M17 7 L18 5 L19 7 Z" />
        </svg>
      );

    case "R":
      // Rook / castle tower — base wall with crenellations on top.
      return (
        <svg {...COMMON}>
          {/* Battlements */}
          <path
            d="M4 4
               L7 4 L7 6
               L9 6 L9 4
               L11 4 L11 6
               L13 6 L13 4
               L15 4 L15 6
               L17 6 L17 4
               L20 4
               L20 9
               L18 11
               L18 18
               L20 18
               L20 21
               L4 21
               L4 18
               L6 18
               L6 11
               L4 9 Z"
          />
          {/* Arrow-slit window */}
          <rect x="11" y="13" width="2" height="5" fill="#fff" opacity={0.35} />
        </svg>
      );

    case "C":
      // Cannon — wheel with crosshair (xiangqi.com style):
      // a thick ring + crosshair lines + central hub.
      return (
        <svg {...COMMON}>
          {/* Outer ring drawn as donut via even-odd fill */}
          <path
            fillRule="evenodd"
            d="M12 2
               A10 10 0 1 1 12 22
               A10 10 0 1 1 12 2 Z
               M12 6
               A6 6 0 1 0 12 18
               A6 6 0 1 0 12 6 Z"
          />
          {/* Crosshair — horizontal and vertical bars */}
          <rect x="2" y="11" width="20" height="2" />
          <rect x="11" y="2" width="2" height="20" />
          {/* Central hub */}
          <circle cx="12" cy="12" r="2.2" />
        </svg>
      );

    case "S":
      // Soldier — round helmeted head + body silhouette holding a spear.
      return (
        <svg {...COMMON}>
          {/* Helmet plume */}
          <path d="M11 1 L13 1 L13 4 L11 4 Z" />
          {/* Helmet + head */}
          <circle cx="12" cy="7" r="3.5" />
          {/* Body / torso (rounded shoulders, trapezoidal armor) */}
          <path
            d="M6 21
               L6 16
               Q6 11 9 11
               L15 11
               Q18 11 18 16
               L18 21 Z"
          />
          {/* Spear shaft */}
          <rect x="19" y="3" width="1.3" height="18" />
          {/* Spear tip */}
          <path d="M19.6 1 L21 4 L18.3 4 Z" />
        </svg>
      );
  }
}
