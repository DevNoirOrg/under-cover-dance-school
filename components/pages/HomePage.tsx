import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MobileDock from "@/components/MobileDock";
import News from "@/components/News";
import Prices from "@/components/Prices";
import Schedule from "@/components/Schedule";
import { SelectionProvider } from "@/components/selection";
import Signup from "@/components/Signup";
import SiteNav from "@/components/SiteNav";
import { getSiteContent } from "@/lib/content";
import { paths, type Locale } from "@/lib/i18n";
import { experienceOptions, localizeNews, localizePrices, localizeRooms, localizeSettings } from "@/lib/localize";

/** A főoldal — magyarul (/) és angolul (/en). */
export default async function HomePage({ locale }: { locale: Locale }) {
  const content = await getSiteContent();
  const settings = localizeSettings(content.settings, locale);
  const rooms = localizeRooms(content.rooms, locale);
  const news = localizeNews(content.news, locale);
  const prices = localizePrices(content.prices, locale);
  const alternateHref = paths[locale === "hu" ? "en" : "hu"].home;

  return (
    <SelectionProvider rooms={rooms}>
      <SiteNav locale={locale} />
      <main>
        <Hero hero={settings.hero} locale={locale} alternateHref={alternateHref} />
        <About about={settings.about} />
        <Schedule rooms={rooms} locale={locale} />
        {/* a design 3 kártyára készült: a legfrissebb 3 hír látszik (angolul a lefordítottak közül) */}
        <News news={news.slice(0, 3)} locale={locale} />
        <Prices prices={prices} notes={settings.price_notes.notes} locale={locale} />
        <Signup experienceOptions={experienceOptions(content.settings.form_options, locale)} locale={locale} />
      </main>
      <MobileDock locale={locale} />
      <Footer footer={settings.footer} locale={locale} alternateHref={alternateHref} />
    </SelectionProvider>
  );
}
