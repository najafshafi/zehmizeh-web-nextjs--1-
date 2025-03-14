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
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getHomeCounts } from '@/helpers/http/common';

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux store
  useEffect(() => {
    /* TODO: Here the #element_id was not working proeprly, I tried lot for that but taking too much time
     * so for now I have added this thing, and working perfectly, if this is not correct will see in e2e testing
     */
    const currentLocation = window.location.href;
    const hasCommentAnchor = currentLocation.includes('/#');
    if (hasCommentAnchor) {
      const anchorCommentId = `${currentLocation.substring(currentLocation.indexOf('#') + 1)}`;
      const anchorComment = document.getElementById(anchorCommentId);
      if (anchorComment) {
        anchorComment.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const { data } = useQuery<{ data: any; status: boolean }, Error>('home-counts', () => getHomeCounts());

  return (
    <div className="flex flex-col">
      {user ? <NavbarProfile /> : <Navbar />} {/* Conditionally render navbar */}

      <div className="pt-[110px]">
        <Hero />
        <Vision />
        <HiringProcess />
        <WhyUs />
        <Matches data={data?.data?.popular_category} user={user} />
        <Queries />
        <Footer />
      </div>
    </div>
  );
}