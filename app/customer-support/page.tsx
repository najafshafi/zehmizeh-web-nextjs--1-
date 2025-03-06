import ContactUs from "@/components/contact-us/ContactUS";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const AboutUsPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="pt-[110px]">
        <ContactUs />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
