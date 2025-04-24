import Link from "next/link";
import {
  convertToTitleCase,
  formatLocalDate,
  numberWithCommas,
} from "@/helpers/utils/misc";
import classNames from "classnames";

type Props = {
  data: {
    jobdata: {
      job_title: string;
    };
    milestone: {
      title: string;
    };
    date_created: string;
    amount: string | number;
    charge_trans_id: string | number;
    payment_type: string;
  };
};

const PaymentCard = ({ data }: Props) => {
  return (
    <div
      className={classNames(
        "payment-card mb-4 bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-xl first:mt-6",
        {
          "refund-row": data.payment_type === "refund",
        }
      )}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="card-label text-sm font-normal">PROJECT NAME</div>
          <div className="text-xl font-normal">
            {convertToTitleCase(data.jobdata?.job_title)}
          </div>
        </div>
        <div>
          <div className="card-label text-sm font-normal">SUMMARY</div>
          <div className="text-xl font-normal">{data.milestone?.title}</div>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex-1">
            <div className="card-label text-sm font-normal">RECEIVED ON</div>
            <div className="text-xl font-normal">
              {formatLocalDate(data?.date_created, "LL")}
            </div>
          </div>
          <div className="flex-1 pl-1">
            <div className="card-label text-sm font-normal">AMOUNT</div>
            <div className="text-xl font-bold">
              ${numberWithCommas(data?.amount)}
            </div>
          </div>
        </div>
        <div className="my-2">
          <Link
            href={`/invoice/${data?.charge_trans_id}`}
            className="flex justify-center bg-[#eff3ff] py-3 px-6 rounded-[50px]"
          >
            <button className="download-btn text-base p-0 text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none">
              Download Invoice
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
