import { useState } from "react";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/styled/Badges";
import NoDataFound from "@/components/ui/NoDataFound";
import AddBankAccount from "./AddBankAccount";
import VerifyBankAccount from "./VerifyBankAccount";
import { deleteBankAccount } from "@/helpers/http/client";
import { changeStatusDisplayFormat } from "@/helpers/utils/misc";
import TrashIcon from "@/public/icons/trash.svg";
import { formatingAccountNumber } from "@/helpers/utils/helper";
import { formatRoutingNumber } from "@/helpers/utils/helper";
import moment from "moment";
import CustomButton from "@/components/custombutton/CustomButton";

type BankAccount = {
  user_bank_id: string;
  status: string;
  account_holder_name: string;
  account_holder_type: string;
  last_4_digit: string;
  routing_number?: string;
  stripe_bank_account_id: string;
  date_created: string;
};

type Props = {
  paymentData: BankAccount[];
  refetch: () => void;
  onNewAdded: () => void;
  userCountry: string;
};

const BankAccounts = ({
  paymentData,
  refetch,
  userCountry,
  onNewAdded,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [showVerifyModal, setShowVerifiedModal] = useState({
    show: false,
    bankAccountId: "",
  });
  const [showAddCardForm, setShowAddCardForm] = useState<boolean>(false);

  const toggleAddCardForm = () => {
    /* This will toggle add card form */
    setShowAddCardForm(!showAddCardForm);
  };

  const onDelete = (id: string) => () => {
    /* This function will delete the bank account */

    if (selectedId == "") {
      setSelectedId(id);

      const promise = deleteBankAccount({
        action: "delete_account",
        delete_id: id,
      });

      /* Delete api call */
      toast.promise(promise, {
        loading: "Loading...",
        success: (res) => {
          /* Once the bank account is deleted, it will refetch the profile to get the latest bank accounts */
          setSelectedId("");
          refetch();
          return res.message;
        },
        error: (err) => {
          setSelectedId("");
          return err?.response?.data?.message || "error";
        },
      });
    }
  };

  const onBankAccountAdded = () => {
    /* This will close the add bank account form and refetch the profile details again */
    toggleAddCardForm();
    refetch();
    onNewAdded();
  };

  const openVerifyAccountModal = (bankAccountId: string) => () => {
    // This will open the verify bank account modal
    setShowVerifiedModal({ show: true, bankAccountId });
  };

  const closeVerifyAccountModal = () => {
    // This will open the verify bank account modal
    setShowVerifiedModal({ show: false, bankAccountId: "" });
  };

  const onBankAccountVerified = () => {
    // This will open the verify bank account modal
    setShowVerifiedModal({ show: false, bankAccountId: "" });
    refetch();
  };

  return (
    <div className="mx-auto bg-white rounded-xl shadow-[0px_4px_60px_rgba(0,0,0,0.05)] p-8 min-h-[570px]  md:min-h-auto">
      {/* Heading */}
      <div className="text-2xl font-normal">Bank Account Details</div>
      {!showAddCardForm && paymentData?.length === 0 && (
        <NoDataFound className="py-5" />
      )}
      {/* Saved cards */}
      <div className="max-h-[400px] overflow-y-auto reduce-pad">
        {paymentData?.length > 0 &&
          paymentData?.map((item: BankAccount) => (
            <div
              key={item?.user_bank_id}
              className="flex justify-between mt-3 gap-2 p-4 border border-[#E6E6E6] rounded-[0.875rem]"
            >
              <div className="flex-1">
                {/* Default or not badge */}

                <div className="flex items-center">
                  <StatusBadge
                    color={item?.status === "verified" ? "green" : "yellow"}
                    className="mr-2"
                  >
                    {item?.status === "pending"
                      ? "Verification Pending"
                      : changeStatusDisplayFormat(item.status)}
                  </StatusBadge>
                </div>
                {item?.status === "pending" && (
                  <div className="mt-2 text-base text-[#545454]">
                    You will receive two small amounts in your account within
                    1-2 business days, (by{" "}
                    {moment(item.date_created).format("dddd, MMMM d")}). Enter
                    those amounts to complete verification.
                  </div>
                )}
                {/* Account details */}
                <table className="mt-1 border-separate border-spacing-y-2 table-fixed">
                  <tbody>
                    <tr className="text-base font-normal">
                      <td>
                        <span className="text-[#545454]">
                          Name on Account: &nbsp;
                        </span>
                      </td>
                      <td className="capitalize">
                        {item?.account_holder_name}
                      </td>
                    </tr>
                    <tr className="text-base font-normal">
                      <td>
                        <span className="text-[#545454]">
                          Account Type: &nbsp;
                        </span>
                      </td>
                      <td className="capitalize">
                        {item?.account_holder_type === "individual"
                          ? "Individual"
                          : "Business"}
                      </td>
                    </tr>
                    <tr className="text-base font-normal">
                      <td>
                        <span className="text-[#545454]">
                          Account Number: &nbsp;
                        </span>
                      </td>
                      <td>{formatingAccountNumber(item?.last_4_digit)}</td>
                    </tr>
                    {item?.routing_number && (
                      <tr className="text-base font-normal">
                        <td>
                          <span className="text-[#545454]">
                            Routing Number: &nbsp;
                          </span>
                        </td>
                        <td>{formatRoutingNumber(item?.routing_number)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {item?.status == "pending" && (
                  <CustomButton
                    text="Verify"
                    className="px-[2rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal rounded-full bg-primary text-[18px]"
                    onClick={openVerifyAccountModal(
                      item?.stripe_bank_account_id
                    )}
                  />
                )}
              </div>
              <div
                onClick={onDelete(item?.user_bank_id)}
                className={`cursor-pointer ${
                  item?.user_bank_id == selectedId ? "opacity-40" : ""
                }`}
              >
                <TrashIcon />
              </div>
            </div>
          ))}
      </div>

      {!showAddCardForm && (
        <div className="flex justify-center mt-4 bg-[#f8f8f8] p-4 text-[#333] text-center">
          Please note that our bank account payment processing system is
          currently undergoing maintenance. During this time, we kindly request
          that you use your credit card for any payments.
        </div>
      )}

      {/* Verify Bank Account Modal */}

      <VerifyBankAccount
        show={showVerifyModal?.show}
        onClose={closeVerifyAccountModal}
        bankAccountId={showVerifyModal?.bankAccountId}
        onUpdate={onBankAccountVerified}
      />

      {/* Add Card form */}
      {showAddCardForm && (
        <AddBankAccount
          userCountry={userCountry}
          onCancel={toggleAddCardForm}
          onBankAccountAdded={onBankAccountAdded}
        />
      )}
    </div>
  );
};

export default BankAccounts;
