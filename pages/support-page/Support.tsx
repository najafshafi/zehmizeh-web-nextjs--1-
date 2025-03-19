/*
 * This is the main component of this route
 */
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Wrapper } from "./support.styled";
import DisputeForm from "./DisputeForm";
import GeneralInquiryForm from "./GeneralInquiryForm";
import Tabs from "@/components/ui/Tabs";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import FaqForm from "./FaqForm";

// These are the 2 tabs that will be displayed on the support page
{
  /* id: 0, label: 'General Inquiry', key: 'gen_inquiry' */
}
const TABS = [
  { id: 1, label: "FAQs", key: "faq" },
  { id: 2, label: "Submit Dispute", key: "submit_dispute" },
  //FAQs
];

const Support = () => {
  const router = useRouter();
  const pathname = usePathname();
  // Extract the type from the pathname
  const pathParts = pathname?.split("/") || [];
  const type = pathParts[pathParts.length - 1];
  // Default to 'faq' if type is 'support' (meaning we're at /support) or not a valid tab
  const activeTab =
    type && type !== "support" && TABS.some((tab) => tab.key === type)
      ? type
      : "faq";

  /* This will start the page top (Scroll position) */
  useStartPageFromTop();

  const onTabChange = (tab: string) => {
    router.push(`/support/${tab}`);
  };

  return (
    <div className="h-full flex-1 my-4">
      <Wrapper>
        <div className="content">
          {/* Title */}
          <h1 className="page-title text-center font-normal">
            Customer Support
          </h1>

          {/* Tabs */}
          <div className="my-3 flex justify-center">
            <Tabs
              activeTab={activeTab}
              tabs={TABS}
              onTabChange={onTabChange}
              className="flex justify-center"
            />
          </div>

          {/* Forms */}
          <div className="dispute-form">
            {activeTab === "gen_inquiry" && <GeneralInquiryForm />}
            {activeTab === "submit_dispute" && <DisputeForm />}
            {activeTab === "faq" && <FaqForm />}
          </div>
        </div>

        {/* Dispute button */}
        {activeTab === "submit_dispute" && (
          <Link href="/disputes">
            <div className="view-dispute-btn text-center pointer text-base font-normal">
              Open Dispute History
            </div>
          </Link>
        )}
      </Wrapper>
    </div>
  );
};

export default Support;
