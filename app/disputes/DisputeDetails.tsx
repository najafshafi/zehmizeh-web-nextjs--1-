import { useQuery } from "react-query";
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
        className="relative mx-auto max-w-[604px] w-full bg-white rounded-lg shadow-xl  z-10 px-4"
        style={{ maxWidth: "604px" }}
      >
        <div className="p-6">
          <button
            className="absolute -top-4 -right-8 text-3xl text-white "
            onClick={onCloseModal}
          >
            &times;
          </button>

          {(isLoading || isRefetching) && <Loader />}

          {!isLoading && !isRefetching && data && (
            <div className="flex flex-col gap-8">
              {/* Title | Subtitle and type of support request */}
              <div className="support-header flex gap-3 justify-between items-center">
                <div className=" max-w-[80%]">
                  <div className="text-2xl font-bold">
                    {data?.subject ||
                      convertToTitleCase(data?.jobdata?.job_title)}
                  </div>
                  {data?.dispute_id && (
                    <div className="text-xl font-normal mt-2 text-[#333333]">
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
              <div className="bg-[#f5f5f5] rounded-[9px]  p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[#333333]  opacity-70 text-sm font-normal">
                    Dispute Submitted By:
                  </div>
                  {data?.dispute_status == "closed" &&
                    data?.submitted_by ===
                      data?.resolved_for?.toUpperCase() && <CheckMark />}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Image
                    className="h-[38px] w-[38px] rounded-full object-cover"
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
                  <div className="text-sm font-normal text-[#333333] capitalize">
                    {data?.submitted_by === "CLIENT"
                      ? `${data?.clientdata?.first_name} ${data?.clientdata?.last_name} (${data?.clientdata?.user_type})`
                      : `${data?.userdata?.first_name} ${data?.userdata?.last_name} (${data?.userdata?.user_type})`}
                  </div>
                </div>
              </div>

              {/* Support request description */}
              <div className="capital-first-ltr text-sm font-normal text-[#333333]  opacity-70">
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
                <div className="bg-[#f8f8f8] rounded-[9px] p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[#333333]  opacity-70 text-sm font-normal">
                      Receiver of Dispute
                    </div>
                    {data?.dispute_status == "closed" &&
                      data?.submitted_by !==
                        data?.resolved_for?.toUpperCase() && <CheckMark />}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Image
                      className="h-[38px] w-[38px] rounded-full object-cover"
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
                    <div className="text-sm font-normal text-[#333333] capitalize">
                      {data?.submitted_by === "FREELANCER"
                        ? `${data?.clientdata?.first_name} ${data?.clientdata?.last_name} (${data?.clientdata?.user_type})`
                        : `${data?.userdata?.first_name} ${data?.userdata?.last_name} (${data?.userdata?.user_type})`}
                    </div>
                  </div>
                </div>
              )}

              {/* Support request attachment */}
              <div className=" bg-[#f8f8f8] border border-[#d9d9d9] py-3 px-5 rounded-lg flex items-center gap-3">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputeDetails;
