import AboutUs from "@/components/aboutus/AboutUs";
import Navbar from "@/components/navbar/Navbar";

const AboutUsPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="pt-[110px]">
        <AboutUs />
      </div>
    </div>
  );
};

export default AboutUsPage;
