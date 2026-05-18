// Xiangqi domain — board, pieces, move application.
// Board is 9 columns (a–i) × 10 rows. Row 0 is the top (black home),
// row 9 is the bottom (red home).

export type PieceType =
  | "G"  // General (帥/將)
  | "A"  // Advisor / Rádce (仕/士)
  | "E"  // Elephant / Slon (相/象)
  | "H"  // Horse / Kůň (馬)
  | "R"  // Rook / Vůz (車)
  | "C"  // Cannon / Kanon (炮/砲)
  | "S"; // Soldier / Pěšák (兵/卒)

export type Side = "red" | "black";

export interface Piece {
  type: PieceType;
  side: Side;
}

export type Cell = Piece | null;
export type Board = Cell[][]; // [row][col], row 0 top, col 0 left

export interface Coord {
  row: number;
  col: number;
}

export interface MoveDef {
  from: [number, number]; // [row, col]
  to: [number, number];
  comment: string;
}

export const ROWS = 10;
export const COLS = 9;

export function cloneBoard(b: Board): Board {
  return b.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null as Cell),
  );
}

const p = (type: PieceType, side: Side): Piece => ({ type, side });

export function initialBoard(): Board {
  const b = emptyBoard();

  // Black (top) row 0 back rank: R H E A G A E H R
  const blackBack: PieceType[] = ["R", "H", "E", "A", "G", "A", "E", "H", "R"];
  blackBack.forEach((t, c) => (b[0][c] = p(t, "black")));
  // Black cannons on row 2 cols 1 and 7
  b[2][1] = p("C", "black");
  b[2][7] = p("C", "black");
  // Black soldiers on row 3 cols 0,2,4,6,8
  [0, 2, 4, 6, 8].forEach((c) => (b[3][c] = p("S", "black")));

  // Red (bottom) row 9 back rank
  const redBack: PieceType[] = ["R", "H", "E", "A", "G", "A", "E", "H", "R"];
  redBack.forEach((t, c) => (b[9][c] = p(t, "red")));
  // Red cannons row 7 cols 1 and 7
  b[7][1] = p("C", "red");
  b[7][7] = p("C", "red");
  // Red soldiers row 6 cols 0,2,4,6,8
  [0, 2, 4, 6, 8].forEach((c) => (b[6][c] = p("S", "red")));

  return b;
}

export interface BoardState {
  board: Board;
  history: { from: Coord; to: Coord; captured: Cell }[];
}

export function applyMoves(moves: MoveDef[]): Board {
  const b = initialBoard();
  for (const m of moves) {
    const [fr, fc] = m.from;
    const [tr, tc] = m.to;
    const piece = b[fr][fc];
    b[fr][fc] = null;
    b[tr][tc] = piece;
  }
  return b;
}

export function applyMovesUpTo(moves: MoveDef[], upToInclusive: number): Board {
  if (upToInclusive < 0) return initialBoard();
  return applyMoves(moves.slice(0, upToInclusive + 1));
}

// Czech notation for moves: R1, Č1, R2, Č2... (Red odd, Black even)
export function moveLabel(index: number): string {
  const pair = Math.floor(index / 2) + 1;
  return index % 2 === 0 ? `R${pair}` : `Č${pair}`;
}

export function moveSide(index: number): Side {
  return index % 2 === 0 ? "red" : "black";
}

// Algebraic-ish coord: column a–i, row 10–1 (from red's view)
export function coordLabel(row: number, col: number): string {
  const file = "abcdefghi"[col];
  const rank = ROWS - row; // row 9 → 1, row 0 → 10
  return `${file}${rank}`;
}
