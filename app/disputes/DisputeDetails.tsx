import { Button, Modal } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
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

type Props = {
  show: boolean;
  onCloseModal: () => void;
  dispute_id: string;
};

const DisputeDetails = ({ show, onCloseModal, dispute_id }: Props) => {
  /* This will fetch the inquiry or dispute details */

  const { data, isLoading, isRefetching } = useQuery(
    ["get-support-details", dispute_id],
    getDisputeDetails,
    { enabled: !!dispute_id }
  );

  return (
    <StyledModal
      show={show}
      size="lg"
      onHide={onCloseModal}
      centered
      maxwidth={604}
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>

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
                {/* <StatusBadge
                  color={data?.data?.inquiry_id ? 'blue' : 'darkPink'}
                >
                  {data?.inquiry_id ? 'General' : 'Dispute'}
                </StatusBadge> */}
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
                  data?.submitted_by === data?.resolved_for?.toUpperCase() && (
                    <CheckMark />
                  )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Image
                  className="support-request--avatar"
                  src={
                    data?.submitted_by === "CLIENT"
                      ? data?.clientdata?.user_image
                      : data?.userdata?.user_image
                  }
                  alt="avatar"
                  width={40}
                  height={40}
                />
                <div className="text-sm font-normal light-black capitalize">
                  {data?.submitted_by === "CLIENT"
                    ? `${data?.clientdata?.first_name} ${data?.clientdata?.last_name} (${data?.clientdata?.user_type})`
                    : `${data?.userdata?.first_name} ${data?.userdata?.last_name} (${data?.userdata?.user_type})`}
                </div>
              </div>
              {/* <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="user-email flex items-center gap-2">
                  <EmailIcon />
                  <div className="fs-18 font-normal">
                    {data?.userdata?.u_email_id}
                  </div>
                </div>
                <div className="divider d-none d-lg-block" />
                <div className="user-email flex items-center gap-2">
                  <CallIcon />
                  <div className="fs-18 font-normal">
                    {data?.userdata?.formatted_phonenumber ||
                      data?.userdata?.phone_number}
                  </div>
                </div>
              </div> */}
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
                    {/* {data?.submitted_by === 'FREELANCER'
                      ? 'PROJECT OWNER'
                      : 'FREELANCER'} */}
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
                        ? data?.clientdata?.user_image
                        : data?.userdata?.user_image
                    }
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                  <div className="text-sm font-normal light-black capitalize">
                    {data?.submitted_by === "FREELANCER"
                      ? `${data?.clientdata?.first_name} ${data?.clientdata?.last_name} (${data?.clientdata?.user_type})`
                      : `${data?.userdata?.first_name} ${data?.userdata?.last_name} (${data?.userdata?.user_type})`}
                  </div>
                </div>
                {/* <div className="flex items-center mt-3 gap-3 flex-wrap">
                  <div className="user-email flex items-center gap-2">
                    <EmailIcon />
                    <div className="fs-18 font-normal">
                      {otherUserData?.u_email_id}
                    </div>
                  </div>
                  <div className="divider d-none d-lg-block" />
                  <div className="user-email flex items-center gap-2">
                    <CallIcon />
                    <div className="fs-18 font-normal">
                      {otherUserData?.formatted_phonenumber ||
                        otherUserData?.phone_number}
                    </div>
                  </div>
                </div> */}
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
      </Modal.Body>
    </StyledModal>
  );
};

export default DisputeDetails;
