/*
 * This component displays the general details of the job,in this comoponent the detailsItem component
  serves all different sections available in design like, Description, expertise, budget etc.. *
 */
import React from 'react';
import styled from 'styled-components';
import StyledHtmlText from '@/components/ui/StyledHtmlText';
import AttachmentPreview from '@/components/ui/AttachmentPreview';
import { showFormattedBudget, expectedHoursRemap } from '@/helpers/utils/misc';
import { getCategories, getSkills } from '@/helpers/utils/helper';
import Link from 'next/link';

const DetailStyledItem = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.03);
  border-radius: 0.75rem;
  .job-detail-item-title {
    line-height: 2.1rem;
  }
  .description-text {
    opacity: 0.7;
  }
  .line-height-2rem {
    line-height: 2rem;
  }
  .job-detail-item-value {
    margin-top: 1.375rem;
  }
  .attachment {
    border: 1px solid #dedede;
    padding: 0.75rem;
    border-radius: 0.5rem;
    gap: 10px;
    width: 400px;
    max-width: 100%;
    .content {
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

interface JobData {
  job_description?: string;
  attachments?: string[];
  reference_links?: string[];
  reference_attachments?: string[];
  proposal?: {
    description?: string;
    attachments?: string[];
    status?: string;
    approved_budget?: {
      type?: string;
      amount?: number;
    };
  };
  budget?: {
    type?: string;
    isProposal?: boolean;
    amount?: number;
    min?: number;
    max?: number;
  };
  skills?: any[];
  expected_delivery_date?: string;
  time_scope?: string;
  languages?: { id: string; name: string }[];
  preferred_location?: string[];
  status?: string;
}

const JobOtherDetails = ({ data }: { data: JobData }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Full width sections */}
      <div className="col-span-1">
        <DetailsItem
          title="Project Description"
          atributeValue={
            <div>
              <div className="description-text line-height-2rem font-light text-lg mt-3">
                {/* This will convert html to normal text */}
                <StyledHtmlText htmlString={data?.job_description} needToBeShorten={true} />
              </div>
              {(data.attachments?.length > 0 ||
                data?.reference_links?.length > 0 ||
                data?.reference_attachments?.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  {/* START ----------------------------------------- Related Files */}
                  {data.attachments?.length > 0 && (
                    <div>
                      <div className="text-xl font-normal mb-2">Related Files</div>
                      <div className="flex flex-wrap" style={{ gap: '10px' }}>
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

                  {(data?.reference_links?.length > 0 || data?.reference_attachments?.length > 0) && (
                    <div>
                      <div className="text-xl font-normal mb-3">Style Samples</div>
                      {/* START ----------------------------------------- Style Samples Links */}
                      {data.reference_links?.length > 0 && (
                        <div className="mb-3">
                          {data.reference_links.map((referenceLink: string) => {
                            if (!referenceLink.includes('http')) {
                              referenceLink = `http://${referenceLink}`;
                            }
                            return (
                              <div key={referenceLink}>
                                <Link className="text-primary" href={referenceLink} target="_blank" rel="noreferrer">
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
                        <div className="flex flex-wrap" style={{ gap: '10px' }}>
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
      {(data?.proposal?.description || (data?.proposal?.attachments && data?.proposal?.attachments?.length > 0)) && (
        <div className="col-span-1">
          <DetailsItem
            title={`Freelancer's Proposal ${data?.proposal.status === 'accept' ? '(Accepted)' : ''}`}
            atributeValue={
              <div>
                {data?.proposal?.description && (
                  <div className="description-text line-height-2rem font-light text-lg mt-3">
                    <StyledHtmlText
                      id="job-proposal-description"
                      htmlString={data.proposal.description}
                      needToBeShorten={true}
                    />
                  </div>
                )}
                {data?.proposal?.attachments && data?.proposal?.attachments?.length > 0 && (
                  <div className="flex items-center gap-3 flex-wrap mt-3">
                    <div className="flex flex-wrap">
                      {data.proposal.attachments.map((attachment: string) => (
                        <div key={attachment} className="m-1">
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

      {/* Other details in a responsive grid that flows naturally */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Structure */}
        <div>
          <DetailsItem
            title="Payment Structure"
            atributeValue={
              <div className="job-detail-item-value text-xl font-normal">
                {data.budget?.type == 'fixed' ? 'Project-Based' : data.budget?.type == 'hourly' ? 'Hourly' : 'Unsure'}
              </div>  
            }
          />
        </div>

        {/* Budget (conditionally rendered) */}
        {(data.proposal?.status == 'pending' || data.status == 'prospects') &&
          data.status !== 'active' &&
          data.status !== 'closed' && (
            <div>
              <DetailsItem
                title="Budget"
                atributeValue={
                  <div className="job-detail-item-value text-xl font-normal mt-3">
                    {data.status == 'active' || data.status == 'closed'
                      ? showFormattedBudget(data.proposal?.approved_budget)
                      : data?.budget?.isProposal === true
                      ? 'Open to Proposals'
                      : data?.budget
                      ? showFormattedBudget(data.budget)
                      : '-'}
                  </div>
                }
              />
            </div>
          )}

        {/* Skills Category */}
        {getCategories(data.skills).length > 0 && (
          <div>
            <DetailsItem
              title="Skills Category"
              atributeValue={
                <div className="flex items-center mt-3 flex-wrap">
                  <div className="description-text line-height-2rem font-light text-xl capitalize">
                    {getCategories(data.skills)
                      .map((dt) => dt.category_name)
                      .join(', ')}
                  </div>
                </div>
              }
            />
          </div>
        )}

        {/* Skills */}
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
                          className="description-text line-height-2rem font-light text-xl capitalize"
                          key={item.skill_id}
                        >
                          {item.skill_name}
                          {index < getSkills(data?.skills)?.length - 1 ? ',' : ''}
                          &nbsp;
                        </div>
                      )
                  )}
                </div>
              }
            />
          </div>
        )}

        {/* Delivery Time */}
        {data?.expected_delivery_date && (
          <div>
            <DetailsItem
              title="Delivery Time"
              atributeValue={
                <div className="job-detail-item-value">
                  <div className="flex items-center gap-1 flex-wrap">
                    <div className="description-text text-xl font-normal">Duration:</div>
                    <div className="text-xl font-normal">{data.expected_delivery_date}</div>
                  </div>
                </div>
              }
            />
          </div>
        )}

        {/* Expected Hours */}
        {expectedHoursRemap(data.time_scope) && (
          <div>
            <DetailsItem
              title="Expected Hours Required"
              atributeValue={<div className="mt-3 text-xl font-normal">{expectedHoursRemap(data.time_scope)}</div>}
            />
          </div>
        )}

        {/* Language */}
        {data.languages?.length > 0 && (
          <div>
            <DetailsItem
              title="Language"
              atributeValue={
                <div className="flex items-center mt-3 flex-wrap">
                  {data.languages?.map((item, index: number) => (
                    <div className="description-text line-height-2rem font-light text-xl" key={item.id}>
                      {item.name}
                      {index < data?.languages?.length - 1 ? ',' : ''}&nbsp;
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        )}

        {/* Preferred Freelancer Location */}
        {Array.isArray(data?.preferred_location) && data?.preferred_location?.length > 0 && (
          <div>
            <DetailsItem
              title="Preferred Freelancer Location"
              atributeValue={<div className="mt-3 text-xl font-normal">{data.preferred_location.join(', ')}</div>}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOtherDetails;

const DetailsItem = ({ title, atributeValue }: { title: string; atributeValue: React.ReactNode }) => {
  return (
    <DetailStyledItem>
      <div className="job-detail-item-title text-2xl font-normal">{title}</div>
      {atributeValue}
    </DetailStyledItem>
  );
};
