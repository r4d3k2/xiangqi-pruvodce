import { useMemo } from "react";
import type { Board, Coord, TrackedPiece } from "../../lib/xiangqi";
import { COLS, ROWS } from "../../lib/xiangqi";
import { pieceChar } from "../../data/pieces";
import { PieceIcon } from "./PieceIcons";

export type PieceDisplay = "char" | "icon";

interface XiangqiBoardProps {
  /** Board grid (for click hit-detection and as fallback piece source) */
  board: Board;
  /** Tracked pieces — when provided, used for keyed rendering with animation */
  pieces?: TrackedPiece[];
  /** Whether piece transforms should transition smoothly (true) or snap (false) */
  animate?: boolean;
  flipped?: boolean;
  pieceDisplay?: PieceDisplay;
  fromHighlight?: Coord | null;
  toHighlight?: Coord | null;
  selectedSquare?: Coord | null;
  hintSquare?: Coord | null;
  errorSquare?: Coord | null;
  onCellClick?: (row: number, col: number) => void;
}

const CELL = 44;
const PAD = 36;
const W = PAD * 2 + (COLS - 1) * CELL; // 424
const H = PAD * 2 + (ROWS - 1) * CELL; // 468
const RIVER_TOP = PAD + 4 * CELL;
const RIVER_BOT = PAD + 5 * CELL;

const PIECE_OUTER_R = 20;
const PIECE_INNER_R = 17;
const PIECE_RING_R = 15.5;
const PIECE_FONT_FAMILY =
  '"Noto Serif SC", "SimSun", "KaiTi", Noto Serif, Georgia, serif';

const PIECE_TRANSITION_ON = "transform 300ms ease-out";
const PIECE_TRANSITION_OFF = "none";

function intersection(row: number, col: number, flipped: boolean) {
  const r = flipped ? ROWS - 1 - row : row;
  const c = flipped ? COLS - 1 - col : col;
  return {
    x: PAD + c * CELL,
    y: PAD + r * CELL,
  };
}

// Small corner-tick marks drawn around board intersections like soldiers/cannons
function CornerTicks({ x, y }: { x: number; y: number }) {
  const off = 4;
  const len = 5;
  const sw = 1.2;
  return (
    <g stroke="var(--board-line)" strokeWidth={sw} strokeLinecap="round">
      {/* top-left bracket */}
      <line x1={x - off} y1={y - off - len} x2={x - off} y2={y - off} />
      <line x1={x - off - len} y1={y - off} x2={x - off} y2={y - off} />
      {/* top-right */}
      <line x1={x + off} y1={y - off - len} x2={x + off} y2={y - off} />
      <line x1={x + off} y1={y - off} x2={x + off + len} y2={y - off} />
      {/* bottom-left */}
      <line x1={x - off} y1={y + off} x2={x - off} y2={y + off + len} />
      <line x1={x - off - len} y1={y + off} x2={x - off} y2={y + off} />
      {/* bottom-right */}
      <line x1={x + off} y1={y + off} x2={x + off} y2={y + off + len} />
      <line x1={x + off} y1={y + off} x2={x + off + len} y2={y + off} />
    </g>
  );
}

// Fall-back: when `pieces` aren't supplied, synthesize an unstable list
// from the board grid. Used by callers (e.g. PieceCard mini-board) that
// don't need animation.
function piecesFromBoard(board: Board): TrackedPiece[] {
  const arr: TrackedPiece[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (cell) {
        arr.push({
          id: `${cell.side[0]}${cell.type}@${r}-${c}`,
          type: cell.type,
          side: cell.side,
          row: r,
          col: c,
        });
      }
    }
  }
  return arr;
}

export function XiangqiBoard({
  board,
  pieces,
  animate = true,
  flipped = false,
  pieceDisplay = "char",
  fromHighlight = null,
  toHighlight = null,
  selectedSquare = null,
  hintSquare = null,
  errorSquare = null,
  onCellClick,
}: XiangqiBoardProps) {
  // Pre-compute label arrays (flip-aware)
  const fileLabels = useMemo(() => {
    const base = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
    return flipped ? [...base].reverse() : base;
  }, [flipped]);

  const rankLabels = useMemo(() => {
    return Array.from({ length: ROWS }, (_, r) =>
      flipped ? `${r + 1}` : `${ROWS - r}`,
    );
  }, [flipped]);

  // Use tracked pieces when available (animatable); otherwise derive from grid.
  const renderedPieces = useMemo(
    () => pieces ?? piecesFromBoard(board),
    [pieces, board],
  );

  const cannonMarks: Coord[] = [
    { row: 2, col: 1 },
    { row: 2, col: 7 },
    { row: 7, col: 1 },
    { row: 7, col: 7 },
  ];
  const soldierMarks: Coord[] = [];
  for (const r of [3, 6]) {
    for (const c of [0, 2, 4, 6, 8]) {
      soldierMarks.push({ row: r, col: c });
    }
  }

  const at = (coord: Coord | null, r: number, c: number) =>
    !!coord && coord.row === r && coord.col === c;

  const transitionStyle = animate ? PIECE_TRANSITION_ON : PIECE_TRANSITION_OFF;

  return (
    <div className="xq-board-wrap" style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", borderRadius: 14, overflow: "visible" }}
        role="img"
        aria-label="Xiangqi deska"
      >
        {/* Defs: theme-adaptive board gradient + piece drop shadow */}
        <defs>
          <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--board-grad-1)" />
            <stop offset="100%" stopColor="var(--board-grad-2)" />
          </linearGradient>
          <filter id="pieceShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="1.5"
              floodColor="#000"
              floodOpacity="0.4"
            />
          </filter>
        </defs>

        <rect x={0} y={0} width={W} height={H} rx={10} fill="url(#boardGrad)" />

        {/* Horizontal lines: 10 */}
        {Array.from({ length: ROWS }, (_, r) => {
          const y = PAD + r * CELL;
          return (
            <line
              key={`h${r}`}
              x1={PAD}
              y1={y}
              x2={PAD + (COLS - 1) * CELL}
              y2={y}
              stroke="var(--board-line)"
              strokeWidth={1.4}
            />
          );
        })}

        {/* Vertical lines */}
        {Array.from({ length: COLS }, (_, c) => {
          const x = PAD + c * CELL;
          if (c === 0 || c === COLS - 1) {
            return (
              <line
                key={`v${c}`}
                x1={x}
                y1={PAD}
                x2={x}
                y2={PAD + (ROWS - 1) * CELL}
                stroke="var(--board-line)"
                strokeWidth={1.4}
              />
            );
          }
          // Broken at river
          return (
            <g key={`v${c}`}>
              <line
                x1={x}
                y1={PAD}
                x2={x}
                y2={RIVER_TOP}
                stroke="var(--board-line)"
                strokeWidth={1.4}
              />
              <line
                x1={x}
                y1={RIVER_BOT}
                x2={x}
                y2={PAD + (ROWS - 1) * CELL}
                stroke="var(--board-line)"
                strokeWidth={1.4}
              />
            </g>
          );
        })}

        {/* Palace diagonals — black palace (top, rows 0-2 cols 3-5) */}
        <g stroke="var(--board-line)" strokeWidth={1.2}>
          <line
            x1={PAD + 3 * CELL}
            y1={PAD + 0 * CELL}
            x2={PAD + 5 * CELL}
            y2={PAD + 2 * CELL}
          />
          <line
            x1={PAD + 5 * CELL}
            y1={PAD + 0 * CELL}
            x2={PAD + 3 * CELL}
            y2={PAD + 2 * CELL}
          />
          {/* Red palace (bottom rows 7-9 cols 3-5) */}
          <line
            x1={PAD + 3 * CELL}
            y1={PAD + 7 * CELL}
            x2={PAD + 5 * CELL}
            y2={PAD + 9 * CELL}
          />
          <line
            x1={PAD + 5 * CELL}
            y1={PAD + 7 * CELL}
            x2={PAD + 3 * CELL}
            y2={PAD + 9 * CELL}
          />
        </g>

        {/* River text */}
        <g
          fontFamily="Noto Serif, Georgia, serif"
          fontSize="20"
          fill="var(--board-river-text)"
          opacity={0.85}
          letterSpacing="6"
        >
          <text
            x={PAD + 1.6 * CELL}
            y={(RIVER_TOP + RIVER_BOT) / 2 + 6}
            textAnchor="middle"
          >
            楚 河
          </text>
          <text
            x={PAD + 6.4 * CELL}
            y={(RIVER_TOP + RIVER_BOT) / 2 + 6}
            textAnchor="middle"
          >
            漢 界
          </text>
        </g>

        {/* Corner brackets for cannons and edge soldiers */}
        {[...cannonMarks, ...soldierMarks].map((m, i) => {
          const { x, y } = intersection(m.row, m.col, flipped);
          return <CornerTicks key={`mk${i}`} x={x} y={y} />;
        })}

        {/* Highlights: from / to / hint (do not depend on piece identity) */}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((__, c) => {
            const { x, y } = intersection(r, c, flipped);
            const els: React.ReactNode[] = [];
            if (at(fromHighlight, r, c)) {
              els.push(
                <circle
                  key={`fh${r}-${c}`}
                  cx={x}
                  cy={y}
                  r={PIECE_OUTER_R + 2}
                  fill="rgba(255, 235, 180, 0.18)"
                  stroke="rgba(255, 235, 180, 0.35)"
                  strokeWidth={1}
                />,
              );
            }
            if (at(toHighlight, r, c)) {
              els.push(
                <circle
                  key={`th${r}-${c}`}
                  cx={x}
                  cy={y}
                  r={PIECE_OUTER_R + 3}
                  fill="rgba(255, 196, 84, 0.22)"
                  stroke="rgba(255, 196, 84, 0.75)"
                  strokeWidth={2}
                />,
              );
            }
            if (at(hintSquare, r, c)) {
              els.push(
                <circle
                  key={`hi${r}-${c}`}
                  cx={x}
                  cy={y}
                  r={PIECE_OUTER_R + 4}
                  fill="none"
                  stroke="#ffe28a"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />,
              );
            }
            return els.length ? <g key={`hl${r}-${c}`}>{els}</g> : null;
          }),
        )}

        {/* Click hit targets — separate from pieces so click detection works
            even on empty squares (needed in practice mode for "move here"). */}
        {onCellClick &&
          Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((__, c) => {
              const { x, y } = intersection(r, c, flipped);
              return (
                <rect
                  key={`hit${r}-${c}`}
                  x={x - CELL / 2}
                  y={y - CELL / 2}
                  width={CELL}
                  height={CELL}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onClick={() => onCellClick(r, c)}
                />
              );
            }),
          )}

        {/* Pieces — rendered with stable keys to enable CSS transitions.
            pointer-events:none is critical so clicks on a piece pass through
            to the hit-target rect below (otherwise pieces would absorb the
            click and selection in practice mode would never trigger). */}
        {renderedPieces.map((piece) => {
          const { x, y } = intersection(piece.row, piece.col, flipped);
          const selected = at(selectedSquare, piece.row, piece.col);
          const errored = at(errorSquare, piece.row, piece.col);
          return (
            <g
              key={piece.id}
              transform={`translate(${x},${y})`}
              style={{ transition: transitionStyle, pointerEvents: "none" }}
            >
              <g
                className={errored ? "xq-shake" : undefined}
                transform={selected ? "scale(1.08)" : undefined}
                style={{ transition: "transform 0.18s ease" }}
              >
                {selected && (
                  <circle
                    r={PIECE_OUTER_R + 3}
                    fill="none"
                    stroke="#ffd277"
                    strokeWidth={2}
                  />
                )}
                <g filter="url(#pieceShadow)">
                  <circle
                    r={PIECE_OUTER_R}
                    fill={`var(--piece-${piece.side}-outer)`}
                  />
                  <circle
                    r={PIECE_INNER_R}
                    fill={`var(--piece-${piece.side}-inner)`}
                    stroke={`var(--piece-${piece.side}-outer)`}
                    strokeWidth={1}
                  />
                  <circle
                    r={PIECE_RING_R}
                    fill="none"
                    stroke={`var(--piece-${piece.side}-text)`}
                    strokeOpacity={0.3}
                    strokeWidth={1}
                  />
                </g>
                {pieceDisplay === "char" ? (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={PIECE_FONT_FAMILY}
                    fontWeight={900}
                    fontSize={19}
                    letterSpacing="-0.5"
                    fill={`var(--piece-${piece.side}-text)`}
                    style={{ pointerEvents: "none" }}
                  >
                    {pieceChar(piece.type, piece.side)}
                  </text>
                ) : (
                  <g
                    style={{
                      color: `var(--piece-${piece.side}-text)`,
                      pointerEvents: "none",
                    }}
                    transform="translate(-11,-11)"
                  >
                    <PieceIcon type={piece.type} />
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* File labels (a-i) below */}
        {fileLabels.map((l, i) => (
          <text
            key={`fl${i}`}
            x={PAD + i * CELL}
            y={H - 12}
            textAnchor="middle"
            fontFamily="Noto Serif, Georgia, serif"
            fontSize={11}
            fill="var(--board-label-text)"
          >
            {l}
          </text>
        ))}

        {/* Rank labels (10..1 or flipped) */}
        {rankLabels.map((l, i) => (
          <text
            key={`rl${i}`}
            x={14}
            y={PAD + i * CELL + 4}
            textAnchor="middle"
            fontFamily="Noto Serif, Georgia, serif"
            fontSize={11}
            fill="var(--board-label-text)"
          >
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}
