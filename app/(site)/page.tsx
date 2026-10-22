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

export default async function HomePage() {
  const { settings, rooms, news, prices } = await getSiteContent();
  return (
    <SelectionProvider rooms={rooms}>
      <SiteNav />
      <main>
        <Hero hero={settings.hero} />
        <About about={settings.about} />
        <Schedule rooms={rooms} />
        {/* a design 3 kártyára készült: a legfrissebb 3 hír látszik */}
        <News news={news.slice(0, 3)} />
        <Prices prices={prices} notes={settings.price_notes.notes} />
        <Signup formOptions={settings.form_options} />
      </main>
      <MobileDock />
      <Footer footer={settings.footer} />
    </SelectionProvider>
  );
}
