// Programmatic validation of every move in every variant against xiangqi rules.
// Run with: node scripts/verify-openings.mjs

import { readFileSync } from "node:fs";

// We can't import the TS file directly. Re-implement just enough logic and
// extract data by evaluating a stripped-down JS form of the file.
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function extractExport(filePath, marker) {
  const src = readFileSync(filePath, "utf8");
  const i = src.indexOf(marker);
  if (i < 0) throw new Error(`Marker "${marker}" not found in ${filePath}`);
  let rest = src.slice(i + marker.length).trimEnd();
  if (rest.endsWith(";")) rest = rest.slice(0, -1);
  return eval("(" + rest + ")");
}

const OPENINGS = extractExport(
  join(__dirname, "..", "src", "data", "openings.ts"),
  "export const OPENINGS: Opening[] = ",
);
const GAMES = extractExport(
  join(__dirname, "..", "src", "data", "games.ts"),
  "export const GAMES: Game[] = ",
);

const ROWS = 10;
const COLS = 9;

function emptyBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null),
  );
}

function initialBoard() {
  const b = emptyBoard();
  const blackBack = ["R", "H", "E", "A", "G", "A", "E", "H", "R"];
  blackBack.forEach((t, c) => (b[0][c] = { type: t, side: "black" }));
  b[2][1] = { type: "C", side: "black" };
  b[2][7] = { type: "C", side: "black" };
  [0, 2, 4, 6, 8].forEach((c) => (b[3][c] = { type: "S", side: "black" }));

  const redBack = ["R", "H", "E", "A", "G", "A", "E", "H", "R"];
  redBack.forEach((t, c) => (b[9][c] = { type: t, side: "red" }));
  b[7][1] = { type: "C", side: "red" };
  b[7][7] = { type: "C", side: "red" };
  [0, 2, 4, 6, 8].forEach((c) => (b[6][c] = { type: "S", side: "red" }));
  return b;
}

const inBoard = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

const inPalace = (r, c, side) => {
  if (c < 3 || c > 5) return false;
  if (side === "red") return r >= 7 && r <= 9;
  return r >= 0 && r <= 2;
};

const crossesRiver = (fromR, toR, side) => {
  // Red side: rows 5-9. Black side: rows 0-4. River between row 4 and row 5.
  if (side === "red") return toR <= 4; // red crosses if it lands on black side
  return toR >= 5; // black crosses if it lands on red side
};

function pieceAlong(board, fromR, fromC, toR, toC) {
  // Count pieces strictly between (fromR,fromC) and (toR,toC) on a straight
  // orthogonal line. Returns -1 if not orthogonal.
  if (fromR !== toR && fromC !== toC) return -1;
  let count = 0;
  if (fromR === toR) {
    const lo = Math.min(fromC, toC);
    const hi = Math.max(fromC, toC);
    for (let c = lo + 1; c < hi; c++) if (board[fromR][c]) count++;
  } else {
    const lo = Math.min(fromR, toR);
    const hi = Math.max(fromR, toR);
    for (let r = lo + 1; r < hi; r++) if (board[r][fromC]) count++;
  }
  return count;
}

function validateMove(board, moveIndex, move) {
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  const expectedSide = moveIndex % 2 === 0 ? "red" : "black";

  if (!inBoard(fr, fc) || !inBoard(tr, tc)) return "out of board";
  const piece = board[fr][fc];
  if (!piece) return `no piece at (${fr},${fc})`;
  if (piece.side !== expectedSide)
    return `expected ${expectedSide} to move, but (${fr},${fc}) holds ${piece.side}`;
  const target = board[tr][tc];
  if (target && target.side === piece.side) return "captures own piece";

  const dr = tr - fr;
  const dc = tc - fc;

  switch (piece.type) {
    case "G": {
      if (!inPalace(tr, tc, piece.side)) return "general leaves palace";
      if (Math.abs(dr) + Math.abs(dc) !== 1) return "general moves more than 1";
      return null;
    }
    case "A": {
      if (!inPalace(tr, tc, piece.side)) return "advisor leaves palace";
      if (Math.abs(dr) !== 1 || Math.abs(dc) !== 1)
        return "advisor not 1 diagonal";
      return null;
    }
    case "E": {
      if (crossesRiver(fr, tr, piece.side))
        return "elephant crosses river";
      if (Math.abs(dr) !== 2 || Math.abs(dc) !== 2)
        return "elephant not 2 diagonal";
      const midR = fr + dr / 2;
      const midC = fc + dc / 2;
      if (board[midR][midC]) return "elephant blocked at middle";
      return null;
    }
    case "H": {
      // Knight: 2+1 with blocking square at the 2-side intermediate.
      const isValidL =
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2);
      if (!isValidL) return "knight not L";
      let blockR, blockC;
      if (Math.abs(dr) === 2) {
        blockR = fr + dr / 2;
        blockC = fc;
      } else {
        blockR = fr;
        blockC = fc + dc / 2;
      }
      if (board[blockR][blockC]) return "knight blocked at leg";
      return null;
    }
    case "R": {
      if (dr !== 0 && dc !== 0) return "rook not straight";
      const between = pieceAlong(board, fr, fc, tr, tc);
      if (between > 0) return "rook path blocked";
      return null;
    }
    case "C": {
      if (dr !== 0 && dc !== 0) return "cannon not straight";
      const between = pieceAlong(board, fr, fc, tr, tc);
      if (target) {
        if (between !== 1) return `cannon needs 1 screen, has ${between}`;
      } else {
        if (between !== 0) return `cannon path blocked (${between})`;
      }
      return null;
    }
    case "S": {
      // Forward only; after crossing river also sideways.
      if (Math.abs(dr) + Math.abs(dc) !== 1) return "soldier not 1 step";
      const crossed =
        piece.side === "red" ? fr <= 4 : fr >= 5;
      if (piece.side === "red") {
        if (dr === 1 || (dr === 0 && Math.abs(dc) === 1 && crossed)) {
          // dr=1 means going DOWN row index — red would actually move up (row decreases). Let's redo.
        }
      }
      // Re-evaluate forward direction: red moves up (row decreases), black moves down (row increases).
      const forwardOK =
        piece.side === "red" ? dr === -1 && dc === 0 : dr === 1 && dc === 0;
      const sidewaysOK =
        crossed && dr === 0 && Math.abs(dc) === 1;
      if (forwardOK || sidewaysOK) return null;
      // backward never allowed
      return `soldier illegal direction (dr=${dr}, dc=${dc}, crossed=${crossed})`;
    }
  }
}

let totalMoves = 0;
let totalVariants = 0;
let totalGames = 0;
let errors = 0;

function walk(label, moves) {
  const board = initialBoard();
  moves.forEach((m, idx) => {
    totalMoves++;
    const err = validateMove(board, idx, m);
    if (err) {
      console.error(
        `❌ ${label} move ${idx + 1} [${m.from}]→[${m.to}]: ${err}`,
      );
      errors++;
    }
    const [fr, fc] = m.from;
    const [tr, tc] = m.to;
    board[tr][tc] = board[fr][fc];
    board[fr][fc] = null;
  });
}

// Openings: every variant must have exactly 12 moves
for (const opening of OPENINGS) {
  for (const variant of opening.variants) {
    totalVariants++;
    if (variant.moves.length !== 12) {
      console.error(
        `❌ ${opening.id}/${variant.id}: ${variant.moves.length} moves, expected 12`,
      );
      errors++;
    }
    walk(`${opening.id}/${variant.id}`, variant.moves);
  }
}

// Games: variable length, just validate legality
for (const game of GAMES) {
  totalGames++;
  walk(`game/${game.id}`, game.moves);
}

if (errors === 0) {
  console.log(
    `✅ All ${totalMoves} moves across ${totalVariants} variants and ${totalGames} games validated.`,
  );
} else {
  console.log(
    `\n❌ ${errors} errors across ${totalMoves} moves / ${totalVariants} variants / ${totalGames} games.`,
  );
  process.exit(1);
}
