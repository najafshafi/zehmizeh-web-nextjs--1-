import FindingUs from "@/components/findingus/FindingUs";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const AboutUsPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="pt-[110px]">
        <FindingUs />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
