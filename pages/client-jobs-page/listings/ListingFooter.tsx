import { useMemo } from "react";
import moment from "moment";
import StarIcon from "@/public/icons/star-yellow.svg";
import BlurredImage from "@/components/ui/BlurredImage";
import { numberWithCommas, showFormattedBudget } from "@/helpers/utils/misc";

interface JobBudget {
  type: "fixed" | "hourly";
  isProposal: boolean;
  amount?: number;
  max_amount?: number;
  min_amount?: number;
}

interface JobItem {
  status: string;
  date_created: string;
  date_modified?: string;
  paid?: number;
  due_date?: string;
  budget?: JobBudget;
  proposal?: {
    approved_budget?: {
      amount: number;
      type: "fixed" | "hourly";
    };
  };
  userdata?: {
    user_image?: string;
    first_name: string;
    last_name: string;
  };
  is_completed?: number;
  rate?: number;
}

interface ListingFooterProps {
  item: JobItem;
}

const ListingFooter = ({ item }: ListingFooterProps) => {
  const dateLabel = useMemo(() => {
    const status = item.status;
    if (["prospects", "deleted"].includes(status)) {
      return "Posted on: ";
    } else if (status === "draft") {
      return "Created on: ";
    } else if (status === "active" || status === "closed") {
      return "Paid: ";
    } else return "";
  }, [item?.status]);

  return (
    <div>
      <div className="flex items-end flex-wrap justify-between">
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-1 flex-wrap">
            <label className="text-xl font-normal opacity-60">Budget:</label>
            <div className="text-xl font-normal">
              {item?.status === "active" || item?.status === "closed" ? (
                <>
                  {item?.proposal?.approved_budget?.amount &&
                    numberWithCommas(
                      item.proposal.approved_budget.amount,
                      "USD"
                    )}
                  {item?.proposal?.approved_budget?.type === "hourly"
                    ? "/hr"
                    : ""}{" "}
                </>
              ) : item?.budget?.isProposal ? (
                "Open To Proposals"
              ) : item?.budget ? (
                showFormattedBudget(item.budget)
              ) : (
                "-"
              )}
            </div>
          </div>

          <Divider />

          <div className="flex items-center gap-1 flex-wrap">
            <div className="text-xl font-normal opacity-60">{dateLabel}</div>
            <div className="text-xl font-normal">
              {item?.status === "active" || item?.status === "closed"
                ? item?.paid
                  ? numberWithCommas(item.paid, "USD")
                  : "$0"
                : moment(item?.date_created).format("MMM DD, YYYY")}
            </div>
          </div>

          {item?.status === "deleted" && item?.date_modified && (
            <>
              <Divider />
              <div className="flex items-center gap-1 flex-wrap ">
                <div className="text-xl font-normal opacity-60">
                  Closed On:{" "}
                </div>
                <div className="text-xl font-normal">
                  {moment(item.date_modified).format("MMM DD, YYYY")}
                </div>
              </div>
            </>
          )}

          {["prospects", "active"].includes(item.status) && (
            <>
              <Divider />
              <div className="flex items-center gap-1 flex-wrap ">
                <div className="text-xl font-normal opacity-60">Due Date:</div>
                <div className="text-xl font-normal">
                  {item?.due_date
                    ? moment(item?.due_date).format("MMM DD, YYYY")
                    : "-"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {item?.status === "active" || item?.status === "closed" ? (
        <div className="flex items-center mt-4">
          <BlurredImage
            src={item?.userdata?.user_image || "/images/default_avatar.png"}
            height="47px"
            width="47px"
            allowToUnblur={false}
            type="small"
          />
          <div className="flex items-center flex-wrap ml-3">
            <div className="text-lg font-normal capitalize">
              {item?.userdata?.first_name} {item?.userdata?.last_name}{" "}
              <span className="opacity-60">(Hired)</span>
            </div>
            {item?.status === "closed" &&
            item?.is_completed === 1 &&
            item?.rate ? (
              <div className="flex items-center gap-1 ml-2">
                <Stars ratings={item.rate} />
                <div className="text-lg font-normal italic">
                  {item.rate.toFixed(1)}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ListingFooter;

export const Stars = ({ ratings }: { ratings: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array(Math.floor(ratings))
        .fill(null)
        .map((_, i) => (
          <StarIcon key={i} />
        ))}
    </div>
  );
};

const Divider = () => {
  return <div className="hidden lg:block opacity-50">|</div>;
};
