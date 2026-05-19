import type { PieceType, Side } from "../lib/xiangqi";

export interface DiagramTarget {
  row: number;
  col: number;
  /**
   * - "move":      valid destination (red dot + dashed arrow)
   * - "blocked":   would be reachable in principle, but blocked by a piece on
   *                the leg/midpoint (grey dot with X)
   * - "forbidden": forbidden by rule (e.g. across river for elephant) — red X
   * - "captured":  cannon capture target — enemy silhouette + thick arrow
   */
  kind?: "move" | "blocked" | "forbidden" | "captured";
}

export interface MoveDiagram {
  rows: number;
  cols: number;
  pieceRow: number;
  pieceCol: number;
  targets: DiagramTarget[];
  /** river line drawn between row `afterRow` and `afterRow + 1` */
  river?: { afterRow: number };
  /** outlined palace (drawn with diagonals) */
  palace?: { row: number; col: number; rows: number; cols: number };
  /** opaque blocker silhouettes at these cells (own or enemy piece) */
  blockers?: { row: number; col: number }[];
  /** highlight squares (e.g. advisor's 5 legal positions) */
  highlightedSquares?: { row: number; col: number }[];
  /** an "X" mark, for "no-backward" on soldier or "no flying general line" */
  forbiddenSquares?: { row: number; col: number }[];
  /** A second piece (e.g. opposing general for the flying-general rule).
   *  Renders as a piece silhouette using the given side. */
  secondPiece?: {
    row: number;
    col: number;
    side?: Side;
    /** if true, draw a dashed line between the piece and secondPiece */
    line?: boolean;
  };
  /** Small heading above the diagram. */
  label?: string;
}

export interface PieceInfo {
  type: PieceType;
  redChar: string;
  blackChar: string;
  pinyinRed: string;
  pinyinBlack: string;
  csName: string;
  /** Main movement description (one or more sentences). */
  movement: string;
  /** Optional second paragraph for special rules (e.g. flying general). */
  specialRule?: string;
  /** One or more diagrams. Cannon and soldier use two; the rest use one. */
  diagrams: MoveDiagram[];
}

export const PIECES: Record<PieceType, PieceInfo> = {
  G: {
    type: "G",
    redChar: "帥",
    blackChar: "將",
    pinyinRed: "shuài",
    pinyinBlack: "jiàng",
    csName: "Generál",
    movement:
      "Jeden krok ortogonálně (nahoru, dolů, vlevo, vpravo). Smí se pohybovat pouze uvnitř paláce (3×3 pole).",
    specialRule:
      "Dva generálové nesmí stát na stejném sloupci bez figury mezi sebou — jako by se navzájem ohrožovali jako vozy. Tomuto pravidlu se říká „létající generál“ (飛將). V koncovce se tohoto pravidla využívá k matování.",
    diagrams: [
      {
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
        secondPiece: { row: 0, col: 2, side: "black", line: true },
        forbiddenSquares: [{ row: 1, col: 2 }],
        label: "Pohyb v paláci + létající generál",
      },
    ],
  },

  A: {
    type: "A",
    redChar: "仕",
    blackChar: "士",
    pinyinRed: "shì",
    pinyinBlack: "shì",
    csName: "Rádce",
    movement:
      "Jeden krok diagonálně, ale pouze uvnitř paláce. Rádce může obsadit pouze 5 pozic v paláci (střed a čtyři rohy). Jeho úlohou je chránit generála a blokovat diagonální útoky na palác.",
    diagrams: [
      {
        rows: 3,
        cols: 3,
        pieceRow: 1,
        pieceCol: 1,
        palace: { row: 0, col: 0, rows: 3, cols: 3 },
        targets: [
          { row: 0, col: 0 },
          { row: 0, col: 2 },
          { row: 2, col: 0 },
          { row: 2, col: 2 },
        ],
        highlightedSquares: [
          { row: 0, col: 0 },
          { row: 0, col: 2 },
          { row: 1, col: 1 },
          { row: 2, col: 0 },
          { row: 2, col: 2 },
        ],
        label: "5 možných pozic v paláci",
      },
    ],
  },

  E: {
    type: "E",
    redChar: "相",
    blackChar: "象",
    pinyinRed: "xiàng",
    pinyinBlack: "xiàng",
    csName: "Slon",
    movement:
      "Přesně dva kroky diagonálně (tvar znaku 田 — „pole“). Má dvě omezení: 1) Může být zablokován — pokud na prostředním poli diagonály stojí jakákoliv figura (vlastní nebo soupeřova), slon nemůže přes ni přeskočit. 2) Nesmí překročit řeku — slon se pohybuje pouze na vlastní polovině desky. Na celé polovině má k dispozici pouze 7 možných pozic.",
    diagrams: [
      {
        rows: 5,
        cols: 5,
        pieceRow: 2,
        pieceCol: 2,
        river: { afterRow: 1 },
        targets: [
          { row: 0, col: 0, kind: "forbidden" },
          { row: 0, col: 4, kind: "forbidden" },
          { row: 4, col: 0, kind: "blocked" },
          { row: 4, col: 4, kind: "move" },
        ],
        blockers: [{ row: 3, col: 1 }],
        label: "Řeka + blokování na mezipolí",
      },
    ],
  },

  H: {
    type: "H",
    redChar: "馬",
    blackChar: "馬",
    pinyinRed: "mǎ",
    pinyinBlack: "mǎ",
    csName: "Kůň",
    movement:
      "Podobně jako jezdec v klasických šachách, ale s důležitým rozdílem. Kůň se pohybuje ve tvaru písmene Y: nejprve jeden krok ortogonálně (nahoru, dolů, vlevo nebo vpravo) a poté jeden krok diagonálně ve směru od výchozího pole.",
    specialRule:
      "Klíčové pravidlo: Kůň může být ZABLOKOVÁN. Pokud na poli přímo vedle koně (tam, kam by udělal první ortogonální krok) stojí jakákoliv figura, kůň nemůže tímto směrem skočit. Dva koně se tak mohou navzájem ohrožovat, ale pouze jeden z nich může útočit, zatímco druhý je zablokován. Silní hráči využívají blokování koně jako důležitou taktiku.",
    diagrams: [
      {
        rows: 5,
        cols: 5,
        pieceRow: 2,
        pieceCol: 2,
        // Blockers on the "up" and "down" leg squares; remaining 4 targets
        // (left-leg + right-leg pairs) are reachable.
        blockers: [
          { row: 1, col: 2 },
          { row: 3, col: 2 },
        ],
        targets: [
          { row: 0, col: 1, kind: "blocked" },
          { row: 0, col: 3, kind: "blocked" },
          { row: 4, col: 1, kind: "blocked" },
          { row: 4, col: 3, kind: "blocked" },
          { row: 1, col: 0, kind: "move" },
          { row: 3, col: 0, kind: "move" },
          { row: 1, col: 4, kind: "move" },
          { row: 3, col: 4, kind: "move" },
        ],
        label: "Y-tvar: bez překážky vlevo/vpravo, zablokováno nahoře/dole",
      },
    ],
  },

  R: {
    type: "R",
    redChar: "車",
    blackChar: "車",
    pinyinRed: "jū",
    pinyinBlack: "jū",
    csName: "Vůz",
    movement:
      "Libovolný počet polí ortogonálně (nahoru, dolů, vlevo, vpravo) — stejně jako věž v klasických šachách. Nemá žádná omezení v pohybu — může se pohybovat přes řeku i kamkoli na desce. Je to nejsilnější figura ve hře (po generálovi).",
    diagrams: [
      {
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
        label: "Ortogonální pohyb bez omezení",
      },
    ],
  },

  C: {
    type: "C",
    redChar: "炮",
    blackChar: "砲",
    pinyinRed: "pào",
    pinyinBlack: "pào",
    csName: "Kanon",
    movement:
      "Při pouhém přesunu se pohybuje stejně jako vůz — libovolný počet polí ortogonálně. Ale při braní má unikátní pravidlo: musí přeskočit přesně jednu figuru (vlastní nebo soupeřovu), tzv. „lafetu“ (anglicky „screen“). Kanon tedy potřebuje prostředníka, aby mohl brát.",
    specialRule:
      "Toto pravidlo dělá kanon mocným v zahájení (kde je na desce mnoho figur), ale slabším v koncovce (kde prostředníci mizí).",
    diagrams: [
      {
        // Scenario 1 — movement like a rook, no jumping
        rows: 5,
        cols: 5,
        pieceRow: 4,
        pieceCol: 2,
        targets: [
          { row: 3, col: 2 },
          { row: 2, col: 2 },
          { row: 1, col: 2 },
          { row: 0, col: 2 },
          { row: 4, col: 0 },
          { row: 4, col: 1 },
          { row: 4, col: 3 },
          { row: 4, col: 4 },
        ],
        label: "Pohyb (bez braní) — jako vůz",
      },
      {
        // Scenario 2 — capture with screen
        rows: 5,
        cols: 5,
        pieceRow: 4,
        pieceCol: 2,
        blockers: [{ row: 2, col: 2 }],
        targets: [{ row: 0, col: 2, kind: "captured" }],
        label: "Braní — přeskočí přesně 1 figuru (lafetu)",
      },
    ],
  },

  S: {
    type: "S",
    redChar: "兵",
    blackChar: "卒",
    pinyinRed: "bīng",
    pinyinBlack: "zú",
    csName: "Pěšák",
    movement:
      "Před překročením řeky se pohybuje pouze dopředu o jedno pole. Po překročení řeky získává navíc možnost pohybu do stran (vlevo a vpravo) o jedno pole — ale nikdy nemůže couvat. Pěšák se nepromění ani po dosažení poslední řady. Skupina pěšáků za řekou může být překvapivě silná díky bočnímu pohybu.",
    diagrams: [
      {
        // Before river — forward only
        rows: 3,
        cols: 3,
        pieceRow: 1,
        pieceCol: 1,
        targets: [{ row: 0, col: 1 }],
        forbiddenSquares: [
          { row: 1, col: 0 },
          { row: 1, col: 2 },
          { row: 2, col: 1 },
        ],
        label: "Před řekou: jen vpřed",
      },
      {
        // After river — forward + sides; backward still forbidden
        rows: 3,
        cols: 3,
        pieceRow: 1,
        pieceCol: 1,
        targets: [
          { row: 0, col: 1 },
          { row: 1, col: 0 },
          { row: 1, col: 2 },
        ],
        forbiddenSquares: [{ row: 2, col: 1 }],
        label: "Po řece: vpřed + do stran (nikdy zpět)",
      },
    ],
  },
};

export function pieceChar(type: PieceType, side: Side): string {
  return side === "red" ? PIECES[type].redChar : PIECES[type].blackChar;
}

export const PIECE_TYPES: PieceType[] = ["G", "A", "E", "H", "R", "C", "S"];
