import { useEffect, useMemo, useRef, useState } from "react";
import { OPENINGS } from "../data/openings";
import { GAMES } from "../data/games";
import { PIECES, pieceChar } from "../data/pieces";
import {
  applyMovesUpTo,
  initialBoard,
  moveLabel,
  moveSide,
  pieceTraceUpTo,
  type Coord,
  type Side,
} from "../lib/xiangqi";
import {
  applyTheme,
  loadProgress,
  loadTheme,
  recordResult,
  starsFromMistakes,
  type ProgressMap,
  type ThemeId,
} from "../lib/storage";
import { recommend } from "../lib/recommend";
import { XiangqiBoard, type PieceDisplay } from "../components/xiangqi/XiangqiBoard";
import { Pill } from "../components/xiangqi/Pill";
import { MoveToken } from "../components/xiangqi/MoveToken";
import { Stars } from "../components/xiangqi/Stars";
import { ResultCard } from "../components/xiangqi/ResultCard";
import { ThemeSwitcher } from "../components/xiangqi/ThemeSwitcher";
import { PieceCard } from "../components/xiangqi/PieceCard";
import { PieceQuiz } from "../components/xiangqi/PieceQuiz";
import { PIECE_TYPES } from "../data/pieces";

type Mode = "study" | "practice" | "pieces" | "games";
type Tab = "strategy" | "history" | "move";

const OPPONENT_DELAY_MS = 700;
const ERROR_FLASH_MS = 420;

export function Index() {
  const [mode, setMode] = useState<Mode>("study");
  const [openingId, setOpeningId] = useState(OPENINGS[0].id);
  const [variantId, setVariantId] = useState(OPENINGS[0].variants[0].id);
  const [gameId, setGameId] = useState(GAMES[0].id);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [tab, setTab] = useState<Tab>("strategy");
  const [pieceDisplay, setPieceDisplay] = useState<PieceDisplay>("char");
  const [flipped, setFlipped] = useState(false);

  // Practice state
  const [selected, setSelected] = useState<Coord | null>(null);
  const [error, setError] = useState<Coord | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  // Theme
  const [theme, setTheme] = useState<ThemeId>(() => loadTheme());
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Cancellable scheduled opponent move
  const oppTimer = useRef<number | null>(null);
  const errTimer = useRef<number | null>(null);

  const opening = useMemo(
    () => OPENINGS.find((o) => o.id === openingId) ?? OPENINGS[0],
    [openingId],
  );
  const variant = useMemo(
    () =>
      opening.variants.find((v) => v.id === variantId) ?? opening.variants[0],
    [opening, variantId],
  );
  const selectedGame = useMemo(
    () => GAMES.find((g) => g.id === gameId) ?? GAMES[0],
    [gameId],
  );

  // Unified move source — games mode uses game.moves, otherwise variant.moves.
  const currentMoves = mode === "games" ? selectedGame.moves : variant.moves;

  const board = useMemo(() => {
    if (moveIndex < 0) return initialBoard();
    return applyMovesUpTo(currentMoves, moveIndex);
  }, [currentMoves, moveIndex]);

  // Tracked pieces (stable IDs across moves) — feeds animated rendering.
  const tracedPieces = useMemo(
    () => pieceTraceUpTo(currentMoves, moveIndex),
    [currentMoves, moveIndex],
  );

  // Animation flag: true for ±1 steps and auto-opponent moves; false for
  // ⏮/⏭ jumps, variant changes, restarts, recommendation switches.
  const [animate, setAnimate] = useState(true);
  // Helper: change moveIndex and disable animation (snap, then restore).
  const jumpMoveIndex = (idx: number) => {
    setAnimate(false);
    setMoveIndex(idx);
    // Re-enable animation on the next render so subsequent ±1 steps animate.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
  };

  const currentMove = moveIndex >= 0 ? currentMoves[moveIndex] : null;
  const showStudyHighlights = mode === "study" || mode === "games";
  const fromHighlight: Coord | null =
    showStudyHighlights && currentMove
      ? { row: currentMove.from[0], col: currentMove.from[1] }
      : null;
  const toHighlight: Coord | null =
    showStudyHighlights && currentMove
      ? { row: currentMove.to[0], col: currentMove.to[1] }
      : null;

  // In practice mode the user plays the side that's at the BOTTOM of the board.
  // Default (not flipped) = red bottom = user plays red.
  const userSide: Side = flipped ? "black" : "red";

  // Next move to be played (after current moveIndex)
  const nextIdx = moveIndex + 1;
  const nextMove =
    nextIdx < variant.moves.length ? variant.moves[nextIdx] : null;
  // (nextMove is only used in practice mode against the active variant)
  const nextIsUser = nextMove ? moveSide(nextIdx) === userSide : false;

  // Reset position whenever variant changes or mode changes (no animation).
  const resetRun = () => {
    jumpMoveIndex(-1);
    setSelected(null);
    setError(null);
    setMistakes(0);
    setHintLevel(0);
    setDone(false);
    if (oppTimer.current) {
      clearTimeout(oppTimer.current);
      oppTimer.current = null;
    }
    if (errTimer.current) {
      clearTimeout(errTimer.current);
      errTimer.current = null;
    }
  };

  // Reset state when variant / game / mode / flip changes
  useEffect(() => {
    resetRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant.id, selectedGame.id, mode, flipped]);

  // Auto-play opponent moves in practice mode
  useEffect(() => {
    if (mode !== "practice") return;
    if (done) return;
    if (!nextMove) return;
    if (nextIsUser) return;
    if (oppTimer.current) {
      clearTimeout(oppTimer.current);
    }
    oppTimer.current = window.setTimeout(() => {
      setMoveIndex((i) => i + 1);
      setHintLevel(0);
      oppTimer.current = null;
    }, OPPONENT_DELAY_MS);
    return () => {
      if (oppTimer.current) {
        clearTimeout(oppTimer.current);
        oppTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, moveIndex, done, variant.id]);

  // Mark done + persist progress when the last move is played
  useEffect(() => {
    if (mode !== "practice") return;
    if (done) return;
    if (moveIndex >= variant.moves.length - 1 && moveIndex >= 0) {
      const result = recordResult(variant.id, mistakes);
      setProgress((p) => ({ ...p, [variant.id]: result }));
      setDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveIndex, mode]);

  // --- Practice click handling ---
  const handleCellClick = (r: number, c: number) => {
    if (mode !== "practice" || done || !nextMove || !nextIsUser) return;

    const cell = board[r][c];
    // If nothing selected: select a user's piece
    if (!selected) {
      if (cell && cell.side === userSide) {
        setSelected({ row: r, col: c });
      }
      return;
    }

    // Clicking the same square again deselects
    if (selected.row === r && selected.col === c) {
      setSelected(null);
      return;
    }

    // Clicking another own piece — switch selection
    if (cell && cell.side === userSide) {
      setSelected({ row: r, col: c });
      return;
    }

    // Attempt the move
    const expected = nextMove;
    const matchesFrom =
      selected.row === expected.from[0] && selected.col === expected.from[1];
    const matchesTo = r === expected.to[0] && c === expected.to[1];

    if (matchesFrom && matchesTo) {
      // Correct!
      setSelected(null);
      setHintLevel(0);
      setMoveIndex((i) => i + 1);
    } else {
      // Wrong — flash + mistake
      setMistakes((m) => m + 1);
      setError({ row: r, col: c });
      if (errTimer.current) clearTimeout(errTimer.current);
      errTimer.current = window.setTimeout(() => {
        setError(null);
        errTimer.current = null;
      }, ERROR_FLASH_MS);
      setSelected(null);
    }
  };

  // Hint handler (practice mode)
  const handleHint = () => {
    if (mode !== "practice" || done || !nextIsUser || !nextMove) return;
    setHintLevel((lvl) => (lvl >= 2 ? 2 : ((lvl + 1) as 1 | 2)));
  };

  // Recommend handler — switch variant
  const goToRecommendation = (excludeCurrent: boolean) => {
    const rec = recommend(progress, excludeCurrent ? variant.id : undefined);
    if (!rec) return;
    setOpeningId(rec.openingId);
    setVariantId(rec.variantId);
  };

  // Reset to initial position whenever variant changes (study mode)
  const selectVariant = (vId: string) => {
    setVariantId(vId);
  };
  const selectOpening = (oId: string) => {
    const o = OPENINGS.find((x) => x.id === oId);
    if (!o) return;
    setOpeningId(o.id);
    setVariantId(o.variants[0].id);
  };

  const status =
    moveIndex < 0
      ? mode === "practice" && nextIsUser
        ? `Hraje ${userSide === "red" ? "červený" : "černý"} — váš tah`
        : "Výchozí pozice"
      : `Tah ${moveLabel(moveIndex)} · ${moveIndex + 1}/${currentMoves.length}`;

  // Highlights for practice mode
  const practiceFromHL =
    mode === "practice" && !done && currentMove
      ? { row: currentMove.from[0], col: currentMove.from[1] }
      : null;
  const practiceToHL =
    mode === "practice" && !done && currentMove
      ? { row: currentMove.to[0], col: currentMove.to[1] }
      : null;

  const hintSquare: Coord | null =
    mode === "practice" && hintLevel >= 2 && nextMove && nextIsUser
      ? { row: nextMove.from[0], col: nextMove.from[1] }
      : null;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "20px 20px 80px",
        width: "100%",
      }}
    >
      {/* HEADER */}
      <header style={{ textAlign: "center", marginBottom: 16 }}>
        <div className="app-title-zh">象 棋 · XIANGQI</div>
        <h1
          className="app-title-main"
          style={{ margin: "6px 0 12px", fontSize: 22 }}
        >
          Průvodce zahájením
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ThemeSwitcher theme={theme} onChange={setTheme} />
        </div>
      </header>

      {/* MODE PILLS */}
      <nav
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <Pill active={mode === "study"} onClick={() => setMode("study")}>
          <span aria-hidden>📖</span> Studovat
        </Pill>
        <Pill
          active={mode === "practice"}
          onClick={() => setMode("practice")}
        >
          <span aria-hidden>🎯</span> Procvičovat
        </Pill>
        <Pill
          active={mode === "pieces"}
          onClick={() => setMode("pieces")}
        >
          <span aria-hidden>🀄</span> Figury
        </Pill>
        <Pill active={mode === "games"} onClick={() => setMode("games")}>
          <span aria-hidden>📜</span> Partie
        </Pill>
      </nav>

      {mode === "practice" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Pill ghost onClick={() => goToRecommendation(true)}>
            🎯 Doporučit slabé místo
          </Pill>
        </div>
      )}

      {/* ============= PIECES MODE ============= */}
      {mode === "pieces" && (
        <>
          <section
            style={{
              marginBottom: 18,
              textAlign: "center",
              color: "var(--text-soft)",
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            Sedm typů figur čínských šachů. Klepni si nahoře na téma, otoč
            si desku, nebo si vyzkoušej kvíz dole.
          </section>

          <section
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "1fr",
              marginBottom: 20,
            }}
          >
            {PIECE_TYPES.map((t) => (
              <PieceCard key={t} type={t} />
            ))}
          </section>

          <h2
            className="font-display"
            style={{
              textAlign: "center",
              fontSize: 20,
              margin: "12px 0 12px",
              color: "var(--text)",
            }}
          >
            Kvíz · Poznej figuru
          </h2>
          <PieceQuiz />
        </>
      )}

      {/* ============= STUDY / PRACTICE MODE ============= */}
      {mode !== "pieces" && (
      <>

      {/* GAME SELECTOR (Partie mode) */}
      {mode === "games" && (
        <section
          style={{
            marginBottom: 16,
            display: "grid",
            gap: 8,
            gridTemplateColumns: "1fr",
          }}
        >
          {GAMES.map((g) => {
            const active = g.id === selectedGame.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGameId(g.id)}
                className="surface"
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  cursor: "pointer",
                  border: active
                    ? "1.5px solid var(--accent-border)"
                    : "1px solid var(--border-soft)",
                  background: active ? "var(--accent-bg)" : "var(--surface)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  className="font-display"
                  style={{ fontSize: 15, fontWeight: 600 }}
                >
                  {g.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    {g.red} <span style={{ color: "var(--text-muted)" }}>(červený)</span>
                  </span>
                  <span>vs.</span>
                  <span>
                    {g.black}{" "}
                    <span style={{ color: "var(--text-muted)" }}>(černý)</span>
                  </span>
                  {g.year > 0 && (
                    <span className="font-mono">· {g.year}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {g.event} · {g.moves.length} tahů
                </div>
              </button>
            );
          })}
        </section>
      )}

      {/* OPENING + VARIANT SELECTOR (study/practice only) */}
      {(mode === "study" || mode === "practice") && (
      <section style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          {OPENINGS.map((o) => {
            const variantStars = o.variants.map(
              (v) => progress[v.id]?.stars ?? 0,
            );
            const maxStar = Math.max(...variantStars, 0);
            return (
              <Pill
                key={o.id}
                active={o.id === opening.id}
                onClick={() => selectOpening(o.id)}
              >
                {o.name}
                {mode === "practice" && maxStar > 0 && (
                  <span
                    style={{
                      marginLeft: 4,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <Stars count={maxStar} size={11} />
                  </span>
                )}
              </Pill>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {opening.variants.map((v) => {
            const s = progress[v.id]?.stars ?? 0;
            return (
              <Pill
                key={v.id}
                active={v.id === variant.id}
                ghost
                onClick={() => selectVariant(v.id)}
              >
                {v.name}
                {mode === "practice" && s > 0 && (
                  <span
                    style={{
                      marginLeft: 4,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <Stars count={s} size={11} />
                  </span>
                )}
              </Pill>
            );
          })}
        </div>
      </section>
      )}

      {/* PRACTICE HEADER STATUS */}
      {mode === "practice" && !done && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            color: "var(--text-muted)",
            fontSize: 13,
            padding: "0 4px",
          }}
        >
          <span>
            Chyby:{" "}
            <span
              className="font-mono"
              style={{
                color: mistakes > 0 ? "var(--bad)" : "var(--text-soft)",
              }}
            >
              {mistakes}
            </span>
          </span>
          <span>
            Tah:{" "}
            <span className="font-mono" style={{ color: "var(--text-soft)" }}>
              {Math.max(0, moveIndex + 1)}/{currentMoves.length}
            </span>
          </span>
          <span>
            Hraje:{" "}
            <span
              style={{
                color: nextIsUser ? "var(--accent)" : "var(--text-soft)",
              }}
            >
              {nextMove
                ? nextIsUser
                  ? "vy"
                  : "soupeř"
                : "—"}
            </span>
          </span>
        </div>
      )}

      {/* BOARD */}
      <section
        className="surface"
        style={{
          padding: 12,
          margin: "0 -8px 16px",
        }}
      >
        <XiangqiBoard
          board={board}
          pieces={tracedPieces}
          animate={animate}
          flipped={flipped}
          pieceDisplay={pieceDisplay}
          fromHighlight={mode === "practice" ? practiceFromHL : fromHighlight}
          toHighlight={mode === "practice" ? practiceToHL : toHighlight}
          selectedSquare={selected}
          hintSquare={hintSquare}
          errorSquare={error}
          onCellClick={mode === "practice" ? handleCellClick : undefined}
        />
      </section>

      {/* NAVIGATION (study/games) or HINT (practice only) */}
      {mode !== "practice" ? (
        <section
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            justifyContent: "center",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Pill
            square
            onClick={() => jumpMoveIndex(-1)}
            disabled={moveIndex < 0}
            title="Na začátek"
          >
            ⏮
          </Pill>
          <Pill
            square
            onClick={() => {
              setAnimate(true);
              setMoveIndex((i) => Math.max(-1, i - 1));
            }}
            disabled={moveIndex < 0}
            title="Předchozí tah"
          >
            ◀
          </Pill>
          <div
            className="font-mono"
            style={{
              padding: "8px 14px",
              border: "1px solid var(--border)",
              borderRadius: 999,
              background: "var(--surface-2)",
              color: "var(--text-soft)",
              fontSize: 13,
              minWidth: 170,
              textAlign: "center",
            }}
          >
            {status}
          </div>
          <Pill
            square
            onClick={() => {
              setAnimate(true);
              setMoveIndex((i) => Math.min(currentMoves.length - 1, i + 1));
            }}
            disabled={moveIndex >= currentMoves.length - 1}
            title="Další tah"
          >
            ▶
          </Pill>
          <Pill
            square
            onClick={() => jumpMoveIndex(currentMoves.length - 1)}
            disabled={moveIndex >= currentMoves.length - 1}
            title="Na konec"
          >
            ⏭
          </Pill>
          <Pill
            square
            onClick={() => setFlipped((f) => !f)}
            title="Otočit desku"
          >
            ↕
          </Pill>
          <Pill
            square
            onClick={() =>
              setPieceDisplay((d) => (d === "char" ? "icon" : "char"))
            }
            title={
              pieceDisplay === "char"
                ? "Přepnout na ikony"
                : "Přepnout na znaky"
            }
          >
            {pieceDisplay === "char" ? "🖼" : "字"}
          </Pill>
        </section>
      ) : (
        <section
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            justifyContent: "center",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Pill onClick={resetRun} title="Restart">
            ↺ Restart
          </Pill>
          <Pill
            onClick={handleHint}
            disabled={!nextIsUser || done}
            title="Nápověda"
            active={hintLevel > 0}
          >
            💡 Nápověda{hintLevel > 0 ? ` (${hintLevel}/2)` : ""}
          </Pill>
          <Pill
            square
            onClick={() => setFlipped((f) => !f)}
            title="Otočit desku"
          >
            ↕
          </Pill>
          <Pill
            square
            onClick={() =>
              setPieceDisplay((d) => (d === "char" ? "icon" : "char"))
            }
            title={
              pieceDisplay === "char"
                ? "Přepnout na ikony"
                : "Přepnout na znaky"
            }
          >
            {pieceDisplay === "char" ? "🖼" : "字"}
          </Pill>
        </section>
      )}

      {/* PRACTICE RESULT CARD */}
      {mode === "practice" && done && (
        <ResultCard
          variantName={variant.name}
          variantZh={variant.zh}
          mistakes={mistakes}
          stars={starsFromMistakes(mistakes)}
          hasRecommendation={!!recommend(progress, variant.id)}
          onRetry={resetRun}
          onWeakSpot={() => goToRecommendation(true)}
        />
      )}

      {/* PRACTICE HINT TEXT */}
      {mode === "practice" && hintLevel >= 1 && !done && nextMove && nextIsUser && (
        <div
          className="surface"
          style={{
            padding: "12px 14px",
            marginBottom: 16,
            background: "var(--accent-bg)",
            borderColor: "var(--accent-border)",
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: 12,
              color: "var(--accent)",
              marginBottom: 4,
            }}
          >
            💡 NÁPOVĚDA
          </div>
          <p
            style={{
              margin: 0,
              color: "var(--text)",
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            {nextMove.comment}
          </p>
        </div>
      )}

      {/* TABS — shown in study and games modes (not practice) */}
      {(mode === "study" || mode === "games") && (
        <section className="surface" style={{ padding: 0, marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border-soft)",
            }}
          >
            <button
              className={`tab ${tab === "strategy" ? "is-active" : ""}`}
              onClick={() => setTab("strategy")}
            >
              Strategie
            </button>
            <button
              className={`tab ${tab === "history" ? "is-active" : ""}`}
              onClick={() => setTab("history")}
            >
              Historie
            </button>
            <button
              className={`tab ${tab === "move" ? "is-active" : ""}`}
              onClick={() => setTab("move")}
            >
              Tah
            </button>
          </div>

          <div style={{ padding: "16px 18px", minHeight: 120 }}>
            {tab === "strategy" && (
              <div>
                {mode === "games" ? (
                  <>
                    <h3
                      className="font-display"
                      style={{ margin: "0 0 6px", fontSize: 18 }}
                    >
                      {selectedGame.title}
                    </h3>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginBottom: 10,
                      }}
                    >
                      {selectedGame.event}
                      {selectedGame.year > 0 ? ` · ${selectedGame.year}` : ""}{" "}
                      · {selectedGame.red} (červený) vs. {selectedGame.black} (černý)
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-soft)",
                        fontSize: 16,
                        lineHeight: 1.55,
                      }}
                    >
                      {selectedGame.description}
                    </p>
                    <p
                      style={{
                        marginTop: 12,
                        marginBottom: 0,
                        fontSize: 13,
                        color: "var(--accent)",
                        fontStyle: "italic",
                      }}
                    >
                      Výsledek: {selectedGame.result}
                    </p>
                  </>
                ) : (
                  <>
                    <h3
                      className="font-display"
                      style={{ margin: "0 0 6px", fontSize: 18 }}
                    >
                      {variant.name}{" "}
                      <span
                        style={{
                          fontFamily: "Noto Serif, Georgia, serif",
                          color: "var(--accent)",
                          fontSize: 14,
                          marginLeft: 4,
                        }}
                      >
                        {variant.zh}
                      </span>
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--text-soft)",
                        fontSize: 16,
                        lineHeight: 1.55,
                      }}
                    >
                      {variant.strategy}
                    </p>
                  </>
                )}
              </div>
            )}

            {tab === "history" && (
              <div>
                {currentMoves.length === 0 ? (
                  <p style={{ color: "var(--text-muted)" }}>Žádné tahy.</p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {currentMoves.map((_m, i) => (
                      <MoveToken
                        key={i}
                        index={i}
                        active={i === moveIndex}
                        onClick={() => jumpMoveIndex(i)}
                      />
                    ))}
                  </div>
                )}
                {moveIndex >= 0 && (
                  <p
                    style={{
                      margin: "12px 0 0",
                      color: "var(--text-muted)",
                      fontSize: 14,
                    }}
                  >
                    Aktuální:{" "}
                    <span className="font-mono">{moveLabel(moveIndex)}</span>
                  </p>
                )}
              </div>
            )}

            {tab === "move" && (
              <div>
                {!currentMove ? (
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>
                    Zatím nebyl proveden žádný tah. Stiskněte ▶ pro první tah.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: "50%",
                        background: `var(--piece-${moveSide(moveIndex)}-inner)`,
                        color: `var(--piece-${moveSide(moveIndex)}-text)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily:
                          '"Noto Serif SC", "SimSun", "KaiTi", Noto Serif, Georgia, serif',
                        fontWeight: 900,
                        fontSize: 22,
                        letterSpacing: "-0.5px",
                        border: `2px solid var(--piece-${moveSide(moveIndex)}-outer)`,
                      }}
                    >
                      {(() => {
                        const pre = applyMovesUpTo(currentMoves, moveIndex - 1);
                        const p =
                          pre[currentMove.from[0]][currentMove.from[1]];
                        if (!p) return "?";
                        return pieceChar(p.type, p.side);
                      })()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        className="font-mono"
                        style={{
                          color: "var(--accent)",
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {moveLabel(moveIndex)} ·{" "}
                        {(() => {
                          const pre = applyMovesUpTo(
                            currentMoves,
                            moveIndex - 1,
                          );
                          const p =
                            pre[currentMove.from[0]][currentMove.from[1]];
                          return p ? PIECES[p.type].csName : "";
                        })()}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--text-soft)",
                          fontSize: 16,
                          lineHeight: 1.55,
                        }}
                      >
                        {currentMove.comment}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      </>
      )}

      <footer
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 13,
          marginTop: 28,
        }}
      >
        {mode === "pieces"
          ? "Xiangqi · 7 figur, 1 kvíz"
          : mode === "games"
            ? `${selectedGame.title}${selectedGame.year > 0 ? " · " + selectedGame.year : ""}`
            : `${opening.name} · ${variant.name}`}
      </footer>
    </div>
  );
}
