import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";
import HiringProcess from "@/components/hiringprocess/HiringProcess";
import Matches from "@/components/matches/Matches";
import Navbar from "@/components/navbar/Navbar";
import Queries from "@/components/queries/Queries";
import Vision from "@/components/vision/Vision";
import WhyUs from "@/components/whyus/WhyUs";

export default function Home() {
  return (
      <div className="flex flex-col">
          <Navbar />

      <div className="pt-[110px]">
      <Hero />
          <Vision />
          <HiringProcess />
          <WhyUs />
          <Matches />
          <Queries />
          <Footer />
      </div>
        
      </div>
  );
}