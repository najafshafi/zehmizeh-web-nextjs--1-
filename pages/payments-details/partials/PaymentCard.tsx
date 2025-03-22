import styled from "styled-components";
import Link from "next/link";
import {
  convertToTitleCase,
  formatLocalDate,
  numberWithCommas,
  pxToRem,
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

const Wrapper = styled.div`
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.04);
  border-radius: 0.75rem;
  .payment-invoice-download-btn {
    display: flex;
    justify-content: center;
    background-color: rgba(239, 243, 255, 1);
    padding: 0.75rem 1.5rem;
    border-radius: ${pxToRem(50)};
  }
  :first-child {
    margin-top: 1.5rem;
  }
`;

const PaymentCard = ({ data }: Props) => {
  return (
    <Wrapper
      className={classNames("payment-card mb-4 bg-white p-4", {
        "refund-row": data.payment_type === "refund",
      })}
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
            className="payment-invoice-download-btn"
          >
            <button className="download-btn text-base p-0 text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none">
              Download Invoice
            </button>
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default PaymentCard;
