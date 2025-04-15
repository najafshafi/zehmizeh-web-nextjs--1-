"use client";

import { useParams } from "next/navigation";
import ClientJobDetails from "../../../ClientJobDetails";

export default function ApplicantDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const applicantId = params?.applicantId as string;

  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <ClientJobDetails
        initialTab="applicants"
        jobId={id}
        selectedApplicantId={applicantId}
      />
    </div>
  );
}
