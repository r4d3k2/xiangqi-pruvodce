import { PIECES, type PieceInfo } from "../../data/pieces";
import { PieceIcon } from "./PieceIcons";

interface PieceCardProps {
  type: PieceInfo["type"];
}

const CELL = 28;
const PAD = 12;

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

function Diagram({ type }: { type: PieceInfo["type"] }) {
  const info = PIECES[type];
  const d = info.diagram;
  const w = PAD * 2 + (d.cols - 1) * CELL;
  const h = PAD * 2 + (d.rows - 1) * CELL;
  const pieceX = PAD + d.pieceCol * CELL;
  const pieceY = PAD + d.pieceRow * CELL;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: "block",
        borderRadius: 8,
        maxWidth: 220,
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id="miniBoardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--board-grad-1)" />
          <stop offset="100%" stopColor="var(--board-grad-2)" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={w} height={h} rx={6} fill="url(#miniBoardGrad)" />

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
            opacity={0.2}
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

      {/* Blockers (small black silhouettes) */}
      {d.blockers?.map((b, i) => {
        const x = PAD + b.col * CELL;
        const y = PAD + b.row * CELL;
        return (
          <circle
            key={`b${i}`}
            cx={x}
            cy={y}
            r={8}
            fill="var(--piece-black-outer)"
            stroke="#000"
            strokeWidth={0.5}
            opacity={0.7}
          />
        );
      })}

      {/* Targets (arrows from piece to each target) */}
      {d.targets.map((t, i) => {
        const tx = PAD + t.col * CELL;
        const ty = PAD + t.row * CELL;
        return (
          <g key={`t${i}`}>
            <line
              x1={pieceX}
              y1={pieceY}
              x2={tx}
              y2={ty}
              stroke="var(--piece-red-outer)"
              strokeWidth={1.4}
              strokeDasharray="3 2"
              opacity={0.8}
            />
            <circle
              cx={tx}
              cy={ty}
              r={5}
              fill="var(--piece-red-outer)"
              opacity={0.85}
            />
          </g>
        );
      })}

      {/* Piece itself */}
      <g transform={`translate(${pieceX}, ${pieceY})`}>
        <circle r={11} fill="var(--piece-red-outer)" />
        <circle
          r={9}
          fill="var(--piece-red-inner)"
          stroke="var(--piece-red-outer)"
          strokeWidth={1}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={PIECE_FONT_FAMILY}
          fontWeight={900}
          fontSize={12}
          letterSpacing="-0.5"
          fill="var(--piece-red-text)"
        >
          {info.redChar}
        </text>
      </g>
    </svg>
  );
}

export function PieceCard({ type }: PieceCardProps) {
  const info = PIECES[type];
  return (
    <div
      className="surface"
      style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}
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
          lineHeight: 1.5,
        }}
      >
        {info.movement}
      </p>

      <div
        style={{
          background: "var(--surface-2)",
          borderRadius: 10,
          padding: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Diagram type={type} />
      </div>
    </div>
  );
}
