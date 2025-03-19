import { useMemo } from "react";
import cns from "classnames";
import styled from "styled-components";
import { transition } from "styles/transitions";
import { StatusBadge } from "components/styled/Badges";
import useResponsive, { breakpoints } from "helpers/hooks/useResponsive";
import { separateValuesWithComma } from "helpers/utils/misc";
import { ReactComponent as DollarCircleIcon } from "assets/icons/dollar-circle.svg";
import { ReactComponent as LocationIcon } from "assets/icons/location-blue.svg";
import { ReactComponent as StarIcon } from "assets/icons/star-yellow.svg";
import BlurredImage from "components/ui/BlurredImage";
import StyledHtmlText from "components/ui/StyledHtmlText";

const TalentComponentWrapper = styled.div<{ isSelected: boolean }>`
  background: ${(props) => props.theme.colors.white};
  margin: auto;
  padding: 2rem;
  @media ${breakpoints.mobile} {
    padding: 1rem;
  }
  margin-top: 1.875rem;
  border-radius: 14px;
  border: 2px solid
    ${(props) =>
      !props.isSelected
        ? props.theme.colors.gray5
        : props.theme.colors.lightBlue};
  ${() => transition()}
  .talent__avatar {
    margin-right: 1.75rem;
    @media ${breakpoints.mobile} {
      margin-right: 0;
    }
  }
  .talent__details {
    overflow: hidden;
  }
  .talent__details__title {
    line-height: 2rem;
  }
  .talent__details__post {
    /* line-height: 1rem; */
    opacity: 0.6;
  }
  .talent__details__description {
    margin-top: 1rem;
    line-height: 160%;
    letter-spacing: -0.02em;
    opacity: 0.6;
  }
  .talent__other-details {
    margin-top: 1.25rem;
    gap: 12px;
  }
  .budget {
    background: ${(props) => props.theme.colors.body2};
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
  }
  .budget-label {
    opacity: 0.63;
    letter-spacing: 0.02em;
  }
  .skills {
    gap: 10px;
  }
  .light-text {
    opacity: 0.63;
  }
`;

const TalentComponent = ({
  data,
  onSelect,
  isSelected,
}: {
  data?: any;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const COLORS = useMemo(() => ["orange", "green", "blue"], []);

  const { isMobile } = useResponsive();

  return (
    <>
      <TalentComponentWrapper
        isSelected={isSelected}
        className={cns("d-flex pointer align-items-start", {
          "flex-column g-2 align-items-center": isMobile,
        })}
        onClick={onSelect}
      >
        <BlurredImage
          src={data?.user_image || "/images/default_avatar.png"}
          height="5.75rem"
          width="5.75rem"
          className="talent__avatar"
        />
        <div className="talent__details w-100">
          <div
            className={
              isMobile
                ? "text-center"
                : "d-flex flex-wrap justify-content-between"
            }
          >
            <div>
              <div className="talent__details__title fs-24 font-normal capitalize">
                {data.first_name} {data.last_name}
              </div>
              {data.job_title !== null && (
                <div className="talent__details__post fs-18 font-normal mt-2 capital-first-ltr">
                  {data.job_title}
                </div>
              )}
            </div>
          </div>

          {/* Other details */}
          <OtherDetails data={data} />

          {data.about_me && (
            <div className="talent__details__description fs-18 fw-300">
              <StyledHtmlText
                htmlString={data?.about_me}
                needToBeShorten={true}
                id={`invite_freelancer_${data?.user_id}`}
              />
            </div>
          )}
          <div className="skills d-flex align-items-center flex-wrap">
            {data?.skills?.map((skill: any, index) => (
              <StatusBadge key={skill.id} color={COLORS[index % COLORS.length]}>
                {skill.name}
              </StatusBadge>
            ))}
          </div>
        </div>
      </TalentComponentWrapper>
    </>
  );
};

export default TalentComponent;

const OtherDetails = ({ data }: any) => {
  return (
    <div className="talent__other-details d-flex align-items-center flex-wrap">
      <div className="d-flex budget width-fit-content align-items-center">
        <DollarCircleIcon />
        {data.hourly_rate ? (
          <div className="fs-1rem font-normal d-flex mx-1">
            {data.hourly_rate}
            <div className="budget-label fs-1rem fw-300">/hr</div>
          </div>
        ) : (
          <div className="budget-label fs-1rem ms-1 fw-300">n/a</div>
        )}
      </div>

      {(data.location?.state || data?.location?.country_name) && (
        <div className="d-flex budget align-items-center">
          <LocationIcon />
          <div className="d-flex fs-1rem font-normal mx-1">
            {separateValuesWithComma([
              data?.location?.state,
              data?.location?.country_name,
            ])}
          </div>
        </div>
      )}
      {data.ratings !== null && (
        <div className="d-flex budget align-items-center">
          <StarIcon />
          <div className="ms-1 d-flex align-items-center fs-1rem font-normal">
            {data.rating}
            <div className="ms-1 budget-label fs-sm fw-300">
              Ratings ({data?.rating})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
