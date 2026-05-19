import type { MoveDef } from "../lib/xiangqi";

export interface Variant {
  id: string;
  name: string;
  zh: string;
  strategy: string;
  moves: MoveDef[];
}

export interface Opening {
  id: string;
  name: string;
  zh: string;
  difficulty: number; // 1–5
  variants: Variant[];
}

export const OPENINGS: Opening[] = [
  {
    id: "central-cannon",
    name: "Centrální kanon",
    zh: "中炮局",
    difficulty: 5,
    variants: [
      {
        id: "central-cannon-screen-horses",
        name: "Obrana koněm-štítem",
        zh: "屏風馬",
        strategy:
          "Centrální kanon je nejhranější zahájení v xiangqi. Červený umísťuje kanon do středu páté linie, odkud ohrožuje nepřátelský palác. Obrana koněm-štítem odpovídá pevnou strukturou s oběma koňmi, kteří se vzájemně kryjí a tvoří stabilní obrannou zeď. Formace je spolehlivá a vhodná jak pro začátečníky, tak pro pokročilé hráče.",
        moves: [
          {
            from: [7, 7],
            to: [7, 4],
            comment:
              "Červený kanon obsazuje střed páté linie — základní útočný záměr. Kanon hrozí přesunem přes řeku přímo na soupeřův palác.",
          },
          {
            from: [0, 7],
            to: [2, 6],
            comment:
              "Černý kůň se rozvíjí na f8 — začíná formovat štítovou obranu.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment:
              "Červený kůň vstupuje do hry a podporuje kanon. Oba červení koně brzy budou aktivní.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment:
              "Druhý černý kůň na d8 — štítová formace (屏風馬) je kompletní. Oba koně se vzájemně chrání.",
          },
          {
            from: [9, 0],
            to: [7, 0],
            comment:
              "Červený vůz aktivuje se na levé linii — přímý tlak na černé křídlo. Vůz je nejsilnější figura.",
          },
          {
            from: [3, 4],
            to: [4, 4],
            comment:
              "Centrální pěšák se posouvá o jedno pole — mírný protiútok a boj o střed.",
          },
          {
            from: [6, 6],
            to: [5, 6],
            comment:
              "Červený pěšák na lince g vyráží vpřed — otevírá pole pro pravého koně a posiluje křídlo.",
          },
          {
            from: [3, 2],
            to: [4, 2],
            comment:
              "Černý pěšák na lince c symetricky postupuje — drží rovnováhu a podporuje koně.",
          },
          {
            from: [9, 8],
            to: [7, 8],
            comment:
              "Druhý červený vůz se aktivuje na pravém křídle — oba vozy jsou nyní rozvinuté.",
          },
          {
            from: [0, 0],
            to: [0, 1],
            comment:
              "Černý vůz se posunuje na linku b, kde po odejití koně získává prostor.",
          },
          {
            from: [9, 3],
            to: [8, 4],
            comment:
              "Červený rádce vstupuje do paláce — generál má pevnější ochranu před útokem.",
          },
          {
            from: [0, 2],
            to: [2, 4],
            comment:
              "Černý slon do středu doplňuje obranu — formace 屏風象 (sloní zeď) je kompletní.",
          },
        ],
      },
      {
        id: "central-cannon-same-direction",
        name: "Souosý kanon",
        zh: "順炮",
        strategy:
          "Souosý kanon je přímá a symetrická odpověď na centrální kanon — černý okamžitě kopíruje tah. Vzniká symetrická, ale výbušná pozice plná taktických hrozeb na obou stranách. Hra je komplikovaná a vhodná pro zkušené hráče, kteří milují dynamické boje plné taktiky.",
        moves: [
          {
            from: [7, 7],
            to: [7, 4],
            comment:
              "Červený kanon obsazuje střed páté linie — útočné zahájení.",
          },
          {
            from: [2, 7],
            to: [2, 4],
            comment:
              "Souosá odpověď! Černý kanon se symetricky přesunuje do středu — napjatá rovnováha hrozeb.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment: "Červený kůň vstupuje do hry — hra se rychle komplikuje.",
          },
          {
            from: [0, 7],
            to: [2, 6],
            comment: "Černý kůň kryje svůj kanon a zároveň se rozvíjí.",
          },
          {
            from: [9, 8],
            to: [7, 8],
            comment:
              "Červený vůz aktivuje pravé křídlo — tlak roste na obou stranách.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment:
              "Druhý černý kůň uzavírá zahájení — oboustranně napjatá, symetrická pozice.",
          },
          {
            from: [9, 0],
            to: [8, 0],
            comment:
              "Levý červený vůz vyjíždí o jedno pole — připravuje aktivaci na novou linii.",
          },
          {
            from: [0, 8],
            to: [1, 8],
            comment:
              "Černý vůz symetricky stoupá — souosá formace pokračuje na obou stranách.",
          },
          {
            from: [6, 2],
            to: [5, 2],
            comment:
              "Červený pěšák na lince c vyráží vpřed — otvírá si prostor pro rozvoj.",
          },
          {
            from: [3, 6],
            to: [4, 6],
            comment:
              "Černý pěšák symetricky postupuje na lince g — symetrie zůstává neporušena.",
          },
          {
            from: [9, 3],
            to: [8, 4],
            comment:
              "Červený rádce vstupuje do středu paláce — generál získává pevnou ochranu.",
          },
          {
            from: [0, 5],
            to: [1, 4],
            comment:
              "Černý rádce zrcadlově posiluje obranu paláce — souosá hra v plné rovnováze.",
          },
        ],
      },
    ],
  },
  {
    id: "horse-opening",
    name: "Koňská hra",
    zh: "起馬局",
    difficulty: 4,
    variants: [
      {
        id: "horse-double",
        name: "Dvojitý kůň",
        zh: "雙馬局",
        strategy:
          "Koňská hra zahajuje koněm místo kanonu — klidnější a flexibilnější přístup. Kůň nekontroluje střed agresivně jako kanon, ale zachovává možnosti ve všech směrech. Dvojitá koňská formace je vyvážená a vhodná pro poziční hráče, kteří preferují dlouhodobou strategii.",
        moves: [
          {
            from: [9, 1],
            to: [7, 2],
            comment:
              "Kůň místo kanonu — jemný, flexibilní start bez přímé hrozby.",
          },
          {
            from: [0, 7],
            to: [2, 6],
            comment: "Černý kůň odpovídá symetricky na pravém křídle.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment:
              "Druhý červený kůň — formuje se dvojitá koňská formace.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment:
              "Symetrie — i černý hraje dvojitého koně. Vyrovnaná, harmonická pozice.",
          },
          {
            from: [9, 8],
            to: [8, 8],
            comment:
              "Červený vůz se aktivuje na pravém křídle — příprava útoku.",
          },
          {
            from: [0, 8],
            to: [1, 8],
            comment:
              "Černý vůz reaguje okamžitě — symetrie zachována i na vozových liniích.",
          },
          {
            from: [6, 2],
            to: [5, 2],
            comment:
              "Červený pěšák na lince c postupuje vpřed — podporuje koně a otvírá komunikační linku.",
          },
          {
            from: [3, 2],
            to: [4, 2],
            comment:
              "Černý pěšák symetricky odpovídá — vyrovnaná dvojkoňová formace pokračuje.",
          },
          {
            from: [9, 0],
            to: [8, 0],
            comment:
              "Levý červený vůz vyjíždí o jedno pole — připravuje boční manévry.",
          },
          {
            from: [0, 0],
            to: [1, 0],
            comment:
              "Levý černý vůz se aktivuje symetricky — pomalu se rozvíjí oba stran.",
          },
          {
            from: [8, 0],
            to: [8, 3],
            comment:
              "Červený vůz se přesouvá podél řady 2 na centrální linku — připraven k centrálním zásahům.",
          },
          {
            from: [1, 0],
            to: [1, 3],
            comment:
              "Černý vůz zrcadlově. Vyrovnaná, napjatě poziční hra plně rozvinutá.",
          },
        ],
      },
      {
        id: "horse-elephant",
        name: "Kůň a slon",
        zh: "馬象聯防",
        strategy:
          "Varianta koně a slona kombinuje flexibilitu koňské hry s pevností slonové obrany. Slon kryje přístupy k palácové oblasti a kůň kontroluje střed. Kombinace vytváří houževnatou obranu, která je těžko prorazitelná.",
        moves: [
          {
            from: [9, 1],
            to: [7, 2],
            comment: "Kůň zahajuje — zachování flexibility bez okamžité hrozby.",
          },
          { from: [0, 7], to: [2, 6], comment: "Černý kůň odpovídá." },
          {
            from: [9, 6],
            to: [7, 4],
            comment:
              "Červený slon letí do středu — základna je chráněna a střed posílen.",
          },
          {
            from: [0, 2],
            to: [2, 4],
            comment:
              "Černý slon symetricky — oboustranná slonová ochrana základen.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment: "Druhý červený kůň doplňuje formaci kůň+slon.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment: "Druhý černý kůň — pevná, kompletní obrana obou stran.",
          },
          {
            from: [6, 4],
            to: [5, 4],
            comment:
              "Červený centrální pěšák vyráží vpřed — kontroluje střed a podporuje slona.",
          },
          {
            from: [3, 4],
            to: [4, 4],
            comment:
              "Symetrická centrální pěšáková odpověď — centrální boj v dynamické rovnováze.",
          },
          {
            from: [9, 3],
            to: [8, 4],
            comment:
              "Červený rádce vstupuje do paláce — generál má pevnou trojici obránců.",
          },
          {
            from: [0, 3],
            to: [1, 4],
            comment:
              "Černý rádce zrcadlově posiluje vlastní palác — obě obrany jsou pevné.",
          },
          {
            from: [9, 8],
            to: [8, 8],
            comment:
              "Pravý červený vůz vyjíždí o jedno pole — aktivace pravé linie pokračuje.",
          },
          {
            from: [0, 8],
            to: [1, 8],
            comment:
              "Černý vůz symetricky stoupá — kombinace kůň-slon drží stabilní obranu.",
          },
        ],
      },
    ],
  },
  {
    id: "elephant-opening",
    name: "Slonova hra",
    zh: "飛象局",
    difficulty: 3,
    variants: [
      {
        id: "elephant-double",
        name: "Oboustranný slon",
        zh: "雙象局",
        strategy:
          "Slonova hra je nejkonzervativnější zahájení — oba sloni jsou rozmístěni do středu, aby pevně střežili vlastní základnu. Formace je těžko prorazitelná, ale omezuje vlastní útočné možnosti. Výborná volba pro defenzivní hráče.",
        moves: [
          {
            from: [9, 2],
            to: [7, 4],
            comment:
              "Levý červený slon letí do středu — bezpečná, defenzivní strategie.",
          },
          {
            from: [0, 6],
            to: [2, 4],
            comment: "Černý pravý slon odpovídá symetricky.",
          },
          {
            from: [9, 6],
            to: [7, 8],
            comment:
              "Pravý červený slon — oba sloni chrání základnu jako pevná zeď.",
          },
          {
            from: [0, 7],
            to: [2, 6],
            comment:
              "Černý kůň se rozvíjí za slonem — obrana s přidanou aktivitou.",
          },
          {
            from: [9, 1],
            to: [7, 2],
            comment: "Červený kůň vstupuje — pozice se mírně aktivizuje.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment: "Druhý černý kůň — plně rozvinuté zahájení obou stran.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment:
              "Druhý červený kůň se rozvíjí — všichni jezdci jsou v aktivním postavení za slony.",
          },
          {
            from: [0, 8],
            to: [1, 8],
            comment:
              "Černý pravý vůz aktivuje se na sloupci i — podpora obrany.",
          },
          {
            from: [9, 8],
            to: [8, 8],
            comment:
              "Pravý červený vůz vystupuje na řadu 2 — připravený k laterálním přesunům.",
          },
          {
            from: [0, 0],
            to: [1, 0],
            comment:
              "Černý levý vůz se symetricky aktivuje — pomalá, defenzivní hra pokračuje.",
          },
          {
            from: [6, 4],
            to: [5, 4],
            comment:
              "Centrální červený pěšák postupuje vpřed — slonová zeď se připravuje na centrální tlak.",
          },
          {
            from: [3, 4],
            to: [4, 4],
            comment:
              "Symetrický centrální tah. Pevná, klidná hra — typická pro slonovou strukturu.",
          },
        ],
      },
      {
        id: "elephant-cannon",
        name: "Slon a kanon",
        zh: "象炮局",
        strategy:
          "Varianta slona a kanonu přidává aktivní útočný prvek do jinak defenzivní slonové hry. Po rozmístění slonů červený aktivuje kanon, který přeskočí přes řeku a vytváří nečekaný tlak.",
        moves: [
          {
            from: [9, 2],
            to: [7, 4],
            comment: "Levý červený slon zahajuje defenzivní strukturu.",
          },
          {
            from: [3, 4],
            to: [4, 4],
            comment:
              "Centrální pěšák — aktivní odpověď! Černý okamžitě bojuje o střed.",
          },
          {
            from: [9, 6],
            to: [7, 8],
            comment: "Pravý červený slon — slonova zeď je na místě.",
          },
          {
            from: [0, 2],
            to: [2, 4],
            comment: "Černý slon se rozmísťuje — obrana posílena.",
          },
          {
            from: [7, 1],
            to: [4, 1],
            comment:
              "Kanon skáče přes řeku na linku b — nečekaný útočný manévr! Červený přechází do ofenzivy.",
          },
          {
            from: [0, 7],
            to: [2, 6],
            comment: "Černý kůň reaguje na hrozbu přeskočeného kanonu.",
          },
          {
            from: [9, 1],
            to: [7, 2],
            comment:
              "Levý červený kůň vstupuje do hry — kombinace slona, kanonu a koně tvoří útočný motiv.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment:
              "Druhý černý kůň konečně vyvinul — obě strany mají kompletní jezdectvo.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment:
              "Pravý červený kůň doplňuje obrannou síť za slony.",
          },
          {
            from: [0, 0],
            to: [1, 0],
            comment:
              "Černý levý vůz vyjíždí — připravuje boční manévry proti přeskočenému kanonu.",
          },
          {
            from: [9, 8],
            to: [8, 8],
            comment:
              "Pravý červený vůz aktivuje pravou linii — všechny figury jsou nyní vyvinuté.",
          },
          {
            from: [0, 8],
            to: [1, 8],
            comment:
              "Černý pravý vůz symetricky stoupá. Hra je rozvinutá, prostor pro střední hru.",
          },
        ],
      },
    ],
  },
  {
    id: "sage-opening",
    name: "Zahájení mudrce",
    zh: "仙人指路",
    difficulty: 3,
    variants: [
      {
        id: "sage-pawn",
        name: "Pěšáková odpověď",
        zh: "卒應仙人",
        strategy:
          "Zahájení mudrce (仙人指路 — „mudrc ukazuje cestu“) je záhadný tah krajním pěšákem na prvním tahu. Testuje soupeřovu odpověď a zachovává maximální flexibilitu — žádný záměr není odhalen. Pěšáková odpověď je symetrická a filozoficky vyrovnaná.",
        moves: [
          {
            from: [6, 0],
            to: [5, 0],
            comment:
              "Krajní pěšák „mudrc“ — záhadný první tah, který nic neodhaluje o záměru červeného.",
          },
          {
            from: [3, 8],
            to: [4, 8],
            comment:
              "Symetrická pěšáková odpověď na opačném křídle — filozofická vyrovnanost.",
          },
          {
            from: [9, 1],
            to: [7, 2],
            comment: "Červený kůň vstupuje do hry — zahájení se začíná rozvíjet.",
          },
          { from: [0, 7], to: [2, 6], comment: "Černý kůň odpovídá." },
          {
            from: [7, 7],
            to: [7, 4],
            comment:
              "Červený kanon obsazuje střed — teprve nyní se odkrývá skutečný záměr zahájení.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment: "Druhý černý kůň — rozvoj obou stran je kompletní.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment:
              "Druhý červený kůň podporuje centrální kanon — útočná formace je v pohybu.",
          },
          {
            from: [0, 0],
            to: [0, 1],
            comment:
              "Černý vůz se přesouvá na linku b — připravuje horizontální přesuny.",
          },
          {
            from: [9, 0],
            to: [7, 0],
            comment:
              "Levý červený vůz se aktivuje na řadě 3 — podporuje krajního pěšáka.",
          },
          {
            from: [0, 8],
            to: [0, 7],
            comment:
              "Černý pravý vůz se posunuje, dělá místo pro rozvoj slona.",
          },
          {
            from: [9, 8],
            to: [8, 8],
            comment:
              "Pravý červený vůz vystupuje — všechny vozy jsou aktivované.",
          },
          {
            from: [0, 2],
            to: [2, 4],
            comment:
              "Černý slon zaujímá střed — palác má pevnou ochranu pro chystanou střední hru.",
          },
        ],
      },
      {
        id: "sage-horse",
        name: "Koňská odpověď",
        zh: "馬應仙人",
        strategy:
          "Koňská odpověď na zahájení mudrce je aktivnější alternativa. Místo pěšákové symetrie černý okamžitě rozvíjí figury a snaží se získat iniciativu. Vhodné pro hráče, kteří chtějí hrát dynamicky od prvních tahů.",
        moves: [
          { from: [6, 0], to: [5, 0], comment: "Pěšák mudrce zahajuje záhadně." },
          {
            from: [0, 7],
            to: [2, 6],
            comment:
              "Koňská odpověď! Černý okamžitě rozvíjí figuru — dynamičtější než pěšáková symetrie.",
          },
          { from: [9, 7], to: [7, 6], comment: "Červený kůň odpovídá." },
          {
            from: [0, 6],
            to: [2, 4],
            comment: "Černý slon se rozmísťuje — obrana posílena.",
          },
          {
            from: [7, 1],
            to: [7, 4],
            comment:
              "Červený kanon se přesunuje do středu — záměr se konečně odhaluje.",
          },
          {
            from: [2, 7],
            to: [5, 7],
            comment:
              "Černý kanon skáče přes řeku! Aktivní protiútok — hra je napínavá.",
          },
          {
            from: [9, 1],
            to: [7, 2],
            comment:
              "Levý červený kůň se rozvíjí — posiluje vnitřní obranu před přeskočeným kanonem.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment:
              "Druhý černý kůň konečně rozvinul — všichni jezdci v aktivním postavení.",
          },
          {
            from: [9, 8],
            to: [7, 8],
            comment:
              "Pravý červený vůz vystupuje na řadu 3 — připravený k boční operaci proti zaskočenému kanonu.",
          },
          {
            from: [0, 0],
            to: [1, 0],
            comment:
              "Levý černý vůz se aktivuje, podporuje obranu i případný útok.",
          },
          {
            from: [6, 2],
            to: [5, 2],
            comment:
              "Červený pěšák na lince c vyráží — krajní pěšák začíná tlačit.",
          },
          {
            from: [3, 4],
            to: [4, 4],
            comment:
              "Černý centrální pěšák oponuje, drží kontrolu středu.",
          },
        ],
      },
    ],
  },
  {
    id: "rook-opening",
    name: "Zahájení vozu",
    zh: "車先鋒局",
    difficulty: 4,
    variants: [
      {
        id: "rook-left",
        name: "Levý vůz vpřed",
        zh: "左車開局",
        strategy:
          "Zahájení vozu staví na rychlé aktivaci nejsilnější figury v xiangqi — vozu. Pěšák nejprve uvolní cestu a vůz okamžitě vyjíždí na volnou linku, odkud ohrožuje celé křídlo.",
        moves: [
          {
            from: [6, 0],
            to: [5, 0],
            comment:
              "Levý pěšák se posunuje — uvolňuje cestu pro vůz na linku a.",
          },
          {
            from: [0, 7],
            to: [2, 6],
            comment: "Černý kůň se rozvíjí na pravém křídle.",
          },
          {
            from: [9, 0],
            to: [6, 0],
            comment:
              "Vůz vyjíždí! Okamžitý tlak na celé levé křídlo — nejsilnější figura vstupuje do akce.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment: "Druhý černý kůň — obrana se organizuje.",
          },
          {
            from: [5, 0],
            to: [4, 0],
            comment:
              "Pěšák přechází řeku — vůz a pěšák koordinovaně útočí.",
          },
          {
            from: [3, 4],
            to: [4, 4],
            comment:
              "Centrální pěšák brzdí postup — vyrovnaná obranná odpověď.",
          },
          {
            from: [9, 1],
            to: [7, 2],
            comment:
              "Levý červený kůň se rozvíjí — podpora vyzdvihnutého vozu.",
          },
          {
            from: [0, 8],
            to: [1, 8],
            comment:
              "Černý pravý vůz aktivuje pravé křídlo — vyrovnává útok červeného.",
          },
          {
            from: [9, 8],
            to: [8, 8],
            comment:
              "Pravý červený vůz vyjíždí na řadu 2 — symetrický rozvoj na obou stranách.",
          },
          {
            from: [0, 0],
            to: [1, 0],
            comment:
              "Černý levý vůz vystupuje, aktivní pomocná figura.",
          },
          {
            from: [9, 7],
            to: [7, 8],
            comment:
              "Druhý červený kůň se rozvíjí — všichni jezdci v aktivním postavení.",
          },
          {
            from: [3, 6],
            to: [4, 6],
            comment:
              "Černý pěšák na lince g postupuje — kontroluje rozvinuté červené koně.",
          },
        ],
      },
      {
        id: "rook-right",
        name: "Pravý vůz vpřed",
        zh: "右車開局",
        strategy:
          "Pravý vůz vpřed kombinuje rychlou aktivaci pravého vozu s kanonovou podporou ve středu. Vůz ovládá pravou linku a kanon ohrožuje střed — dvě silné figury koordinovaně útočí.",
        moves: [
          {
            from: [6, 8],
            to: [5, 8],
            comment:
              "Pravý pěšák uvolňuje cestu pro pravý vůz na linku i.",
          },
          {
            from: [0, 1],
            to: [2, 2],
            comment: "Černý kůň se rozvíjí vlevo.",
          },
          {
            from: [9, 8],
            to: [6, 8],
            comment: "Pravý vůz vyjíždí — útok na pravém křídle!",
          },
          {
            from: [0, 7],
            to: [2, 6],
            comment: "Druhý černý kůň — symetrie v obraně.",
          },
          {
            from: [7, 7],
            to: [7, 4],
            comment:
              "Kanon obsazuje střed — kombinovaná hrozba vozu i kanonu.",
          },
          {
            from: [3, 8],
            to: [4, 8],
            comment:
              "Pravý pěšák brzdí postup vozu — lokální obranná odpověď.",
          },
          {
            from: [9, 7],
            to: [7, 6],
            comment:
              "Druhý červený kůň se rozvíjí — koordinace s vozem a kanonem na pravém křídle.",
          },
          {
            from: [3, 6],
            to: [4, 6],
            comment:
              "Černý pěšák na lince g postupuje — kontroluje červeného koně.",
          },
          {
            from: [9, 1],
            to: [7, 2],
            comment:
              "Levý červený kůň vstupuje do hry — symetrické rozvinutí na obou křídlech.",
          },
          {
            from: [0, 8],
            to: [1, 8],
            comment:
              "Pravý černý vůz se aktivuje — odpovídá na červený rozvoj na pravé straně.",
          },
          {
            from: [9, 0],
            to: [8, 0],
            comment:
              "Levý červený vůz lift o jedno pole — všechny vozy jsou aktivované.",
          },
          {
            from: [0, 0],
            to: [1, 0],
            comment:
              "Černý vůz symetricky stoupá. Plně rozvinutá poziční hra obou stran.",
          },
        ],
      },
    ],
  },
];
