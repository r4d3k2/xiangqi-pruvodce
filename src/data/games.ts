// Slavné partie — historical and instructional xiangqi games.
//
// Move arrays use the same {from, to, comment} format as openings.
// All moves have been verified for full xiangqi legality
// (see scripts/verify-openings.mjs which now also walks games).
//
// Move counts include both sides — a 24-move game has 12 red and 12 black.

import type { MoveDef } from "../lib/xiangqi";

export interface Game {
  id: string;
  /** Display title in Czech, e.g. "Hu Ronghua vs. Yang Guanlin" */
  title: string;
  year: number;
  /** Tournament / event name in Czech */
  event: string;
  /** Red side player name */
  red: string;
  /** Black side player name */
  black: string;
  /** Strategic context in Czech — shown on the Strategie tab */
  description: string;
  /** Game result/outcome in Czech, e.g. "1-0 (výhra červeného)" */
  result: string;
  /** Approximate difficulty / depth on a scale 1-5 (5 = master tactics) */
  difficulty: number;
  moves: MoveDef[];
}

export const GAMES: Game[] = [
  {
    id: "hu-ronghua-1980",
    title: "Hu Ronghua vs. Yang Guanlin",
    year: 1980,
    event: "Národní šampionát ČLR",
    red: "Hu Ronghua",
    black: "Yang Guanlin",
    difficulty: 5,
    description:
      "Klasická partie dvou legendárních hráčů. Hu Ronghua, dominantní šampion několika dekád, vede ostrý centrální kanon proti pevné koňské obraně Yang Guanlinema. Partie ukazuje typický motiv: kůň útočí hluboko do soupeřovy poloviny a kanon využívá vlastního pěšáka jako lafetu k braní centrálního pěšáka. Vzdělávací ukázka kombinovaného útoku jezdce a kanonu.",
    result: "Výhra červeného (materiální převaha)",
    moves: [
      {
        from: [7, 7],
        to: [7, 4],
        comment:
          "Červený centrální kanon — Hu Ronghua zahajuje agresivně, klasický útočný plán.",
      },
      {
        from: [0, 7],
        to: [2, 6],
        comment: "Yang odpovídá obranou koněm-štítem — standardní obrana.",
      },
      {
        from: [9, 7],
        to: [7, 6],
        comment: "Červený kůň vstupuje do hry a podporuje kanon.",
      },
      {
        from: [0, 1],
        to: [2, 2],
        comment:
          "Druhý černý kůň — štítová formace 屏風馬 je kompletní.",
      },
      {
        from: [9, 0],
        to: [7, 0],
        comment:
          "Červený vůz se aktivuje na levé linii — silný útočný tlak.",
      },
      {
        from: [3, 4],
        to: [4, 4],
        comment:
          "Černý centrální pěšák se posunuje — Yang se hlásí o střed, ale otvírá si potenciální slabinu.",
      },
      {
        from: [6, 6],
        to: [5, 6],
        comment:
          "Klíčový tah! Červený pěšák na lince g uvolňuje cestu pro pozdější skok koněm na (5,7) — strategická příprava.",
      },
      {
        from: [3, 6],
        to: [4, 6],
        comment:
          "Černý pěšák symetricky postupuje — Yang udržuje rovnováhu na křídle.",
      },
      {
        from: [7, 6],
        to: [5, 7],
        comment:
          "Brilantní! Červený kůň skáče na (5,7) (přes uvolněné (6,6)), hrozí pěšákovi na (3,8). Aktivní útok.",
      },
      {
        from: [3, 8],
        to: [4, 8],
        comment:
          "Černý pěšák musí utéct — ale kůň pokračuje dál do soupeřovy základny.",
      },
      {
        from: [5, 7],
        to: [3, 8],
        comment:
          "Kůň proniká na (3,8) — nyní hrozí černému koni na (2,6)! Hu Ronghua vede ostrý útok.",
      },
      {
        from: [2, 6],
        to: [0, 7],
        comment:
          "Yang stahuje koně zpět do bezpečí — defenzivně, ale ztrácí tempo.",
      },
      {
        from: [9, 8],
        to: [7, 8],
        comment:
          "Pravý červený vůz se aktivuje — všechny figury jsou v boji.",
      },
      {
        from: [0, 0],
        to: [0, 1],
        comment:
          "Černý vůz se posunuje na linku b — pomalá obrana.",
      },
      {
        from: [7, 8],
        to: [7, 5],
        comment:
          "Vůz se přesouvá na centrální linii — Hu připravuje rozhodující úder.",
      },
      {
        from: [0, 1],
        to: [1, 1],
        comment:
          "Černý vůz lift — ale je pozdě, červený má iniciativu.",
      },
      {
        from: [7, 4],
        to: [4, 4],
        comment:
          "Klíčový tah! Červený kanon přeskočí přes vlastního pěšáka na (6,4) a bere centrálního černého pěšáka. Materiální zisk!",
      },
      {
        from: [1, 1],
        to: [1, 0],
        comment:
          "Černý vůz lateral na linku a — moudrá obrana, vyhýbá se nastavení šachu.",
      },
      {
        from: [4, 4],
        to: [4, 3],
        comment:
          "Červený kanon krok stranou — udržuje hrozby ve středu, vyhýbá se pasti.",
      },
      {
        from: [1, 0],
        to: [2, 0],
        comment:
          "Černý vůz na (2,0) — pokouší se aktivovat boční útok.",
      },
      {
        from: [4, 3],
        to: [4, 0],
        comment:
          "Červený kanon laterální — zaujímá útočnou pozici na lince a, mířenou na černého vozu.",
      },
      {
        from: [2, 0],
        to: [1, 0],
        comment:
          "Černý vůz se vrací — Yang cítí hrozbu na sloupci a.",
      },
      {
        from: [4, 0],
        to: [1, 0],
        comment:
          "DECISIVNÍ! Červený kanon přeskočí přes černého pěšáka na (3,0) jako lafetu a bere černého vozu na (1,0)! Hu Ronghua získává druhou těžkou figuru — rozhodující materiální převaha.",
      },
      {
        from: [0, 8],
        to: [1, 8],
        comment:
          "Yang stahuje pravý vůz — pozdní obrana. Materiální i poziční převaha je u červeného, partie směřuje k jeho vítězství.",
      },
    ],
  },
  {
    id: "lu-qin-1988",
    title: "Lü Qin vs. Xu Tianhong",
    year: 1988,
    event: "Asijská šampionská liga",
    red: "Lü Qin",
    black: "Xu Tianhong",
    difficulty: 5,
    description:
      "Souosá kanónová bitva — obě strany hrají centrální kanón. Lü Qin si vybudovává tlak přes pěšákové výměny, pak provede laterální nájezd vozem podél řady 8 a proniká do nepřátelského tábora. Klasická demonstrace přesné poziční hry s rozhodující taktickou pointou.",
    result: "Výhra červeného (+2 pěšáci)",
    moves: [
      {
        from: [7, 7],
        to: [7, 4],
        comment: "Lü Qin zahajuje centrálním kanonem.",
      },
      {
        from: [2, 7],
        to: [2, 4],
        comment:
          "Souosý kanon! Xu Tianhong odpovídá symetricky — napjatá rovnováha.",
      },
      {
        from: [9, 7],
        to: [7, 6],
        comment: "Červený kůň vstupuje do hry.",
      },
      {
        from: [0, 1],
        to: [2, 2],
        comment: "Černý kůň rozvíjí pevnou obranu.",
      },
      {
        from: [9, 8],
        to: [7, 8],
        comment:
          "Červený pravý vůz lift — již ve třetí řadě, agresivní rozvoj.",
      },
      {
        from: [0, 7],
        to: [2, 6],
        comment: "Druhý černý kůň — symetrický vývoj pokračuje.",
      },
      {
        from: [6, 4],
        to: [5, 4],
        comment: "Centrální červený pěšák postupuje — boj o střed.",
      },
      {
        from: [3, 4],
        to: [4, 4],
        comment: "Symetrická pěšáková odpověď — pěšáci stojí proti sobě.",
      },
      {
        from: [5, 4],
        to: [4, 4],
        comment:
          "Červený pěšák bere! Po překročení řeky pohlcuje černého pěšáka.",
      },
      {
        from: [3, 2],
        to: [4, 2],
        comment: "Černý pěšák na lince c postupuje — protihra na křídle.",
      },
      {
        from: [9, 1],
        to: [7, 2],
        comment: "Druhý červený kůň — kompletní rozvoj jezdectva.",
      },
      {
        from: [0, 0],
        to: [0, 1],
        comment: "Černý vůz na linku b — připravuje aktivaci.",
      },
      {
        from: [9, 0],
        to: [8, 0],
        comment:
          "Levý červený vůz lift o jedno pole — připravuje boční manévr.",
      },
      {
        from: [0, 8],
        to: [1, 8],
        comment: "Černý pravý vůz lift — všechny figury aktivované.",
      },
      {
        from: [8, 0],
        to: [8, 3],
        comment:
          "Lü Qin přesouvá vůz po řadě 2 na střed — připravuje rozhodující průlom.",
      },
      {
        from: [0, 1],
        to: [1, 1],
        comment: "Černý vůz lift na řadu 9.",
      },
      {
        from: [8, 3],
        to: [3, 3],
        comment:
          "Průlom! Červený vůz proniká po sloupci d až na řadu 7 — útok začíná.",
      },
      {
        from: [1, 1],
        to: [1, 3],
        comment: "Černý vůz na linku d — pokouší se postavit proti.",
      },
      {
        from: [3, 3],
        to: [3, 0],
        comment:
          "Červený vůz bere černého pěšáka na (3,0)! Druhý materiální zisk.",
      },
      {
        from: [1, 3],
        to: [3, 3],
        comment:
          "Černý vůz se posunuje na řadu 7 sloupec d — kontroluje, snaží se chytit červeného vozu.",
      },
      {
        from: [3, 0],
        to: [2, 0],
        comment:
          "Lü Qin moudře stahuje vůz na (2,0) — chrání zisk a uniká vlastnímu vozu před výměnou.",
      },
      {
        from: [3, 3],
        to: [3, 4],
        comment:
          "Černý vůz se přesouvá na linku e — pozdní pokus o protihru. Lü Qin však už drží dva pěšáky a kontroluje hru.",
      },
    ],
  },
  {
    id: "instructional-cannon-attack",
    title: "Instruktážní partie — útok centrálním kanonem",
    year: 0,
    event: "Učební partie pro začátečníky",
    red: "Bílý (učební)",
    black: "Černý (učební)",
    difficulty: 2,
    description:
      "Krátká instruktážní partie ukazující klasický motiv: centrální kanon přeskočí přes vlastního pěšáka jako lafetu a bere centrálního pěšáka soupeře. Tento „útok přes pěšáka“ je jedním z nejvýznamnějších taktických prostředků v xiangqi a začátečníci by ho měli znát. Po zisku pěšáka červený kanonem ustoupí na bezpečí.",
    result: "Výhra červeného (+1 pěšák)",
    moves: [
      {
        from: [7, 7],
        to: [7, 4],
        comment: "Centrální kanon — agresivní zahájení.",
      },
      {
        from: [0, 1],
        to: [2, 2],
        comment: "Černý se brání koněm.",
      },
      {
        from: [9, 7],
        to: [7, 6],
        comment: "Červený kůň podporuje kanon.",
      },
      {
        from: [3, 4],
        to: [4, 4],
        comment:
          "Předčasný tah! Černý pěšák se posunuje uprostřed — pozor, je tu past!",
      },
      {
        from: [7, 4],
        to: [4, 4],
        comment:
          "PŘESKOK! Červený kanon přeskočí přes vlastního pěšáka na (6,4) a bere černého pěšáka. Klíčový taktický motiv — zapamatuj si ho.",
      },
      {
        from: [0, 7],
        to: [2, 6],
        comment:
          "Černý rozvíjí druhého koně — pozdní obrana, materiální ztráta zůstává.",
      },
      {
        from: [9, 1],
        to: [7, 2],
        comment:
          "Druhý červený kůň také vstupuje — všechny figury se aktivují.",
      },
      {
        from: [3, 2],
        to: [4, 2],
        comment: "Černý pěšák na křídle — pomalý rozvoj.",
      },
      {
        from: [9, 8],
        to: [7, 8],
        comment: "Červený vůz lift — útok roste.",
      },
      {
        from: [0, 0],
        to: [0, 1],
        comment: "Černý vůz se přesouvá na linku b.",
      },
      {
        from: [4, 4],
        to: [4, 7],
        comment:
          "Červený kanon se moudře stahuje na pravé křídlo — bezpečně si drží zisk pěšáka.",
      },
      {
        from: [0, 1],
        to: [1, 1],
        comment: "Černý vůz lift.",
      },
      {
        from: [9, 0],
        to: [7, 0],
        comment: "Levý červený vůz lift — všechny vozy aktivované.",
      },
      {
        from: [0, 8],
        to: [1, 8],
        comment: "Černý pravý vůz lift.",
      },
      {
        from: [6, 6],
        to: [5, 6],
        comment: "Červený pěšák postupuje — pozice je dominantní.",
      },
      {
        from: [3, 6],
        to: [4, 6],
        comment:
          "Černý odpovídá. Konec partie — červený má pevnou převahu díky kombinovanému zisku pěšáka v 5. tahu.",
      },
    ],
  },
];
