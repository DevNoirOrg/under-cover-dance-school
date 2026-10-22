import type { PriceItem, PriceNote } from "@/lib/content-types";

/* ÁRAINK — lila kártya a jelentkezés előtt, két oszlopos árlistával. */

function PriceRow({ item }: { item: PriceItem }) {
  return (
    <li className="flex items-baseline justify-between gap-4 py-4">
      <span className="text-[15px] md:text-base font-semibold text-ink">
        {item.name}
        {item.note && <span className="ml-0.5 text-ink/50">{item.note}</span>}
      </span>
      <span className="whitespace-nowrap font-title text-[15px] md:text-base font-extrabold text-ink">
        {item.price}
      </span>
    </li>
  );
}

export default function Prices({ prices, notes }: { prices: PriceItem[]; notes: PriceNote[] }) {
  const half = Math.ceil(prices.length / 2);
  const left = prices.slice(0, half);
  const right = prices.slice(half);

  return (
    <section id="arak" className="dot-paper bg-white pt-16 pb-24 md:pt-20 md:pb-28 px-6 scroll-mt-24">
      <div className="relative max-w-5xl mx-auto bg-uc rounded-[3rem] px-7 sm:px-10 md:px-14 pt-16 md:pt-20 pb-8 md:pb-12 shadow-[0_40px_80px_-30px_rgba(20,19,22,0.45)]">
        <div className="absolute top-0 left-1/2 -mt-2 -translate-x-1/2 -translate-y-1/2 w-full px-6 pointer-events-none select-none text-center">
          <span className="outlined-title outlined-title--uc font-title font-black text-ink text-5xl md:text-7xl whitespace-nowrap">
            Áraink
          </span>
        </div>

        <div className="grid md:grid-cols-2 md:gap-x-14">
          <ul className="divide-y divide-ink/10 border-b border-ink/10 md:border-b-0">
            {left.map((p) => (
              <PriceRow key={p.id} item={p} />
            ))}
          </ul>
          <ul className="divide-y divide-ink/10">
            {right.map((p) => (
              <PriceRow key={p.id} item={p} />
            ))}
          </ul>
        </div>

        <div className="mt-6 md:mt-8 grid gap-3 md:grid-cols-3 md:gap-8 rounded-[1.75rem] bg-white/40 px-6 py-5 md:px-8 md:py-6 text-[13px] leading-relaxed text-ink/75">
          {notes.map((n, i) => (
            <p key={i}>
              {n.mark && (
                <>
                  <strong className="text-ink">{n.mark}</strong>{" "}
                </>
              )}
              {n.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
