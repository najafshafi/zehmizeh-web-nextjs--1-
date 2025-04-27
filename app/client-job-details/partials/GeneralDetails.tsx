import React from "react";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { showFormattedBudget, expectedHoursRemap } from "@/helpers/utils/misc";
import { getCategories, getSkills } from "@/helpers/utils/helper";
import Link from "next/link";

const JobOtherDetails = ({ data }: any) => {
  const skillCategory = getCategories(data?.skills);
  const skills = getSkills(data?.skills);

  return (
    <div className="flex flex-wrap -mx-2 ">
      <div className="w-full px-2">
        <DetailsItem
          title="Project Description"
          atributeValue={
            <div>
              <div className="description-text line-height-2rem font-light text-xl mt-3">
                <StyledHtmlText
                  id="job-description"
                  htmlString={data.job_description}
                  needToBeShorten={true}
                />
              </div>
              {(data.attachments?.length > 0 ||
                data?.reference_links?.length > 0 ||
                data?.reference_attachments?.length > 0) && (
                <div className="flex flex-wrap -mx-2 mt-4">
                  {/* START ----------------------------------------- Related Files */}
                  {data.attachments?.length > 0 && (
                    <div className="w-full lg:w-1/2 px-2">
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
                    <div className="w-full lg:w-1/2 px-2">
                      <div className="text-xl font-normal mb-2">
                        Style Samples
                      </div>
                      {/* START ----------------------------------------- Style Samples Links */}
                      {data.reference_links?.length > 0 && (
                        <div className="mb-3">
                          {data.reference_links.map((referenceLink: string) => {
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

      {/* Freelancer's proposal card */}
      {(data?.proposal?.description ||
        (data?.proposal?.attachments &&
          data?.proposal?.attachments?.length > 0)) && (
        <div className="w-full px-2">
          <DetailsItem
            title="Freelancer's Proposal (Accepted)"
            atributeValue={
              <div>
                {data?.proposal?.description && (
                  <div className="description-text line-height-2rem font-light text-xl mt-3">
                    <StyledHtmlText
                      id="job-proposal-description"
                      htmlString={data.proposal.description}
                      needToBeShorten={true}
                    />
                  </div>
                )}
                {data?.proposal?.attachments &&
                  data?.proposal?.attachments?.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap mt-3">
                      <div className="flex flex-wrap">
                        {data.proposal.attachments.map((attachment: string) => (
                          <div className="m-1" key={attachment}>
                            <AttachmentPreview
                              uploadedFile={attachment}
                              removable={false}
                              shouldShowFileNameAndExtension={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            }
          />
        </div>
      )}
      <div className="w-full lg:w-1/2 px-2">
        <DetailsItem
          title="Payment Structure"
          atributeValue={
            <div className="job-detail-item-value text-xl font-normal">
              {data.budget?.type == "fixed"
                ? "Project-Based"
                : data.budget?.type == "hourly"
                  ? "Hourly"
                  : "Unsure"}
            </div>
          }
        />
      </div>
      {(data.proposal?.status == "pending" || data.status == "prospects") &&
        data.status !== "active" &&
        data.status !== "closed" && (
          <div className="w-full lg:w-1/2 px-2">
            <DetailsItem
              title="Budget"
              atributeValue={
                <div className="job-detail-item-value font-normal text-xl mt-3">
                  {data.status == "active" || data.status == "closed"
                    ? showFormattedBudget(data.proposal?.approved_budget)
                    : data?.budget?.isProposal === true
                      ? "Open to Proposals"
                      : data?.budget
                        ? showFormattedBudget(data.budget)
                        : "-"}
                </div>
              }
            />
          </div>
        )}
      {skillCategory?.length > 0 && (
        <div className="w-full lg:w-1/2 px-2">
          <DetailsItem
            title="Skills Category"
            atributeValue={
              <div className="flex items-center mt-3 flex-wrap">
                {skillCategory.map(
                  (item: any, index: number, arr) =>
                    (item.category_name || item.category_id) && (
                      <div
                        className="description-text capitalize line-height-2rem font-light text-xl"
                        key={`category-${item.category_id}-${index}`}
                      >
                        {item.category_name}
                        {index < arr?.length - 1 ? "," : ""}
                      </div>
                    )
                )}
              </div>
            }
          />
        </div>
      )}
      {skills?.length > 0 && (
        <div className="w-full lg:w-1/2 px-2">
          <DetailsItem
            title="Skill(s)"
            atributeValue={
              <div className="flex items-center mt-3 flex-wrap">
                {skills.map(
                  (item, index: number, arr) =>
                    (item.skill_name || item.skill_id) && (
                      <div
                        className="description-text capitalize line-height-2rem font-light text-xl"
                        key={`skill-${item.skill_id}-${index}`}
                      >
                        {item.skill_name}
                        {index < arr?.length - 1 ? "," : ""}
                      </div>
                    )
                )}
              </div>
            }
          />
        </div>
      )}
      {data?.expected_delivery_date && (
        <div className="w-full lg:w-1/2 px-2">
          <DetailsItem
            title="Delivery Time"
            atributeValue={
              <div className="job-detail-item-value">
                <div className="flex items-center gap-1 flex-wrap">
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
      {expectedHoursRemap(data.time_scope) && (
        <div className="w-full lg:w-1/2 px-2">
          <DetailsItem
            title="Expected Hours Required"
            atributeValue={
              <div className="mt-3 text-xl font-normal">
                {expectedHoursRemap(data.time_scope)}
              </div>
            }
          />
        </div>
      )}

      {data.languages?.length > 0 && (
        <div className="w-full lg:w-1/2 px-2">
          <DetailsItem
            title="Language"
            atributeValue={
              <div className="flex items-center mt-3 flex-wrap">
                {data.languages?.map(
                  (
                    item: { id: string | number; name: string },
                    index: number
                  ) => (
                    <div
                      className="description-text line-height-2rem fw-300 fs-18"
                      key={`language-${item.id}-${index}`}
                    >
                      {item.name}
                      {index < data?.languages?.length - 1 ? "," : ""}
                    </div>
                  )
                )}
              </div>
            }
          />
        </div>
      )}

      {Array.isArray(data?.preferred_location) &&
        data?.preferred_location?.length > 0 && (
          <div className="w-full lg:w-1/2 px-2">
            <DetailsItem
              title="Preferred Freelancer Location"
              atributeValue={
                <div className="mt-3 text-xl font-normal">
                  {data.preferred_location.includes("Anywhere")
                    ? "Anywhere"
                    : data.preferred_location.join(", ")}
                </div>
              }
            />
          </div>
        )}
    </div>
  );
};

export default JobOtherDetails;

const DetailsItem = ({
  title,
  atributeValue,
}: {
  title: string;
  atributeValue: React.ReactNode;
}) => {
  return (
    <div className="mx-auto mt-8 p-8 bg-white bg-opacity-70 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] rounded-[0.75rem]">
      <div className="text-2xl font-normal leading-[2.1rem]">{title}</div>
      {atributeValue}
    </div>
  );
};

// Add these global styles to your CSS to maintain the same look for nested classes
// .description-text { @apply opacity-70; }
// .line-height-2rem { @apply leading-8; }
// .job-detail-item-value { @apply mt-[1.375rem]; }
// .attachment { @apply border border-[#dedede] p-3 rounded-lg gap-[10px] w-[400px] max-w-full; }
// .attachment .content { @apply max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis; }
