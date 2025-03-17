// import { FREELANCER_PROFILE_TABS } from '@/helpers/const/tabs';
// import { TFreelancerProfileSettingsPathParams } from '@/helpers/types/pathParams.type';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Tab, TabTitle, TabWrapper } from '@/styles/TabStyle';

// export const Tabs = () => {
//   const { tabkey } = useParams<TFreelancerProfileSettingsPathParams>();

//   const navigate = useNavigate();

//   if (Object.values(FREELANCER_PROFILE_TABS).findIndex((tab) => tab === tabkey) === -1) {
//     navigate(`/freelancer/account/${FREELANCER_PROFILE_TABS.PROFILE}`, {
//       replace: true,
//     });
//     return <></>;
//   }

//   return (
//     <TabWrapper className="tab-wrapper">
//       <Tab>
//         {Object.values(FREELANCER_PROFILE_TABS).map((tab) => (
//           <TabTitle
//             onClick={() => {
//               navigate(`/freelancer/account/${tab}`, { replace: true });
//             }}
//             active={tabkey === tab}
//             key={tab}
//           >
//             {tab}
//           </TabTitle>
//         ))}
//       </Tab>
//     </TabWrapper>
//   );
// };
"use client"; // Required for Next.js client components

import { useRouter, useParams } from "next/navigation";
import { FREELANCER_PROFILE_TABS } from "@/helpers/const/tabs";
import { Tab, TabTitle, TabWrapper } from "@/styles/TabStyle";
import { useEffect } from "react";

export const Tabs = () => {
  const router = useRouter();
  const params = useParams();
  const tabkey = params?.tabkey as string;

  const isValidTab = Object.values(FREELANCER_PROFILE_TABS).includes(tabkey);

  // Redirect if the tab is invalid, using useEffect to avoid breaking hooks order
  useEffect(() => {
    if (!isValidTab) {
      router.replace(`/freelancer/account/${FREELANCER_PROFILE_TABS.PROFILE}`);
    }
  }, [isValidTab, router]);

  return (
    <TabWrapper className="tab-wrapper">
      <Tab>
        {Object.values(FREELANCER_PROFILE_TABS).map((tab) => (
          <TabTitle
            key={tab}
            onClick={() => router.replace(`/freelancer/account/${tab}`)}
            $active={tabkey === tab}
          >
            {tab}
          </TabTitle>
        ))}
      </Tab>
    </TabWrapper>
  );
};
