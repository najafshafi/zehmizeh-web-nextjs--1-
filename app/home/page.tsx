"use client"; // Mark as a Client Component since it uses Redux hooks

import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust path to your store
import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";
import HiringProcess from "@/components/hiringprocess/HiringProcess";
import Matches from "@/components/matches/Matches";
import NavbarProfile from "@/components/navbar-profile/NavbarProfile";
import Navbar from "@/components/navbar/Navbar";
import Queries from "@/components/queries/Queries";
import Vision from "@/components/vision/Vision";
import WhyUs from "@/components/whyus/WhyUs";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux store

  return (
    <div className="flex flex-col">
      {user ? <NavbarProfile /> : <Navbar />} {/* Conditionally render navbar */}

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