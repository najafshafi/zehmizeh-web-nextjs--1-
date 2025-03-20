import React from "react";
import styled from "styled-components";
import { expectedHoursRemap, showFormattedBudget } from "@/helpers/utils/misc";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { getCategories, getSkills } from "@/helpers/utils/helper";
import { TJobDetails } from "@/helpers/types/job.type";
import Link from "next/link";

type Props = {
  data: TJobDetails;
  isProposalSubmitted: boolean;
};

const DetailStyledItem = styled.div`
  margin: auto;
  margin-top: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.03);
  border-radius: 0.75rem;
  .job-detail-item-title {
    line-height: 2.1rem;
  }
  .description-text {
    opacity: 0.5;
  }
  .line-height-2rem {
    line-height: 2rem;
  }
  .job-detail-item-value {
    margin-top: 1.375rem;
  }
`;

const OfferOtherDetails = ({ data, isProposalSubmitted }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {/* START ----------------------------------------- Client's invitation */}
      {!isProposalSubmitted && !!data?.invite_message && (
        <div className="col-span-1">
          <DetailsItem
            title="Client's Invitation"
            atributeValue={
              <div className="line-height-2rem font-light text-lg mt-3">
                <StyledHtmlText
                  htmlString={data.invite_message}
                  id={`invite_msg_${data.invite_message}`}
                  needToBeShorten={true}
                />
              </div>
            }
          />
        </div>
      )}
      {/* END ------------------------------------------- Client's invitation */}

      <div className="col-span-1">
        <DetailsItem
          title="Project Description"
          atributeValue={
            <div>
              <div className="description-text line-height-2rem font-light text-lg mt-3">
                {/* This will convert html to normal text */}
                <StyledHtmlText
                  htmlString={data.job_description}
                  id={`offer_${data.job_post_id}`}
                  needToBeShorten={true}
                />
              </div>
              {(data.attachments?.length > 0 ||
                data?.reference_links?.length > 0 ||
                data?.reference_attachments?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* START ----------------------------------------- Related Files */}
                  {data.attachments?.length > 0 && (
                    <div>
                      <div className="text-xl font-normal mb-2">
                        Related Files
                      </div>
                      <div className="flex flex-wrap" style={{ gap: "10px" }}>
                        {data.attachments?.map((item: string) => (
                          <AttachmentPreview
                            key={item}
                            uploadedFile={item}
                            removable={false}
                            shouldShowFileNameAndExtension={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {/* END ------------------------------------------- Related Files */}

                  {(data?.reference_links?.length > 0 ||
                    data?.reference_attachments?.length > 0) && (
                    <div>
                      <div className="text-xl font-normal mb-2">
                        Style Samples
                      </div>
                      {/* START ----------------------------------------- Style Samples Links */}
                      {data.reference_links?.length > 0 && (
                        <div className="mb-3">
                          {data.reference_links.map((referenceLink) => {
                            if (!referenceLink.includes("http")) {
                              referenceLink = `http://${referenceLink}`;
                            }
                            return (
                              <div key={referenceLink}>
                                <Link
                                  className="text-primary"
                                  href={referenceLink}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {referenceLink}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {/* END ------------------------------------------- Style Samples Links */}

                      {/* START ----------------------------------------- Style Samples Attachments */}
                      {data?.reference_attachments?.length > 0 && (
                        <div className="flex flex-wrap" style={{ gap: "10px" }}>
                          {data?.reference_attachments?.map((item: string) => (
                            <AttachmentPreview
                              key={item}
                              uploadedFile={item}
                              removable={false}
                              shouldShowFileNameAndExtension={false}
                            />
                          ))}
                        </div>
                      )}
                      {/* END ------------------------------------------- Style Samples Attachments */}
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* START ----------------------------------------- Job Details Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* START ----------------------------------------- Budget */}
        {(data.budget?.isProposal === true ||
          showFormattedBudget(data.budget)) && (
          <div>
            <DetailsItem
              title="Budget"
              atributeValue={
                <div className="job-detail-item-value font-normal text-lg">
                  {data.budget?.isProposal === true
                    ? "Open to Proposals"
                    : showFormattedBudget(data.budget)}
                </div>
              }
            />
          </div>
        )}
        {/* END ------------------------------------------- Budget */}

        {/* START ----------------------------------------- Payment Structure */}
        {data.budget?.type && (
          <div>
            <DetailsItem
              title="Payment Structure"
              atributeValue={
                <div className="job-detail-item-value text-lg font-normal">
                  {data.budget?.type == "fixed"
                    ? "Project-Based"
                    : data.budget?.type == "hourly"
                    ? "Hourly"
                    : "Unsure"}
                </div>
              }
            />
          </div>
        )}
        {/* END ------------------------------------------- Payment Structure */}

        {/* START ----------------------------------------- Duration */}
        {data?.expected_delivery_date && (
          <div>
            <DetailsItem
              title="Delivery Time"
              atributeValue={
                <div className="job-detail-item-value">
                  <div className="flex items-center gap-1">
                    <div className="description-text text-xl font-normal">
                      Duration:
                    </div>
                    <div className="text-xl font-normal">
                      {data.expected_delivery_date}
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        )}
        {/* END ------------------------------------------- Duration */}

        {/* START ----------------------------------------- Categories */}
        {getCategories(data.skills).length > 0 && (
          <div>
            <DetailsItem
              title="Skills Category"
              atributeValue={
                <div className="flex items-center mt-3 flex-wrap">
                  <div className="description-text line-height-2rem font-light text-lg capitalize">
                    {getCategories(data.skills)
                      .map((dt) => dt.category_name)
                      .join(", ")}
                  </div>
                </div>
              }
            />
          </div>
        )}
        {/* END ------------------------------------------- Categories */}

        {/* START ----------------------------------------- Expected hours */}
        {expectedHoursRemap(
          data.time_scope as "simple" | "bigger" | "ongoing"
        ) && (
          <div>
            <DetailsItem
              title="Expected Hours Required"
              atributeValue={
                <div className="mt-3 text-lg font-normal">
                  {expectedHoursRemap(
                    data.time_scope as "simple" | "bigger" | "ongoing"
                  )}
                </div>
              }
            />
          </div>
        )}
        {/* END ------------------------------------------- Expected hours */}

        {/* START ----------------------------------------- Skills */}
        {getSkills(data.skills)?.length > 0 && (
          <div>
            <DetailsItem
              title="Skill(s)"
              atributeValue={
                <div className="flex items-center mt-3 flex-wrap">
                  {getSkills(data.skills)?.map(
                    (item, index: number) =>
                      item.skill_id && (
                        <div
                          className="description-text line-height-2rem font-light text-lg capitalize"
                          key={item.skill_id}
                        >
                          {item.skill_name}
                          {index < getSkills(data?.skills)?.length - 1
                            ? ","
                            : ""}
                          &nbsp;
                        </div>
                      )
                  )}
                </div>
              }
            />
          </div>
        )}
        {/* END ------------------------------------------- Skills */}

        {/* START ----------------------------------------- Preferred Location */}
        {Array.isArray(data?.preferred_location) &&
          data?.preferred_location?.length > 0 && (
            <div>
              <DetailsItem
                title="Preferred Freelancer Location"
                atributeValue={
                  <div className="mt-3 text-lg font-normal">
                    {data.preferred_location.join(", ")}
                  </div>
                }
              />
            </div>
          )}
        {/* END ------------------------------------------- Preferred Location */}

        {/* START ----------------------------------------- Language */}
        {data.languages?.length > 0 && (
          <div>
            <DetailsItem
              title="Language"
              atributeValue={
                <div className="flex items-center mt-3 flex-wrap">
                  {data.languages?.map((item, index: number) => (
                    <div
                      className="description-text line-height-2rem font-light text-lg"
                      key={item.id}
                    >
                      {item.name}
                      {index < data?.languages?.length - 1 ? "," : ""}&nbsp;
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        )}
        {/* END ------------------------------------------- Language */}
      </div>
      {/* END ------------------------------------------- Job Details Items */}
    </div>
  );
};

export default OfferOtherDetails;

const DetailsItem = ({
  title,
  atributeValue,
}: {
  title: string;
  atributeValue: React.ReactNode;
}) => {
  return (
    <DetailStyledItem>
      <div className="job-detail-item-title text-2xl font-normal">{title}</div>
      {atributeValue}
    </DetailStyledItem>
  );
};
