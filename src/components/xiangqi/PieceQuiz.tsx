import { useMemo, useState } from "react";
import { PIECES, PIECE_TYPES, pieceChar } from "../../data/pieces";
import type { PieceType, Side } from "../../lib/xiangqi";
import { Pill } from "./Pill";

type QuestionKind = "char-to-name" | "name-to-char";

interface Question {
  kind: QuestionKind;
  answer: PieceType;
  options: PieceType[];
  side: Side; // for char-to-name: which color of character to show
}

const TOTAL = 10;

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(rnd: () => number): Question {
  const kind: QuestionKind = rnd() < 0.5 ? "char-to-name" : "name-to-char";
  const answer = PIECE_TYPES[Math.floor(rnd() * PIECE_TYPES.length)];
  const distractors = shuffle(
    PIECE_TYPES.filter((p) => p !== answer),
    rnd,
  ).slice(0, 3);
  const options = shuffle([answer, ...distractors], rnd);
  const side: Side = rnd() < 0.5 ? "red" : "black";
  return { kind, answer, options, side };
}

function makeQuiz(seed: number): Question[] {
  // Deterministic pseudo-random seeded
  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  return Array.from({ length: TOTAL }, () => makeQuestion(rnd));
}

export function PieceQuiz() {
  const [seed, setSeed] = useState(() => Date.now());
  const questions = useMemo(() => makeQuiz(seed), [seed]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<PieceType | null>(null);
  const [done, setDone] = useState(false);

  const reset = () => {
    setSeed(Date.now());
    setIndex(0);
    setScore(0);
    setPick(null);
    setDone(false);
  };

  if (done) {
    const ratio = score / TOTAL;
    const compliment =
      score === TOTAL
        ? "Perfektně! Všechny figury znáš zpaměti."
        : ratio >= 0.7
          ? "Dobré skóre — drobné mezery doplníš snadno."
          : ratio >= 0.4
            ? "Slušně, ale je co trénovat. Zkus znovu."
            : "Začátky bývají těžké. Projdi si přehled figur a vrať se.";
    return (
      <div
        className="surface"
        style={{ padding: "20px 18px", textAlign: "center" }}
      >
        <h3 className="font-display" style={{ margin: "0 0 8px", fontSize: 20 }}>
          Hotovo!
        </h3>
        <div
          className="font-display"
          style={{
            fontSize: 36,
            color: "var(--accent)",
            margin: "8px 0",
          }}
        >
          {score} / {TOTAL}
        </div>
        <p
          style={{
            margin: "0 0 14px",
            color: "var(--text-soft)",
            fontSize: 15,
          }}
        >
          {compliment}
        </p>
        <Pill active onClick={reset}>
          Zkusit znovu
        </Pill>
      </div>
    );
  }

  const q = questions[index];
  const submitted = pick !== null;
  const correct = pick === q.answer;

  const handlePick = (p: PieceType) => {
    if (submitted) return;
    setPick(p);
    if (p === q.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setPick(null);
    if (index + 1 >= TOTAL) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div
      className="surface"
      style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        <span>
          Otázka{" "}
          <span className="font-mono" style={{ color: "var(--text-soft)" }}>
            {index + 1}/{TOTAL}
          </span>
        </span>
        <span>
          Skóre:{" "}
          <span className="font-mono" style={{ color: "var(--accent)" }}>
            {score}
          </span>
        </span>
      </div>

      <div style={{ textAlign: "center" }}>
        {q.kind === "char-to-name" ? (
          <>
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: 13,
                marginBottom: 8,
              }}
            >
              Co je tato figura?
            </div>
            <svg
              width={84}
              height={84}
              viewBox="-42 -42 84 84"
              style={{ display: "block", margin: "0 auto" }}
            >
              <defs>
                <filter
                  id="quizPieceShadow"
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
                    floodOpacity="0.4"
                  />
                </filter>
              </defs>
              <g filter="url(#quizPieceShadow)">
                <circle r={40} fill={`var(--piece-${q.side}-outer)`} />
                <circle
                  r={34}
                  fill={`var(--piece-${q.side}-inner)`}
                  stroke={`var(--piece-${q.side}-outer)`}
                  strokeWidth={1.5}
                />
                <circle
                  r={31}
                  fill="none"
                  stroke={`var(--piece-${q.side}-text)`}
                  strokeOpacity={0.3}
                  strokeWidth={1}
                />
              </g>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily='"Noto Serif SC", "SimSun", "KaiTi", Noto Serif, Georgia, serif'
                fontWeight={900}
                fontSize={42}
                letterSpacing={-1}
                fill={`var(--piece-${q.side}-text)`}
              >
                {pieceChar(q.answer, q.side)}
              </text>
            </svg>
          </>
        ) : (
          <>
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: 13,
                marginBottom: 8,
              }}
            >
              Která figura je „{PIECES[q.answer].csName}"?
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 28,
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              {PIECES[q.answer].csName}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {q.options.map((opt) => {
          const isAnswer = opt === q.answer;
          const isPick = opt === pick;
          let bg = "var(--surface-2)";
          let bd = "var(--border-soft)";
          let color = "var(--text)";
          if (submitted) {
            if (isAnswer) {
              bg = "rgba(123, 180, 107, 0.18)";
              bd = "var(--good)";
              color = "var(--good)";
            } else if (isPick) {
              bg = "rgba(212, 104, 79, 0.18)";
              bd = "var(--bad)";
              color = "var(--bad)";
            }
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handlePick(opt)}
              disabled={submitted}
              style={{
                padding: "12px 8px",
                borderRadius: 10,
                border: `1.5px solid ${bd}`,
                background: bg,
                color,
                cursor: submitted ? "default" : "pointer",
                fontFamily:
                  q.kind === "char-to-name"
                    ? "Crimson Text, Georgia, serif"
                    : '"Noto Serif SC", "SimSun", "KaiTi", Noto Serif, Georgia, serif',
                fontWeight: q.kind === "char-to-name" ? 600 : 900,
                fontSize: q.kind === "char-to-name" ? 16 : 24,
                letterSpacing: q.kind === "char-to-name" ? "normal" : "-0.5px",
                transition: "all 0.18s ease",
              }}
            >
              {q.kind === "char-to-name"
                ? PIECES[opt].csName
                : pieceChar(opt, q.side)}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: correct ? "var(--good)" : "var(--bad)",
              fontWeight: 600,
            }}
          >
            {correct ? "✓ Správně" : `✗ Správně bylo: ${PIECES[q.answer].csName}`}
          </span>
          <Pill active onClick={handleNext}>
            {index + 1 >= TOTAL ? "Výsledek →" : "Další →"}
          </Pill>
        </div>
      )}
    </div>
  );
}
