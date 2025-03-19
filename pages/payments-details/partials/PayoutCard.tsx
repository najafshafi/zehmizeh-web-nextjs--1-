import styled from "styled-components";
import { Card } from "react-bootstrap";
import {
  formatLocalDate,
  numberWithCommas,
  pxToRem,
} from "@/helpers/utils/misc";
import classNames from "classnames";

type Props = {
  data: {
    stripe_status: string;
    date_created: string;
    payment_amount: string | number;
    bank_detail: {
      bank_name: string;
      last_4_digit: string | number;
    };
    arrival_date: string;
    currency: string;
  };
};

const Wrapper = styled(Card)`
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.04);
  border-radius: 0.75rem;
  .payment-invoice-download-btn {
    background-color: rgba(239, 243, 255, 1);
    padding: 0.75rem 1.5rem;
    border-radius: ${pxToRem(50)};
  }
  :first-child {
    margin-top: 1.5rem;
  }
`;

const PayoutCard = ({ data }: Props) => {
  return (
    <Wrapper
      className={classNames("payment-card mb-4", {
        "refund-row": data.stripe_status === "pending",
      })}
    >
      <Card.Body className="flex flex-col gap-3">
        <div>
          <div className="card-label fs-sm font-normal">AMOUNT</div>
          <div className="fs-20 font-normal">
            {numberWithCommas(data?.payment_amount, data?.currency)}
          </div>
        </div>
        <div>
          <div className="card-label fs-sm font-normal">BANK NAME</div>
          <div className="fs-20 font-normal">
            {data?.bank_detail?.bank_name}
            {"****"}
            {data?.bank_detail?.last_4_digit}
          </div>
        </div>
        <div>
          <div className="card-label fs-sm font-normal">STATUS</div>
          <div className="fs-20 font-normal">
            {data?.stripe_status?.replace("_", " ")}
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex-1">
            <div className="card-label fs-sm font-normal">INITIATED DATE</div>
            <div className="fs-20 font-normal">
              {formatLocalDate(data?.date_created, "LL")}
            </div>
          </div>
          <div className="flex-1 ps-1">
            <div className="card-label fs-sm font-normal">
              ESTIMATED ARRIVAL DATE
            </div>
            <div className="fs-20 fw-700">
              {formatLocalDate(data?.arrival_date, "LL")}
            </div>
          </div>
        </div>
      </Card.Body>
    </Wrapper>
  );
};

export default PayoutCard;
