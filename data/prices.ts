/*
  Áraink — két oszlopban jelenik meg: az első fele balra, a második jobbra.
  A `note` a tétel utáni csillag(ok), ami a lenti megjegyzésekre utal.
*/

export type PriceItem = {
  name: string;
  price: string;
  note?: "*" | "**";
};

export const prices: PriceItem[] = [
  { name: "Órajegy", price: "4 000 Ft" },
  { name: "Havi bérlet — 1 csoport", price: "20 000 Ft", note: "*" },
  { name: "Havi bérlet — 2 csoport", price: "30 000 Ft", note: "*" },
  { name: "Korlátlan havi bérlet", price: "36 000 Ft", note: "*" },
  { name: "1 pénteki csoport", price: "14 000 Ft", note: "*" },
  { name: "1 csoport + 1 pénteki", price: "26 000 Ft", note: "*" },
  { name: "4 alkalmas bérlet", price: "14 000 Ft", note: "**" },
  { name: "8 alkalmas bérlet", price: "22 000 Ft", note: "**" },
];

/** A világosabb lila sávban futó kiegészítő szövegek (asztali nézetben három oszlop). */
export const priceNotes: { mark?: string; text: string }[] = [
  { mark: "*", text: "A havi bérletek az adott naptári hónapra érvényesek." },
  {
    mark: "**",
    text: "A 4 és 8 alkalmas bérlet az aktiválástól számított 30 napon belül használható fel.",
  },
  { text: "Fizethetsz készpénzzel, bankkártyával vagy átutalással." },
];
