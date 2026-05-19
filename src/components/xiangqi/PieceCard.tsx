import { PIECES, type MoveDiagram, type PieceInfo } from "../../data/pieces";
import { PieceIcon } from "./PieceIcons";

interface PieceCardProps {
  type: PieceInfo["type"];
}

const CELL = 28;
const PAD = 14;

const PIECE_FONT_FAMILY =
  '"Noto Serif SC", "SimSun", "KaiTi", Noto Serif, Georgia, serif';

function StaticPiece({
  type,
  side,
  size = 44,
}: {
  type: PieceInfo["type"];
  side: "red" | "black";
  size?: number;
}) {
  const r = size / 2;
  const inner = r - 3;
  const ringR = r - 4.5;
  const info = PIECES[type];
  const text = side === "red" ? info.redChar : info.blackChar;
  const shadowId = `staticPieceShadow-${size}`;
  return (
    <svg width={size} height={size} viewBox={`-${r} -${r} ${size} ${size}`}>
      <defs>
        <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="1.5"
            floodColor="#000"
            floodOpacity="0.4"
          />
        </filter>
      </defs>
      <g filter={`url(#${shadowId})`}>
        <circle r={r - 1} fill={`var(--piece-${side}-outer)`} />
        <circle
          r={inner}
          fill={`var(--piece-${side}-inner)`}
          stroke={`var(--piece-${side}-outer)`}
          strokeWidth={1}
        />
        <circle
          r={ringR}
          fill="none"
          stroke={`var(--piece-${side}-text)`}
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      </g>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={PIECE_FONT_FAMILY}
        fontWeight={900}
        fontSize={size * 0.5}
        letterSpacing="-0.5"
        fill={`var(--piece-${side}-text)`}
      >
        {text}
      </text>
    </svg>
  );
}

/** A small piece silhouette drawn at a board intersection. */
function MiniPiece({
  cx,
  cy,
  side,
  char,
}: {
  cx: number;
  cy: number;
  side: "red" | "black";
  char: string;
}) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r={11} fill={`var(--piece-${side}-outer)`} />
      <circle
        r={9}
        fill={`var(--piece-${side}-inner)`}
        stroke={`var(--piece-${side}-outer)`}
        strokeWidth={1}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={PIECE_FONT_FAMILY}
        fontWeight={900}
        fontSize={12}
        letterSpacing="-0.5"
        fill={`var(--piece-${side}-text)`}
      >
        {char}
      </text>
    </g>
  );
}

function ForbiddenX({ cx, cy, size = 8 }: { cx: number; cy: number; size?: number }) {
  return (
    <g
      stroke="var(--bad)"
      strokeWidth={1.8}
      strokeLinecap="round"
      transform={`translate(${cx}, ${cy})`}
    >
      <line x1={-size} y1={-size} x2={size} y2={size} />
      <line x1={size} y1={-size} x2={-size} y2={size} />
    </g>
  );
}

function Diagram({
  diagram: d,
  pieceChar,
  pieceSide = "red",
}: {
  diagram: MoveDiagram;
  pieceChar: string;
  pieceSide?: "red" | "black";
}) {
  const w = PAD * 2 + (d.cols - 1) * CELL;
  const h = PAD * 2 + (d.rows - 1) * CELL;
  const pieceX = PAD + d.pieceCol * CELL;
  const pieceY = PAD + d.pieceRow * CELL;
  const gradId = `miniBoardGrad-${d.cols}x${d.rows}-${d.pieceRow}-${d.pieceCol}-${d.label ?? ""}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h}`}
        style={{
          display: "block",
          borderRadius: 8,
          maxWidth: 200,
        }}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--board-grad-1)" />
            <stop offset="100%" stopColor="var(--board-grad-2)" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={w} height={h} rx={6} fill={`url(#${gradId})`} />

        {/* Horizontal lines */}
        {Array.from({ length: d.rows }, (_, r) => (
          <line
            key={`h${r}`}
            x1={PAD}
            y1={PAD + r * CELL}
            x2={PAD + (d.cols - 1) * CELL}
            y2={PAD + r * CELL}
            stroke="var(--board-line)"
            strokeWidth={1}
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: d.cols }, (_, c) => (
          <line
            key={`v${c}`}
            x1={PAD + c * CELL}
            y1={PAD}
            x2={PAD + c * CELL}
            y2={PAD + (d.rows - 1) * CELL}
            stroke="var(--board-line)"
            strokeWidth={1}
          />
        ))}

        {/* River */}
        {d.river && (
          <g>
            <rect
              x={PAD - 1}
              y={PAD + (d.river.afterRow + 0.5) * CELL - 4}
              width={(d.cols - 1) * CELL + 2}
              height={8}
              fill="var(--board-river-text)"
              opacity={0.25}
            />
            <text
              x={w / 2}
              y={PAD + (d.river.afterRow + 0.5) * CELL + 4}
              textAnchor="middle"
              fontFamily="Noto Serif, Georgia, serif"
              fontSize={10}
              fill="var(--board-river-text)"
              opacity={0.85}
            >
              楚 河 漢 界
            </text>
          </g>
        )}

        {/* Palace box + diagonals */}
        {d.palace && (
          <g stroke="var(--board-line)" strokeWidth={1} fill="none">
            <line
              x1={PAD + d.palace.col * CELL}
              y1={PAD + d.palace.row * CELL}
              x2={PAD + (d.palace.col + d.palace.cols - 1) * CELL}
              y2={PAD + (d.palace.row + d.palace.rows - 1) * CELL}
            />
            <line
              x1={PAD + (d.palace.col + d.palace.cols - 1) * CELL}
              y1={PAD + d.palace.row * CELL}
              x2={PAD + d.palace.col * CELL}
              y2={PAD + (d.palace.row + d.palace.rows - 1) * CELL}
            />
          </g>
        )}

        {/* Highlighted squares — light golden background spots */}
        {d.highlightedSquares?.map((s, i) => (
          <circle
            key={`hs${i}`}
            cx={PAD + s.col * CELL}
            cy={PAD + s.row * CELL}
            r={11}
            fill="var(--good)"
            opacity={0.22}
          />
        ))}

        {/* Targets — arrows + endpoint markers */}
        {d.targets.map((t, i) => {
          const tx = PAD + t.col * CELL;
          const ty = PAD + t.row * CELL;
          const kind = t.kind ?? "move";
          if (kind === "forbidden") {
            // Just an X — no arrow
            return <ForbiddenX key={`t${i}`} cx={tx} cy={ty} size={9} />;
          }
          if (kind === "captured") {
            // Enemy silhouette + thick solid arrow from the cannon over the screen
            return (
              <g key={`t${i}`}>
                <line
                  x1={pieceX}
                  y1={pieceY}
                  x2={tx}
                  y2={ty}
                  stroke="var(--piece-red-outer)"
                  strokeWidth={2}
                  opacity={0.9}
                  markerEnd="url(#captureArrow)"
                />
                <MiniPiece cx={tx} cy={ty} side="black" char="士" />
                <ForbiddenX cx={tx} cy={ty} size={9} />
              </g>
            );
          }
          // "move" or "blocked"
          const isBlocked = kind === "blocked";
          const lineColor = isBlocked
            ? "var(--text-muted)"
            : "var(--piece-red-outer)";
          const dotColor = isBlocked
            ? "var(--text-muted)"
            : "var(--piece-red-outer)";
          return (
            <g key={`t${i}`}>
              <line
                x1={pieceX}
                y1={pieceY}
                x2={tx}
                y2={ty}
                stroke={lineColor}
                strokeWidth={1.4}
                strokeDasharray="3 2"
                opacity={isBlocked ? 0.6 : 0.85}
              />
              <circle
                cx={tx}
                cy={ty}
                r={5}
                fill={dotColor}
                opacity={isBlocked ? 0.55 : 0.9}
              />
              {isBlocked && <ForbiddenX cx={tx} cy={ty} size={6} />}
            </g>
          );
        })}

        {/* Second piece — e.g. opposing general + flying-general line */}
        {d.secondPiece && (
          <g>
            {d.secondPiece.line && (
              <line
                x1={pieceX}
                y1={pieceY}
                x2={PAD + d.secondPiece.col * CELL}
                y2={PAD + d.secondPiece.row * CELL}
                stroke="var(--bad)"
                strokeWidth={1.6}
                strokeDasharray="4 3"
                opacity={0.7}
              />
            )}
            <MiniPiece
              cx={PAD + d.secondPiece.col * CELL}
              cy={PAD + d.secondPiece.row * CELL}
              side={d.secondPiece.side ?? "black"}
              char={
                d.secondPiece.side === "red"
                  ? PIECES.G.redChar
                  : PIECES.G.blackChar
              }
            />
          </g>
        )}

        {/* Forbidden squares — render an X (e.g. soldier no-back) */}
        {d.forbiddenSquares?.map((s, i) => (
          <ForbiddenX
            key={`fb${i}`}
            cx={PAD + s.col * CELL}
            cy={PAD + s.row * CELL}
            size={9}
          />
        ))}

        {/* Blockers (other piece silhouettes — black) */}
        {d.blockers?.map((b, i) => (
          <MiniPiece
            key={`bl${i}`}
            cx={PAD + b.col * CELL}
            cy={PAD + b.row * CELL}
            side="black"
            char="卒"
          />
        ))}

        {/* The piece itself, on top */}
        <MiniPiece cx={pieceX} cy={pieceY} side={pieceSide} char={pieceChar} />
      </svg>
      {d.label && (
        <div
          style={{
            fontFamily: "Crimson Text, Georgia, serif",
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: 220,
          }}
        >
          {d.label}
        </div>
      )}
    </div>
  );
}

export function PieceCard({ type }: PieceCardProps) {
  const info = PIECES[type];
  const isDualDiagram = info.diagrams.length > 1;
  return (
    <div
      className="surface"
      style={{
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <StaticPiece type={type} side="red" size={42} />
        <StaticPiece type={type} side="black" size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="font-display"
            style={{ fontSize: 18, fontWeight: 600, color: "var(--text)" }}
          >
            {info.csName}
          </div>
          <div
            style={{
              fontFamily: "Noto Serif, Georgia, serif",
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.3,
              marginTop: 2,
            }}
          >
            {info.redChar}/{info.blackChar} · <i>{info.pinyinRed}</i>
            {info.pinyinRed !== info.pinyinBlack && (
              <>
                {" / "}
                <i>{info.pinyinBlack}</i>
              </>
            )}
          </div>
        </div>
        <div style={{ color: "var(--text-muted)" }}>
          <PieceIcon type={type} />
        </div>
      </div>

      <p
        style={{
          margin: 0,
          color: "var(--text-soft)",
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        {info.movement}
      </p>

      {info.specialRule && (
        <p
          style={{
            margin: 0,
            color: "var(--text-soft)",
            fontSize: 14,
            lineHeight: 1.55,
            paddingLeft: 10,
            borderLeft: "2px solid var(--accent-border)",
          }}
        >
          {info.specialRule}
        </p>
      )}

      <div
        style={{
          background: "var(--surface-2)",
          borderRadius: 10,
          padding: 10,
          display: "grid",
          gap: 12,
          gridTemplateColumns: isDualDiagram ? "1fr 1fr" : "1fr",
          justifyItems: "center",
        }}
      >
        {info.diagrams.map((diagram, i) => (
          <Diagram
            key={i}
            diagram={diagram}
            pieceChar={info.redChar}
            pieceSide="red"
          />
        ))}
      </div>
    </div>
  );
}
