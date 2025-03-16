import FindingUs from "@/components/findingus/FindingUs";
import Navbar from "@/components/navbar/Navbar";

const AboutUsPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="pt-[110px]">
        <FindingUs />
      </div>  
    </div>
  );
};

export default AboutUsPage;
