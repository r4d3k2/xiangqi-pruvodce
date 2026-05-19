import type { PieceType, Side } from "../lib/xiangqi";

export interface DiagramTarget {
  row: number;
  col: number;
  kind?: "move" | "capture";
}

export interface MoveDiagram {
  rows: number;
  cols: number;
  pieceRow: number;
  pieceCol: number;
  targets: DiagramTarget[];
  river?: { afterRow: number };
  palace?: { row: number; col: number; rows: number; cols: number };
  blockers?: { row: number; col: number }[];
}

export interface PieceInfo {
  type: PieceType;
  redChar: string;
  blackChar: string;
  pinyinRed: string;
  pinyinBlack: string;
  csName: string;
  movement: string;
  diagram: MoveDiagram;
}

export const PIECES: Record<PieceType, PieceInfo> = {
  G: {
    type: "G",
    redChar: "帥",
    blackChar: "將",
    pinyinRed: "shuài",
    pinyinBlack: "jiàng",
    csName: "Generál",
    movement: "1 pole ortogonálně, pouze v paláci (3×3).",
    diagram: {
      rows: 5,
      cols: 5,
      pieceRow: 3,
      pieceCol: 2,
      palace: { row: 2, col: 1, rows: 3, cols: 3 },
      targets: [
        { row: 2, col: 2 },
        { row: 4, col: 2 },
        { row: 3, col: 1 },
        { row: 3, col: 3 },
      ],
    },
  },
  A: {
    type: "A",
    redChar: "仕",
    blackChar: "士",
    pinyinRed: "shì",
    pinyinBlack: "shì",
    csName: "Rádce",
    movement: "1 pole diagonálně, pouze v paláci.",
    diagram: {
      rows: 5,
      cols: 5,
      pieceRow: 3,
      pieceCol: 2,
      palace: { row: 2, col: 1, rows: 3, cols: 3 },
      targets: [
        { row: 2, col: 1 },
        { row: 2, col: 3 },
        { row: 4, col: 1 },
        { row: 4, col: 3 },
      ],
    },
  },
  E: {
    type: "E",
    redChar: "相",
    blackChar: "象",
    pinyinRed: "xiàng",
    pinyinBlack: "xiàng",
    csName: "Slon",
    movement:
      "2 pole diagonálně (formace „田“), nesmí přes řeku, blokován figurou na mezipolí.",
    diagram: {
      rows: 5,
      cols: 5,
      pieceRow: 3,
      pieceCol: 2,
      river: { afterRow: 1 },
      targets: [
        { row: 1, col: 0 },
        { row: 1, col: 4 },
      ],
    },
  },
  H: {
    type: "H",
    redChar: "馬",
    blackChar: "馬",
    pinyinRed: "mǎ",
    pinyinBlack: "mǎ",
    csName: "Kůň",
    movement: "L-tvar (1+1 diag.), blokován figurou na přímém mezipolí.",
    diagram: {
      rows: 5,
      cols: 5,
      pieceRow: 2,
      pieceCol: 2,
      targets: [
        { row: 0, col: 1 },
        { row: 0, col: 3 },
        { row: 1, col: 0 },
        { row: 1, col: 4 },
        { row: 3, col: 0 },
        { row: 3, col: 4 },
        { row: 4, col: 1 },
        { row: 4, col: 3 },
      ],
    },
  },
  R: {
    type: "R",
    redChar: "車",
    blackChar: "車",
    pinyinRed: "jū",
    pinyinBlack: "jū",
    csName: "Vůz",
    movement: "Libovolně daleko ortogonálně (jako věž v šachu).",
    diagram: {
      rows: 5,
      cols: 5,
      pieceRow: 2,
      pieceCol: 2,
      targets: [
        { row: 0, col: 2 },
        { row: 1, col: 2 },
        { row: 3, col: 2 },
        { row: 4, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
      ],
    },
  },
  C: {
    type: "C",
    redChar: "炮",
    blackChar: "砲",
    pinyinRed: "pào",
    pinyinBlack: "pào",
    csName: "Kanon",
    movement:
      "Pohyb jako vůz, ale k braní musí přeskočit přesně 1 figuru.",
    diagram: {
      rows: 5,
      cols: 5,
      pieceRow: 2,
      pieceCol: 2,
      blockers: [{ row: 2, col: 4 }],
      targets: [
        { row: 0, col: 2 },
        { row: 1, col: 2 },
        { row: 3, col: 2 },
        { row: 4, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
      ],
    },
  },
  S: {
    type: "S",
    redChar: "兵",
    blackChar: "卒",
    pinyinRed: "bīng",
    pinyinBlack: "zú",
    csName: "Pěšák",
    movement:
      "1 pole dopředu; po překročení řeky i 1 pole do stran.",
    diagram: {
      rows: 5,
      cols: 5,
      pieceRow: 2,
      pieceCol: 2,
      river: { afterRow: 2 },
      targets: [
        { row: 1, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 3 },
      ],
    },
  },
};

export function pieceChar(type: PieceType, side: Side): string {
  return side === "red" ? PIECES[type].redChar : PIECES[type].blackChar;
}

export const PIECE_TYPES: PieceType[] = ["G", "A", "E", "H", "R", "C", "S"];
