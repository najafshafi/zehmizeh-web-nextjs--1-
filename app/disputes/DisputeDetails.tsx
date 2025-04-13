import { useQuery } from "react-query";
import { DisputeDetailsWrapper } from "./disputes.styled";
import Loader from "@/components/Loader";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import { StatusBadge } from "@/components/styled/Badges";
import { convertToTitleCase } from "@/helpers/utils/misc";
import { getDisputeDetails } from "@/helpers/http/dispute";
import CheckMark from "@/public/icons/check-mark-green-large.svg";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  show: boolean;
  onCloseModal: () => void;
  dispute_id: string;
};

const DisputeDetails = ({ show, onCloseModal, dispute_id }: Props) => {
  /* This will fetch the inquiry or dispute details */
  const modalRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isRefetching } = useQuery(
    ["get-support-details", dispute_id],
    getDisputeDetails,
    { enabled: !!dispute_id }
  );

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseModal();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onCloseModal]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseModal();
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [show, onCloseModal]);

  if (!show) return null;

  console.log(data);
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${show ? "" : "hidden"}`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div
        ref={modalRef}
        className="relative mx-auto max-w-[604px] w-full bg-white rounded-lg shadow-xl overflow-hidden z-10 px-4"
        style={{ maxWidth: "604px" }}
      >
        <div className="p-6">
          <button
            className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onCloseModal}
          >
            &times;
          </button>

          {(isLoading || isRefetching) && <Loader />}

          {!isLoading && !isRefetching && data && (
            <DisputeDetailsWrapper className="flex flex-col">
              {/* Title | Subtitle and type of support request */}
              <div className="support-header flex gap-3 justify-between items-center">
                <div className="heading-title">
                  <div className="text-2xl font-bold">
                    {data?.subject ||
                      convertToTitleCase(data?.jobdata?.job_title)}
                  </div>
                  {data?.dispute_id && (
                    <div className="text-xl font-normal mt-2 light-black">
                      {convertToTitleCase(data?.milestone?.title)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {data?.dispute_status == "closed" ? (
                    <StatusBadge color="green" className="mt-2">
                      Closed
                    </StatusBadge>
                  ) : (
                    <StatusBadge color="darkPink" className="mt-2">
                      Open
                    </StatusBadge>
                  )}
                </div>
              </div>

              {/* Submitted by */}
              <div className="support-request--by p-4">
                <div className="flex items-center justify-between">
                  <div className="light-black light-text text-sm font-normal">
                    Dispute Submitted By:
                  </div>
                  {data?.dispute_status == "closed" &&
                    data?.submitted_by ===
                      data?.resolved_for?.toUpperCase() && <CheckMark />}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Image
                    className="support-request--avatar"
                    src={
                      data?.submitted_by === "CLIENT"
                        ? data?.clientdata?.user_image ||
                          "/images/_default_avatar.png"
                        : data?.userdata?.user_image ||
                          "/images/_default_avatar.png"
                    }
                    alt="avatar"
                    width={40}
                    height={40}
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/images/_default_avatar.png";
                    }}
                  />
                  <div className="text-sm font-normal light-black capitalize">
                    {data?.submitted_by === "CLIENT"
                      ? `${data?.clientdata?.first_name} ${data?.clientdata?.last_name} (${data?.clientdata?.user_type})`
                      : `${data?.userdata?.first_name} ${data?.userdata?.last_name} (${data?.userdata?.user_type})`}
                  </div>
                </div>
              </div>

              {/* Support request description */}
              <div className="capital-first-ltr text-sm font-normal light-black light-text">
                {dispute_id && (
                  <StyledHtmlText
                    htmlString={data?.description}
                    needToBeShorten={false}
                    id={`support_${dispute_id}`}
                  />
                )}
              </div>

              {/* If dispute - Project owner */}
              {data?.dispute_id && (
                <div className="project-owner-details p-4">
                  <div className="flex items-center justify-between">
                    <div className="light-black light-text text-sm font-normal">
                      Receiver of Dispute
                    </div>
                    {data?.dispute_status == "closed" &&
                      data?.submitted_by !==
                        data?.resolved_for?.toUpperCase() && <CheckMark />}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Image
                      className="support-request--avatar"
                      src={
                        data?.submitted_by === "FREELANCER"
                          ? data?.clientdata?.user_image ||
                            "/images/_default_avatar.png"
                          : data?.userdata?.user_image ||
                            "/images/_default_avatar.png"
                      }
                      alt="avatar"
                      width={40}
                      height={40}
                      unoptimized={true}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/_default_avatar.png";
                      }}
                    />
                    <div className="text-sm font-normal light-black capitalize">
                      {data?.submitted_by === "FREELANCER"
                        ? `${data?.clientdata?.first_name} ${data?.clientdata?.last_name} (${data?.clientdata?.user_type})`
                        : `${data?.userdata?.first_name} ${data?.userdata?.last_name} (${data?.userdata?.user_type})`}
                    </div>
                  </div>
                </div>
              )}

              {/* Support request attachment */}
              <div className="support-attachment flex items-center gap-3">
                <div className="text-sm font-light">Attachment:</div>
                {data?.attachment_file ? (
                  <AttachmentPreview
                    uploadedFile={data.attachment_file}
                    removable={false}
                  />
                ) : (
                  "-"
                )}
              </div>

              {/* Resolve comment */}
              {data.action_log[0]?.comment &&
                data?.dispute_status === "closed" && (
                  <div>
                    <div className="text-sm font-bold">Synopsis:</div>
                    <div className="mt-1 text-xl font-normal">
                      {data.action_log[0]?.comment}
                    </div>
                  </div>
                )}
            </DisputeDetailsWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeDetails;
