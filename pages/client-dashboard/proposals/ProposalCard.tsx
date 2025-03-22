/*
 * This is the proposal card that display received proposal details
 */

import styled from "styled-components";
import BlurredImage from "@/components/ui/BlurredImage";
import { transition } from "@/styles/transitions";
import { convertToTitleCase, numberWithCommas } from "@/helpers/utils/misc";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import moment from "moment";
import { formatDateAndTime } from "@/helpers/utils/formatter";

const Wrapper = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  padding: 1.25rem;
  word-break: break-word;
  position: relative;
  overflow: hidden;
  .divider {
    height: 6rem;
    width: 1px;
    background-color: #d9d9d9;
  }
  .light-text {
    opacity: 0.5;
  }
  .budget {
    background-color: #fbf5e8;
    border-radius: 1rem;
    padding: 0.375rem 0.75rem;
  }
  .updated-on {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: #ffedd3;
    color: #ee761c;
    padding: 2px 0px;
  }
  ${() => transition()} .details {
    margin-top: 0.75rem;
  }
`;

type Props = {
  data: any;
  onSelect: () => void;
};

const ProposalCard = ({ data, onSelect }: Props) => {
  return (
    <Wrapper className="mt-3 cursor-pointer" onClick={onSelect}>
      {data?.edited_at && (
        <p className="updated-on">
          Updated on {formatDateAndTime(data.edited_at)}
        </p>
      )}
      <div className={`fs-18 fw-400 ${data?.edited_at ? "mt-3" : ""}`}>
        {convertToTitleCase(data?.job_title)}
      </div>

      <div className="flex items-center details gap-4 flex-wrap">
        {/* Freelancer image and name */}
        <div className="flex items-center gap-2">
          <BlurredImage
            src={data?.userdata?.user_image || "/images/default_avatar.png"}
            height="42px"
            width="42px"
            allowToUnblur={false}
            type="small"
          />
          <div>
            <div className="light-text fs-sm fw-400">Proposed by:</div>
            <div className="fs-1rem fw-400 text-capitalize">
              {data?.first_name} {data?.last_name}
            </div>

            {/* Proposal date */}
            {data?.applied_on && (
              <div className="mt-2">
                <div className="light-text fs-sm fw-400">Proposal Date:</div>
                <div className="fs-1rem fw-400 text-capitalize">
                  {moment(data?.applied_on).format("MMM DD, YYYY")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Budget */}
        <div className="flex items-center fs-1rem fw-400 budget">
          <DollarCircleIcon />
          <span className="ms-1">
            {numberWithCommas(data?.proposed_budget?.amount, "USD")}
          </span>
          {data?.proposed_budget?.type == "fixed" ? (
            <span className="light-text ms-1">Cost estimation</span>
          ) : (
            <span className="light-text">/hr</span>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default ProposalCard;
