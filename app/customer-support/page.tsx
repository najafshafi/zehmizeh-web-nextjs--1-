import ContactUs from "@/components/contact-us/ContactUS";
import Navbar from "@/components/navbar/Navbar";

const AboutUsPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="pt-[110px]">
        <ContactUs />
      </div>
    </div>
  );
};

export default AboutUsPage;
