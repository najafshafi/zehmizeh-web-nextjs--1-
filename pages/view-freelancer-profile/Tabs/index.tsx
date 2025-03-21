"use client";
import { TabTitle, TabWrapper } from "@/styles/TabStyle";
import { VIEW_FREELANCER_PROFILE_TABS } from "@/helpers/const/tabs";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Tabs = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(
    VIEW_FREELANCER_PROFILE_TABS.PROFILE
  );

  // On initial load, check if we should highlight a specific tab
  useEffect(() => {
    // Determine active tab based on scroll position
    const checkScrollPosition = () => {
      const profileSection = document.getElementById("profile-profile");
      const portfolioSection = document.getElementById("profile-portfolio");
      const ratingsSection = document.getElementById("profile-ratings");

      if (!profileSection || !portfolioSection || !ratingsSection) return;

      const scrollPosition = window.scrollY + 200; // Adding offset for better detection

      if (ratingsSection && scrollPosition >= ratingsSection.offsetTop) {
        setActiveTab(VIEW_FREELANCER_PROFILE_TABS.RATINGS);
      } else if (
        portfolioSection &&
        scrollPosition >= portfolioSection.offsetTop
      ) {
        setActiveTab(VIEW_FREELANCER_PROFILE_TABS.PORTFOLIO);
      } else {
        setActiveTab(VIEW_FREELANCER_PROFILE_TABS.PROFILE);
      }
    };

    // Set up scroll event listener
    window.addEventListener("scroll", checkScrollPosition);

    // Initial check
    checkScrollPosition();

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    // Smooth scroll to the section
    const targetId = `profile-${tab.toLowerCase()}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tabs = Object.values(VIEW_FREELANCER_PROFILE_TABS);
  if (tabs.length === 1) {
    return <></>;
  }

  return (
    <TabWrapper className="tab-wrapper">
      <TabStyle>
        {tabs.map((tab) => (
          <TabTitle
            onClick={() => handleTabClick(tab)}
            $active={activeTab === tab}
            key={tab}
          >
            {tab}
          </TabTitle>
        ))}
      </TabStyle>
    </TabWrapper>
  );
};

export default Tabs;

export const TabStyle = styled.div`
  position: sticky;
  margin-top: 2rem;
  top: 10rem;

  @media (max-width: 768px) {
    margin-top: 0;
    gap: 2rem;
    margin: 0 1rem;
    display: flex;
    height: 100%;
    align-items: center;
    overflow: auto;
    ::-webkit-scrollbar {
      height: 0px;
    }
  }
`;
