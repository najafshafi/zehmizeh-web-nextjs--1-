import useResponsive from "@/helpers/hooks/useResponsive";
import { pxToRem } from "@/helpers/utils/misc";
import styled from "styled-components";
import Tabs from "@/components/ui/Tabs";
import { usePaymentController } from "../PaymentController";
import ProjectFilter from "./ProjectFilter";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useState } from "react";
import CustomSelect from "@/components/forms/custom-select";
import classNames from "classnames";

const Wrapper = styled.div<{ user_type?: "client" | "freelancer" }>`
  display: flex;
  justify-content: ${(props) =>
    props.user_type === "client" ? "flex-end" : "space-between"};
  align-items: center;
  margin: 0 20px;
  flex-wrap: wrap;
  padding-top: 1rem;
  @media (max-width: 767px) {
    flex-direction: column;
    padding-top: 1rem;
    margin-bottom: 1rem;
    gap: 1rem;
    height: auto;
  }
  .payment-header {
    &__total {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      span {
        color: ${({ theme }) => theme.font.color.heading};
        font-size: ${pxToRem(18)};
        opacity: 0.6;
      }
      h3 {
        color: ${({ theme }) => theme.font.color.heading};
        font-size: 2rem;
        font-weight: 700;
      }
    }
    &__filters {
      display: flex;
      gap: 0.5rem;
      @media (max-width: 767px) {
        flex-direction: column;
      }
      .refund-symbol {
        box-sizing: border-box;
        width: 23px;
        height: 23px;
        margin-right: 0.5rem;
        background: #fff1f1;
        border: 1px solid rgba(255, 4, 4, 0.1);
        border-radius: 12px;
      }
      .refund-label {
        margin-right: 1rem;
      }
    }
  }
`;

const RECORDS_PER_PAGE = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const TIME_OPTIONS = [
  { value: "alltime", label: "All-Time" },
  { value: "today", label: "Today" },
  { value: "thisweek", label: "This Week" },
  { value: "thismonth", label: "This Month" },
  { value: "thisyear", label: "This Year" },
  { value: "last3years", label: "Last 3 Year" },
];

type Props = {
  onTabUpdate?: (activeTab: string) => void;
};

function PaymentHeader({ onTabUpdate }: Props) {
  const { isTablet, isMobile } = useResponsive();
  const { filters, updateFilters } = usePaymentController();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("Transactions");

  const updateRowsPerPage = (option: {
    value: string | number;
    label: string;
  }) => {
    // Page will also be initialized to 1
    if (option.value) updateFilters({ page: 1, limit: option.value });
  };

  const onTabChange = (selectedValue: string) => {
    setActiveTab(selectedValue);
    onTabUpdate?.(selectedValue);
  };

  return (
    <Wrapper className="gap-3">
      <div
        className={classNames("w-full flex justify-between  ", {
          "flex-row": !isTablet || !isMobile,
          "flex-col gap-4": isTablet || isMobile,
        })}
      >
        <div className="flex justify-center flex-col">
          {/* AMIT - TotalEarnings was removed after this commit: c5d987ad343cb6ffb3f1b84bd091e38812f9b03a */}
          <div className="payment-header__filters">
            {user?.user_type === "client" ? (
              <div className="flex flex-row justify-center items-center">
                <label className="refund-symbol"></label>
                <label className="refund-label">Refund</label>
              </div>
            ) : null}
            <div>
              <CustomSelect
                options={RECORDS_PER_PAGE}
                onChange={updateRowsPerPage}
                title={
                  RECORDS_PER_PAGE.find(({ value }) => filters?.limit === value)
                    ?.label || "Rows"
                }
                selected={RECORDS_PER_PAGE.findIndex(
                  ({ value }) => filters?.limit === value
                )}
                defaultValue={RECORDS_PER_PAGE[0]}
              />
            </div>
            {activeTab === "Transactions" ? (
              <>
                <CustomSelect
                  onChange={({ value: filter }) => updateFilters({ filter })}
                  options={TIME_OPTIONS}
                  title={
                    TIME_OPTIONS.find(({ value }) => filters?.filter === value)
                      ?.label || "Date Range"
                  }
                  selected={TIME_OPTIONS.findIndex(
                    ({ value }) => filters?.filter === value
                  )}
                  defaultValue={TIME_OPTIONS[0]}
                />
                <ProjectFilter
                  value={filters?.job_post_id}
                  onChange={(id) =>
                    updateFilters({
                      job_post_id: id,
                    })
                  }
                />
              </>
            ) : null}
          </div>
        </div>
        <div>
          {user?.user_type !== "client" && (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Tabs
                tabs={[
                  {
                    label: "Transactions",
                    id: 0,
                    key: "Transactions",
                  },
                  {
                    label: "Payouts",
                    id: 1,
                    key: "Payouts",
                  },
                ]}
                activeTab={activeTab}
                onTabChange={(selected) => onTabChange(selected)}
                fontSize="1rem"
              />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default PaymentHeader;
