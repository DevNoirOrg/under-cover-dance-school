/*
  A jelentkezés adatai és a BEKÜLDÉS helye.

  Most DEMÓ: a form csak összegzi az adatokat és megköszöni a jelentkezést,
  nem küld el semmit. Valódi beküldésnél ezt a függvényt kell megírni,
  pl. egy API route-tal (app/api/jelentkezes/route.ts) és e-mail küldéssel:

    await fetch("/api/jelentkezes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
*/

export type ApplicationData = {
  vezeteknev: string;
  keresztnev: string;
  email: string;
  szuletes: string;
  /** Csak 16 év alatti jelentkezőnél. */
  szulo_nev?: string;
  szulo_email?: string;
  tapasztalat: string;
  kezdes: string;
  megjegyzes: string;
  adatkezeles: "elfogadva";
  /** A kiválasztott órák teljes leírása. */
  valasztott_orak: string[];
};

export async function submitApplication(data: ApplicationData): Promise<void> {
  // >>> VALÓDI BEKÜLDÉS HOOK — lásd a fájl tetején.
  void data;
}
