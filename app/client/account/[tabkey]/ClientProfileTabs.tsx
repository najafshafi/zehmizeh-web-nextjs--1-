"use client";
import { useEffect, useState } from "react";
import * as C from "./client-profile.styled";
import { useRouter, usePathname } from "next/navigation";

interface Prop {
  currentTab: string;
}

const ClientProfileTabs = ({ currentTab }: Prop) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(1);

  const [tabs] = useState([
    {
      id: 1,
      title: "Profile",
      path: "/client/account/profile",
    },
    {
      id: 2,
      title: "Ratings",
      path: "/client/account/ratings",
    },
    {
      id: 3,
      title: "Payment Details",
      path: "/client/account/payments",
    },
    {
      id: 4,
      title: "Account Settings",
      path: "/client/account/settings",
    },
  ]);

  useEffect(() => {
    // Update active tab based on current path
    const currentPath = pathname || "";
    const tab = tabs.find((t) => t.path === currentPath);
    if (tab) {
      setActiveTab(tab.id);
    }
  }, [pathname, tabs]);

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <C.ClientTabWrapper className="tab-wrapper">
      <C.ClientTab>
        {tabs.map((tb) => (
          <C.ClientTitle
            onClick={() => {
              handleTabClick(tb.path);
            }}
            data-active={tb.id === activeTab}
            key={tb.id}
          >
            {tb.title}
          </C.ClientTitle>
        ))}
      </C.ClientTab>
    </C.ClientTabWrapper>
  );
};

export default ClientProfileTabs;
