import { useMemo } from "react";
import type { Board, Coord } from "../../lib/xiangqi";
import { COLS, ROWS } from "../../lib/xiangqi";
import { pieceChar } from "../../data/pieces";
import { PieceIcon } from "./PieceIcons";

export type PieceDisplay = "char" | "icon";

interface XiangqiBoardProps {
  board: Board;
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

const PIECE_OUTER_R = 19;
const PIECE_INNER_R = 16;

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
  const stroke = "#2b1d0c";
  const sw = 1.2;
  return (
    <g stroke={stroke} strokeWidth={sw} strokeLinecap="round">
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

export function XiangqiBoard({
  board,
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
    // Rows visually top→bottom; default (red bottom): row 0 = "10" .. row 9 = "1"
    // Flipped: row 0 → "1" .. row 9 → "10"
    return Array.from({ length: ROWS }, (_, r) =>
      flipped ? `${r + 1}` : `${ROWS - r}`,
    );
  }, [flipped]);

  const cannonMarks: Coord[] = [
    { row: 2, col: 1 },
    { row: 2, col: 7 },
    { row: 7, col: 1 },
    { row: 7, col: 7 },
  ];
  const soldierMarks: Coord[] = [];
  for (const r of [3, 6]) {
    for (const c of [0, 2, 4, 6, 8]) {
      // Edge soldiers have only 3 brackets — we still render full to keep simple
      soldierMarks.push({ row: r, col: c });
    }
  }

  const isHighlight = (kind: "from" | "to" | "sel" | "hint" | "err", row: number, col: number) => {
    const c =
      kind === "from"
        ? fromHighlight
        : kind === "to"
          ? toHighlight
          : kind === "sel"
            ? selectedSquare
            : kind === "hint"
              ? hintSquare
              : errorSquare;
    return c && c.row === row && c.col === col;
  };

  return (
    <div className="xq-board-wrap" style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", borderRadius: 14, overflow: "visible" }}
        role="img"
        aria-label="Xiangqi deska"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C88018" />
            <stop offset="100%" stopColor="#8A5810" />
          </linearGradient>
          <radialGradient id="redOuter" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#9E1414" />
            <stop offset="100%" stopColor="#5C0000" />
          </radialGradient>
          <radialGradient id="redInner" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF8E1" />
            <stop offset="100%" stopColor="#F3DDA9" />
          </radialGradient>
          <radialGradient id="blackOuter" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1f2a1f" />
            <stop offset="100%" stopColor="#08110a" />
          </radialGradient>
          <radialGradient id="blackInner" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1f3a1f" />
            <stop offset="100%" stopColor="#0d1e0d" />
          </radialGradient>
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
              stroke="#2b1d0c"
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
                stroke="#2b1d0c"
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
                stroke="#2b1d0c"
                strokeWidth={1.4}
              />
              <line
                x1={x}
                y1={RIVER_BOT}
                x2={x}
                y2={PAD + (ROWS - 1) * CELL}
                stroke="#2b1d0c"
                strokeWidth={1.4}
              />
            </g>
          );
        })}

        {/* Palace diagonals — black palace (top, rows 0-2 cols 3-5) */}
        <g stroke="#2b1d0c" strokeWidth={1.2}>
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
          fill="#3a2410"
          opacity={0.75}
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

        {/* Highlights: from / to / sel / hint / err */}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((__, c) => {
            const { x, y } = intersection(r, c, flipped);
            const els: React.ReactNode[] = [];
            if (isHighlight("from", r, c)) {
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
            if (isHighlight("to", r, c)) {
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
            if (isHighlight("hint", r, c)) {
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
            return <g key={`hl${r}-${c}`}>{els}</g>;
          }),
        )}

        {/* Pieces & click targets */}
        {board.map((row, r) =>
          row.map((piece, c) => {
            const { x, y } = intersection(r, c, flipped);
            const selected = isHighlight("sel", r, c);
            const errored = isHighlight("err", r, c);
            const clickable = !!onCellClick;
            return (
              <g
                key={`p${r}-${c}`}
                style={{ cursor: clickable ? "pointer" : "default" }}
                onClick={onCellClick ? () => onCellClick(r, c) : undefined}
              >
                {/* invisible hit area */}
                <rect
                  x={x - CELL / 2}
                  y={y - CELL / 2}
                  width={CELL}
                  height={CELL}
                  fill="transparent"
                />
                {piece && (
                  <g
                    className={errored ? "xq-shake" : undefined}
                    transform={selected ? `translate(${x},${y}) scale(1.08)` : `translate(${x},${y})`}
                    style={{ transition: "transform 0.18s ease" }}
                  >
                    {/* selected glow ring */}
                    {selected && (
                      <circle
                        r={PIECE_OUTER_R + 3}
                        fill="none"
                        stroke="#ffd277"
                        strokeWidth={2}
                      />
                    )}
                    <circle
                      r={PIECE_OUTER_R}
                      fill={
                        piece.side === "red"
                          ? "url(#redOuter)"
                          : "url(#blackOuter)"
                      }
                    />
                    <circle
                      r={PIECE_INNER_R}
                      fill={
                        piece.side === "red"
                          ? "url(#redInner)"
                          : "url(#blackInner)"
                      }
                      stroke={piece.side === "red" ? "#5C0000" : "#08110a"}
                      strokeWidth={1}
                    />
                    {pieceDisplay === "char" ? (
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="Noto Serif, Georgia, serif"
                        fontWeight={700}
                        fontSize={20}
                        fill={piece.side === "red" ? "#8B0000" : "#88C088"}
                      >
                        {pieceChar(piece.type, piece.side)}
                      </text>
                    ) : (
                      <g
                        style={{
                          color: piece.side === "red" ? "#8B0000" : "#88C088",
                        }}
                        transform="translate(-11,-11)"
                      >
                        <PieceIcon type={piece.type} />
                      </g>
                    )}
                  </g>
                )}
              </g>
            );
          }),
        )}

        {/* File labels (a-i) below */}
        {fileLabels.map((l, i) => (
          <text
            key={`fl${i}`}
            x={PAD + i * CELL}
            y={H - 12}
            textAnchor="middle"
            fontFamily="Noto Serif, Georgia, serif"
            fontSize={11}
            fill="#3a2410"
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
            fill="#3a2410"
          >
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}
