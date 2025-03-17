/*
 * This component displays the general details of the job,in this comoponent the detailsItem component
  serves all different sections available in design like, Description, expertise, budget etc.. *
 */
import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'react-bootstrap';
import StyledHtmlText from '@/components/ui/StyledHtmlText';
import AttachmentPreview from '@/components/ui/AttachmentPreview';
import { showFormattedBudget, expectedHoursRemap } from '@/helpers/utils/misc';
import { getCategories, getSkills } from '@/helpers/utils/helper';

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

const JobOtherDetails = ({ data }: any) => {
  return (
    <Row>
      <Col lg="12">
        <DetailsItem
          title="Project Description"
          atributeValue={
            <div>
              <div className="description-text line-height-2rem fw-300 fs-18 mt-3">
                {/* This will convert html to normal text */}
                <StyledHtmlText htmlString={data?.job_description} needToBeShorten={true} />
              </div>
              {(data.attachments?.length > 0 ||
                data?.reference_links?.length > 0 ||
                data?.reference_attachments?.length > 0) && (
                <Row className="mt-4">
                  {/* START ----------------------------------------- Related Files */}
                  {data.attachments?.length > 0 && (
                    <Col>
                      <div className="fs-20 fw-400 mb-2">Related Files</div>
                      <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                        {data.attachments?.map((item: string) => (
                          <AttachmentPreview
                            key={item}
                            uploadedFile={item}
                            removable={false}
                            shouldShowFileNameAndExtension={false}
                          />
                        ))}
                      </div>
                    </Col>
                  )}
                  {/* END ------------------------------------------- Related Files */}

                  {(data?.reference_links?.length > 0 || data?.reference_attachments?.length > 0) && (
                    <Col>
                      <div className="fs-20 fw-400 mb-2">Style Samples</div>
                      {/* START ----------------------------------------- Style Samples Links */}
                      {data.reference_links?.length > 0 && (
                        <div className="mb-3">
                          {data.reference_links.map((referenceLink) => {
                            if (!referenceLink.includes('http')) {
                              referenceLink = `http://${referenceLink}`;
                            }
                            return (
                              <div key={referenceLink}>
                                <a className="text-primary" href={referenceLink} target="_blank" rel="noreferrer">
                                  {referenceLink}
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {/* END ------------------------------------------- Style Samples Links */}

                      {/* START ----------------------------------------- Style Samples Attachments */}
                      {data?.reference_attachments?.length > 0 && (
                        <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
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
                    </Col>
                  )}
                </Row>
              )}
            </div>
          }
        />
      </Col>

      {/* Freelancer's proposal card */}
      {(data?.proposal?.description || (data?.proposal?.attachments && data?.proposal?.attachments?.length > 0)) && (
        <Col lg="12">
          <DetailsItem
            title={`Freelancer's Proposal ${data?.proposal.status === 'accept' ? '(Accepted)' : ''}`}
            atributeValue={
              <div>
                {data?.proposal?.description && (
                  <div className="description-text line-height-2rem fw-300 fs-18 mt-3">
                    <StyledHtmlText
                      id="job-proposal-description"
                      htmlString={data.proposal.description}
                      needToBeShorten={true}
                    />
                  </div>
                )}
                {data?.proposal?.attachments && data?.proposal?.attachments?.length > 0 && (
                  <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
                    <div className="d-flex flex-wrap">
                      {data.proposal.attachments.map((attachment) => (
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
        </Col>
      )}

      {/* Here budget will be like this:
       * If budget type is fixed, budget will be = {amount: ''}
       * If hourly: budget will be like = {min: '', max: ''}
       * If unsure: budget will be can be like any of the above
       */}
      <Col lg="6">
        <DetailsItem
          title="Payment Structure"
          atributeValue={
            <div className="job-detail-item-value fs-18 fw-400">
              {data.budget?.type == 'fixed' ? 'Project-Based' : data.budget?.type == 'hourly' ? 'Hourly' : 'Unsure'}
            </div>
          }
        />
      </Col>
      {(data.proposal?.status == 'pending' || data.status == 'prospects') &&
        data.status !== 'active' &&
        data.status !== 'closed' && (
          <Col lg="6">
            <DetailsItem
              title="Budget"
              atributeValue={
                <div className="job-detail-item-value fw-400 fs-18 mt-3">
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
          </Col>
        )}
      {getCategories(data.skills).length > 0 && (
        <Col lg="6">
          <DetailsItem
            title="Skills Category"
            atributeValue={
              <div className="d-flex align-items-center mt-3 flex-wrap">
                <div className="description-text line-height-2rem fw-300 fs-18 text-capitalize">
                  {getCategories(data.skills)
                    .map((dt) => dt.category_name)
                    .join(', ')}
                </div>
              </div>
            }
          />
        </Col>
      )}
      {getSkills(data.skills)?.length > 0 && (
        <Col lg="6">
          <DetailsItem
            title="Skill(s)"
            atributeValue={
              <div className="d-flex align-items-center mt-3 flex-wrap">
                {getSkills(data.skills)?.map(
                  (item, index: number) =>
                    item.skill_id && (
                      <div
                        className="description-text line-height-2rem fw-300 fs-18 text-capitalize"
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
        </Col>
      )}
      {data?.expected_delivery_date && (
        <Col lg="6">
          <DetailsItem
            title="Delivery Time"
            atributeValue={
              <div className="job-detail-item-value">
                <div className="d-flex align-items-center g-1 flex-wrap">
                  <div className="description-text fs-20 fw-400">Duration:</div>
                  <div className="fs-20 fw-400">{data.expected_delivery_date}</div>
                </div>
              </div>
            }
          />
        </Col>
      )}
      {expectedHoursRemap(data.time_scope) && (
        <Col lg="6">
          <DetailsItem
            title="Expected Hours Required"
            atributeValue={<div className="mt-3 fs-18 fw-400">{expectedHoursRemap(data.time_scope)}</div>}
          />
        </Col>
      )}
      {data.languages?.length > 0 && (
        <Col lg="6">
          <DetailsItem
            title="Language"
            atributeValue={
              <div className="d-flex align-items-center mt-3 flex-wrap">
                {data.languages?.map((item: any, index: number) => (
                  <div className="description-text line-height-2rem fw-300 fs-18" key={item.id}>
                    {item.name}
                    {index < data?.languages?.length - 1 ? ',' : ''}&nbsp;
                  </div>
                ))}
              </div>
            }
          />
        </Col>
      )}
      {Array.isArray(data?.preferred_location) && data?.preferred_location?.length > 0 && (
        <Col lg="6">
          <DetailsItem
            title="Preferred Freelancer Location"
            atributeValue={<div className="mt-3 fs-18 fw-400">{data.preferred_location.join(', ')}</div>}
          />
        </Col>
      )}
    </Row>
  );
};

export default JobOtherDetails;

const DetailsItem = ({ title, atributeValue }: { title: string; atributeValue: React.ReactNode }) => {
  return (
    <DetailStyledItem>
      <div className="job-detail-item-title fs-24 fw-400">{title}</div>
      {atributeValue}
    </DetailStyledItem>
  );
};
