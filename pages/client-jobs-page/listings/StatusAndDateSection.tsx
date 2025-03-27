import moment from "moment";
import { StatusBadge } from "@/components/styled/Badges";
import { changeStatusDisplayFormat } from "@/helpers/utils/misc";
import { JOBS_STATUS } from "../consts";
import ApplicantsIcon from "@/public/icons/applicants.svg";
import { useMemo } from "react";
import { MouseEvent } from "react";
import CustomButton from "@/components/custombutton/CustomButton";

type JobStatus =
  | "active"
  | "draft"
  | "prospects"
  | "deleted"
  | "closed"
  | "pending"
  | "denied"
  | "declined";

interface JobItem {
  status: JobStatus;
  job_start_date?: string;
  job_end_date?: string;
  applicants?: number;
  attributes?: {
    isExpired?: boolean;
  };
}

interface Props {
  item: JobItem;
  onInvite: () => void;
}

const StatusAndDateSection = ({ item, onInvite }: Props) => {
  const handleInvite = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onInvite();
  };

  const status = useMemo(() => {
    if (item.status) {
      /* checking if the job got expired. */
      if (item.attributes?.isExpired && item.status === "deleted")
        return {
          text: "Expired",
          color: JOBS_STATUS[item.status]?.color,
        };

      switch (item.status) {
        case "active":
          return {
            text: "Work in Progress",
            color: JOBS_STATUS[item.status]?.color,
          };
        case "draft":
          return {
            text: "Drafts",
            color: JOBS_STATUS[item.status]?.color,
          };
        case "prospects":
          return {
            text: "Posted Projects",
            color: JOBS_STATUS[item.status]?.color,
          };
        case "deleted":
          return {
            text: "Closed Before Hiring Freelancer",
            color: JOBS_STATUS[item.status]?.color,
          };
        default:
          return {
            text: changeStatusDisplayFormat(item.status),
            color: JOBS_STATUS[item.status]?.color || "yellow",
          };
      }
    }
    return undefined;
  }, [item.status]);

  return (
    <div className="flex flex-col justify-between items-start lg:items-end flex-2 gap-3">
      {status && (
        <div className="flex items-center flex-wrap gap-3">
          <StatusBadge color={status.color}>{status.text}</StatusBadge>

          {item.status === "prospects" && (
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-3">
              <ApplicantsIcon />
              <div className="text-xl font-normal">{item.applicants}</div>
              <div className="text-base font-light"> Proposals</div>
            </div>
          )}
        </div>
      )}
      {item.status === "closed" && (
        <div className="text-xl font-normal opacity-50">
          {moment(item.job_start_date).format("MMM DD, YYYY") +
            " - " +
            moment(item.job_end_date).format("MMM DD, YYYY")}
        </div>
      )}
      {item.status === "active" && (
        <div className="text-xl font-normal opacity-50">
          {moment(item.job_start_date).format("MMM DD, YYYY")} - Present
        </div>
      )}
      {(item.status === "closed" || item.status === "active") && (
        // <StyledButton
        //   padding="1rem 2rem"
        //   variant="outline-dark"
        //   onClick={handleInvite}
        // >
        //   Invite to another project
        // </StyledButton>

        <CustomButton
          text={"Invite to another project"}
          className={`px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full text-[18px] hover:bg-black hover:text-white border border-black`}
          onClick={handleInvite}
        />
      )}
    </div>
  );
};

export default StatusAndDateSection;
