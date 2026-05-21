import { useMemo, useState } from "react";
import { PIECES, PIECE_TYPES } from "../../data/pieces";
import type { PieceType, Side } from "../../lib/xiangqi";
import { PieceIcon } from "./PieceIcons";
import { Pill } from "./Pill";

const PIECE_FONT_FAMILY =
  '"Noto Serif SC", "SimSun", "KaiTi", Noto Serif, Georgia, serif';

interface FlashcardEntry {
  type: PieceType;
  side: Side;
  char: string;
  pinyin: string;
  csName: string;
}

function allFlashcards(): FlashcardEntry[] {
  const out: FlashcardEntry[] = [];
  for (const t of PIECE_TYPES) {
    const info = PIECES[t];
    out.push({
      type: t,
      side: "red",
      char: info.redChar,
      pinyin: info.pinyinRed,
      csName: info.csName,
    });
    out.push({
      type: t,
      side: "black",
      char: info.blackChar,
      pinyin: info.pinyinBlack,
      csName: info.csName,
    });
  }
  return out;
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOrder(seed: number, items: FlashcardEntry[]): FlashcardEntry[] {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  return shuffle(items, rnd);
}

// A single piece rendered as an SVG, showing either the Chinese character
// or the icon. Theme-aware colors via CSS custom properties.
function PieceFace({
  type,
  side,
  mode,
  size,
}: {
  type: PieceType;
  side: Side;
  mode: "char" | "icon";
  size: number;
}) {
  const r = size / 2;
  const outerR = r - 2;
  const innerR = r - 5;
  const ringR = r - 7;
  const info = PIECES[type];
  const text = side === "red" ? info.redChar : info.blackChar;
  return (
    <svg width={size} height={size} viewBox={`-${r} -${r} ${size} ${size}`}>
      <defs>
        <filter
          id={`flipShadow-${side}-${type}`}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#000"
            floodOpacity="0.45"
          />
        </filter>
      </defs>
      <g filter={`url(#flipShadow-${side}-${type})`}>
        <circle r={outerR} fill={`var(--piece-${side}-outer)`} />
        <circle
          r={innerR}
          fill={`var(--piece-${side}-inner)`}
          stroke={`var(--piece-${side}-outer)`}
          strokeWidth={1.5}
        />
        <circle
          r={ringR}
          fill="none"
          stroke={`var(--piece-${side}-text)`}
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      </g>
      {mode === "char" ? (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={PIECE_FONT_FAMILY}
          fontWeight={900}
          fontSize={size * 0.5}
          letterSpacing={-1}
          fill={`var(--piece-${side}-text)`}
        >
          {text}
        </text>
      ) : (
        // PieceIcon viewBox is 24×24 rendered at 22 — scale to fit our circle.
        // Translate so the icon center sits at the piece center.
        <g
          style={{ color: `var(--piece-${side}-text)` }}
          transform={`scale(${(size * 0.55) / 22}) translate(-11, -11)`}
        >
          <PieceIcon type={type} />
        </g>
      )}
    </svg>
  );
}

export function CharacterFlashcards() {
  const baseEntries = useMemo(() => allFlashcards(), []);
  const [seed, setSeed] = useState(() => Date.now());
  const order = useMemo(() => makeOrder(seed, baseEntries), [seed, baseEntries]);
  const [index, setIndex] = useState(0);
  const [flippedLeft, setFlippedLeft] = useState(false);
  const [flippedRight, setFlippedRight] = useState(false);
  const [done, setDone] = useState(false);

  const total = order.length;
  const entry = order[index];

  const next = () => {
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setFlippedLeft(false);
      setFlippedRight(false);
    }
  };

  const restart = () => {
    setSeed(Date.now());
    setIndex(0);
    setFlippedLeft(false);
    setFlippedRight(false);
    setDone(false);
  };

  if (done) {
    return (
      <div
        className="surface"
        style={{ padding: "24px 18px", textAlign: "center" }}
      >
        <h3 className="font-display" style={{ margin: "0 0 8px", fontSize: 20 }}>
          Hotovo!
        </h3>
        <p
          style={{
            margin: "0 0 16px",
            color: "var(--text-soft)",
            fontSize: 15,
          }}
        >
          Prošli jste všech {total} figur. Chceš si je projít znovu?
        </p>
        <Pill level={1} active onClick={restart}>
          ↺ Znovu
        </Pill>
      </div>
    );
  }

  const CARD_SIZE = 100;
  const sideLabel = entry.side === "red" ? "červený" : "černý";

  return (
    <div
      className="surface"
      style={{
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        <span style={{ fontSize: 12 }}>
          Klepni na figuru pro otočení
        </span>
        <span className="font-mono" style={{ color: "var(--text-soft)" }}>
          {index + 1} / {total}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: CARD_SIZE,
        }}
      >
        {/* LEFT card — default shows character */}
        <div
          className={`flip-card ${flippedLeft ? "flipped" : ""}`}
          style={{ width: CARD_SIZE, height: CARD_SIZE }}
          onClick={() => setFlippedLeft((f) => !f)}
          role="button"
          aria-label="Otoč levou figuru"
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <PieceFace
                type={entry.type}
                side={entry.side}
                mode="char"
                size={CARD_SIZE}
              />
            </div>
            <div className="flip-card-back">
              <PieceFace
                type={entry.type}
                side={entry.side}
                mode="icon"
                size={CARD_SIZE}
              />
            </div>
          </div>
        </div>

        <span
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--accent)",
          }}
          aria-hidden
        >
          =
        </span>

        {/* RIGHT card — default shows icon */}
        <div
          className={`flip-card ${flippedRight ? "flipped" : ""}`}
          style={{ width: CARD_SIZE, height: CARD_SIZE }}
          onClick={() => setFlippedRight((f) => !f)}
          role="button"
          aria-label="Otoč pravou figuru"
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <PieceFace
                type={entry.type}
                side={entry.side}
                mode="icon"
                size={CARD_SIZE}
              />
            </div>
            <div className="flip-card-back">
              <PieceFace
                type={entry.type}
                side={entry.side}
                mode="char"
                size={CARD_SIZE}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          className="font-display"
          style={{ fontSize: 20, color: "var(--text)" }}
        >
          {entry.csName}
        </div>
        <div
          style={{
            fontFamily: "Noto Serif, Georgia, serif",
            fontSize: 14,
            color: "var(--text-muted)",
            marginTop: 2,
          }}
        >
          {entry.char} · <i>{entry.pinyin}</i> ·{" "}
          <span
            style={{
              color: entry.side === "red" ? "var(--piece-red-text)" : "var(--piece-black-text)",
              fontWeight: 600,
            }}
          >
            {sideLabel}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 4,
          alignItems: "center",
        }}
      >
        <Pill level={1} active onClick={next}>
          Další →
        </Pill>
        <Pill onClick={restart} title="Začít znovu">
          ↺ Znovu
        </Pill>
      </div>
    </div>
  );
}
