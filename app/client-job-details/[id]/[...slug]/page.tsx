"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the ClientJobDetails component with no SSR
const ClientJobDetails = dynamic(
  () => import("@/pages/client-job-details-page/ClientJobDetails"),
  { ssr: false }
);

export default function ClientJobDetailsCatchAll() {
  const params = useParams();
  const id = params?.id as string;
  const slug = params?.slug as string[];
  const [validSlug, setValidSlug] = useState(true);
  const [tabKey, setTabKey] = useState<string>("");

  useEffect(() => {
    // Check if slug is valid
    const validSlugs = [
      "gen_details",
      "applicants",
      "invitees",
      "m_stone",
      "messages",
      "feedback",
    ];
    if (slug && slug.length > 0) {
      const isValid = validSlugs.includes(slug[0]);
      setValidSlug(isValid);
      if (isValid) {
        setTabKey(slug[0]);
      }
    }
  }, [slug]);

  if (!validSlug) {
    // Redirect or show error message
    return (
      <div className="client-job-details-layout pt-[90px] bg-secondary flex flex-col items-center">
        Invalid route
      </div>
    );
  }

  return <ClientJobDetails initialTab={tabKey} jobId={id} />;
}
