"use client"; // Ensure this is a client component
import { useState } from "react";
import ProfileDetailSection from "../partials/ProfileDetailSection";
import StripeDetails from "@/components/stripe/stripeDetails";
import { useQueryData, useRefetch } from "@/helpers/hooks/useQueryData";
import { showAddBankButton } from "@/helpers/utils/helper";
import BankAccount from "../partials/BankAccount";
import AddBankAccount from "@/pages/freelancer-profile-settings/edit-modals/AddBankAccount";
import { queryKeys } from "@/helpers/const/queryKeys";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import Tooltip from "@/components/ui/Tooltip";

interface QueryResult {
  data: IFreelancerDetails;
}

export const PaymentDetails = () => {
  const result = useQueryData<QueryResult>(queryKeys.getFreelancerProfile);
  const { refetch } = useRefetch(queryKeys.getFreelancerProfile);
  const data = result?.data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const stpStatus = !data?.stp_account_id
    ? "pending"
    : data?.stp_account_status !== "verified"
      ? "inprogress"
      : "verified";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
      {/* Stripe Details */}
      <div className="col-span-1">
        {data?.stp_account_status && (
          <StripeDetails
            stripeStatus={data?.stp_account_status}
            stripe={data?.stripe}
            totalEarnings={data?.totalearning}
            refetch={refetch}
          />
        )}
      </div>

      {/* Payment Details */}
      <div className="col-span-1 pb-8">
        <ProfileDetailSection
          onEdit={() => setIsModalOpen(true)}
          fullwidth={true}
          add={showAddBankButton(data)}
          stripeStatus={stpStatus}
          edit={false}
          title={
            <div className="flex items-center gap-2">
              Payment Details
              <span className="group relative">
                <Tooltip>
                  <div>
                    <p>
                      After registering for Stripe, this is where freelancers
                      can add the details of the bank account(s) that their fees
                      will be sent to. These are not visible to any other user.
                    </p>
                  </div>
                </Tooltip>
              </span>
            </div>
          }
          details={
            showAddBankButton(data) ? (
              data?.account && data.account.length > 0 ? (
                data.account.map((item: any) => (
                  <div key={item?.user_bank_id}>
                    <BankAccount
                      item={item}
                      country={data?.location?.country_short_name}
                      refetch={refetch}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-lg my-3">
                  Add bank details here.
                </p>
              )
            ) : (
              <p className="text-center text-lg my-3">
                When Stripe registration is complete, add bank details here.
              </p>
            )
          }
        />
      </div>

      {/* Add Bank Account Modal */}
      <AddBankAccount
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={() => {
          setIsModalOpen(false);
          refetch();
        }}
        userCountry={data?.location?.country_short_name || ""}
      />
    </div>
  );
};
