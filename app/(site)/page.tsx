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

export default function HomePage() {
  return (
    <SelectionProvider>
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Schedule />
        <News />
        <Prices />
        <Signup />
      </main>
      <MobileDock />
      <Footer />
    </SelectionProvider>
  );
}
