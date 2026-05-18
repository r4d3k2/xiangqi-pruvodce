import type { PieceType, Side } from "../lib/xiangqi";

export interface PieceInfo {
  type: PieceType;
  redChar: string;
  blackChar: string;
  pinyinRed: string;
  pinyinBlack: string;
  csName: string;
  movement: string;
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
  },
  A: {
    type: "A",
    redChar: "仕",
    blackChar: "士",
    pinyinRed: "shì",
    pinyinBlack: "shì",
    csName: "Rádce",
    movement: "1 pole diagonálně, pouze v paláci.",
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
  },
  H: {
    type: "H",
    redChar: "馬",
    blackChar: "馬",
    pinyinRed: "mǎ",
    pinyinBlack: "mǎ",
    csName: "Kůň",
    movement: "L-tvar (1+1 diag.), blokován figurou na přímém mezipolí.",
  },
  R: {
    type: "R",
    redChar: "車",
    blackChar: "車",
    pinyinRed: "jū",
    pinyinBlack: "jū",
    csName: "Vůz",
    movement: "Libovolně daleko ortogonálně (jako věž v šachu).",
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
  },
};

export function pieceChar(type: PieceType, side: Side): string {
  return side === "red" ? PIECES[type].redChar : PIECES[type].blackChar;
}
