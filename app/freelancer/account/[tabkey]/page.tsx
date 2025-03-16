import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FreelancerProfileSettings from "../../../../pages/freelancer-profile-settings/FreelancerProfileSettings";
const page = () => {
  return (
    <div>
      <div className="flex flex-col">
        <Navbar />
        <div className="pt-[110px] bg-[#fefbf4]">
          <FreelancerProfileSettings />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default page;
