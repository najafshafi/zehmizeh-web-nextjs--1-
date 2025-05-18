"use client"; // Mark as a Client Component since it uses Redux hooks

import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust path to your store
import Hero from "@/components/hero/Hero";
import HiringProcess from "@/components/hiringprocess/HiringProcess";
import Matches from "@/components/matches/Matches";
import Queries from "@/components/queries/Queries";
import Vision from "@/components/vision/Vision";
import WhyUs from "@/components/whyus/WhyUs";
import { useEffect } from "react";
// Using the newer @tanstack/react-query package
import { useQuery } from "@tanstack/react-query";
import { getHomeCounts } from "@/helpers/http/common";

// Add this interface before the Home component
interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  freelancer_count?: number;
  total_freelancers?: number;
  total?: number;
  [key: string]: unknown; // Allow for any other properties that might exist
}

export default function HomeContent() {
  const { user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    /* TODO: Here the #element_id was not working proeprly, I tried lot for that but taking too much time
     * so for now I have added this thing, and working perfectly, if this is not correct will see in e2e testing
     */
    const currentLocation = window.location.href;
    const hasCommentAnchor = currentLocation.includes("/#");
    if (hasCommentAnchor) {
      const anchorCommentId = `${currentLocation.substring(
        currentLocation.indexOf("#") + 1
      )}`;
      const anchorComment = document.getElementById(anchorCommentId);
      if (anchorComment) {
        anchorComment.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const { data } = useQuery({
    queryKey: ["home-counts"],
    queryFn: getHomeCounts,
  });

  // Transform popular_category data to match the expected MatchData structure
  const matchesData =
    data?.data?.popular_category?.map((category: CategoryItem) => {
      // Try different possible property names for count
      const countValue =
        category.count !== undefined
          ? category.count
          : category.freelancer_count !== undefined
            ? category.freelancer_count
            : category.total_freelancers !== undefined
              ? category.total_freelancers
              : category.total !== undefined
                ? category.total
                : 0;

      return {
        name: category.name,
        freelancer_count: countValue,
      };
    }) || [];

  // Determine if user is logged in based on necessary properties
  const isLoggedIn = user && user.user_id ? true : false;

  return (
    <div className="flex flex-col pt-[110px]">
      <Hero />
      <Vision />
      <HiringProcess />
      <WhyUs />
      <Matches
        data={matchesData}
        user={isLoggedIn ? ({ ...user } as Record<string, unknown>) : null}
      />
      <Queries />
    </div>
  );
}
