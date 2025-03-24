import { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { StyledButton } from "@/components/forms/Buttons";
import { StatusBadge } from "@/components/styled/Badges";
import NoDataFound from "@/components/ui/NoDataFound";
// import Tooltip from 'components/ui/Tooltip';
import AddBankAccount from "./AddBankAccount";
import VerifyBankAccount from "./VerifyBankAccount";
import { deleteBankAccount } from "@/helpers/http/client";
import { changeStatusDisplayFormat } from "@/helpers/utils/misc";
import TrashIcon from "@/public/icons/trash.svg";
import { formatingAccountNumber } from "@/helpers/utils/helper";
import { formatRoutingNumber } from "@/helpers/utils/helper";
import moment from "moment";
// import { ReactComponent as InfoIcon } from 'assets/icons/info-gray-32.svg';

const Wrapper = styled.div`
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  padding: 2rem;
  min-height: 570px;
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: auto;
  }
  .listings {
    max-height: 400px;
    overflow-y: auto;
  }
  .payment-item {
    border: 1px solid ${(props) => props.theme.colors.gray6};
    border-radius: 10px;
    padding: 1.25rem;
  }
  .acc-info--label {
    color: ${(props) => props.theme.colors.gray8};
  }
`;

const StyledBankItem = styled.div`
  border: 1px solid ${(props) => props.theme.colors.gray6};
  border-radius: 0.875rem;
  .bank-table {
    border-collapse: separate;
    border-spacing: 0 0.5rem;
    table-layout: fixed;
  }
`;

type Props = {
  paymentData: any;
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
    <Wrapper className="m-auto">
      {/* Heading */}
      <div className="title fs-24 fw-400">Bank Account Details</div>
      {!showAddCardForm && paymentData?.length === 0 && (
        <NoDataFound className="py-5" />
      )}
      {/* Saved cards */}
      <div className="listings reduce-pad">
        {paymentData?.length > 0 &&
          paymentData?.map((item: any) => (
            <StyledBankItem
              key={item?.user_bank_id}
              className="d-flex justify-content-between mt-3 gap-2 p-4"
            >
              <div className="flex-1">
                {/* Default or not badge */}

                <div className="d-flex align-items-center">
                  <StatusBadge
                    color={item?.status === "verified" ? "green" : "yellow"}
                    className="me-2"
                  >
                    {item?.status === "pending"
                      ? "Verification Pending"
                      : changeStatusDisplayFormat(item.status)}
                  </StatusBadge>
                </div>
                {item?.status === "pending" && (
                  <div className="mt-2 fs-1rem acc-info--label">
                    You will receive two small amounts in your account within
                    1-2 business days, (by{" "}
                    {moment(item.date_created).format("dddd, MMMM d")}). Enter
                    those amounts to complete verification.
                  </div>
                )}
                {/* Account details */}
                <table className="mt-1 bank-table">
                  <tr className="fs-1rem fw-400">
                    <td>
                      <span className="acc-info--label">
                        Name on Account: &nbsp;
                      </span>
                    </td>
                    <td className="text-capitalize">
                      {item?.account_holder_name}
                    </td>
                  </tr>
                  <tr className="fs-1rem fw-400">
                    <td>
                      <span className="acc-info--label">
                        Account Type: &nbsp;
                      </span>
                    </td>
                    <td className="text-capitalize">
                      {item?.account_holder_type === "individual"
                        ? "Individual"
                        : "Business"}
                    </td>
                  </tr>
                  <tr className="fs-1rem fw-400">
                    <td>
                      <span className="acc-info--label">
                        Account Number: &nbsp;
                      </span>
                    </td>
                    <td>{formatingAccountNumber(item?.last_4_digit)}</td>
                  </tr>
                  {item?.routing_number && (
                    <tr className="fs-1rem fw-400">
                      <td>
                        <span className="acc-info--label">
                          Routing Number: &nbsp;
                        </span>
                      </td>
                      <td>{formatRoutingNumber(item?.routing_number)}</td>
                    </tr>
                  )}
                </table>
                {item?.status == "pending" && (
                  <StyledButton
                    className="mt-3"
                    onClick={openVerifyAccountModal(
                      item?.stripe_bank_account_id
                    )}
                  >
                    Verify
                  </StyledButton>
                )}
              </div>
              <div
                onClick={onDelete(item?.user_bank_id)}
                className={`pointer ${
                  item?.user_bank_id == selectedId ? "opacity-4" : ""
                }`}
              >
                <TrashIcon />
              </div>
            </StyledBankItem>
          ))}
      </div>

      {/*!showAddCardForm && (
        <StyledButton
          className="w-100 mt-3"
          variant="outline-dark"
          onClick={toggleAddCardForm}
        >
          Add Account
        </StyledButton>
      )*/}
      {/* Add card button */}
      {!showAddCardForm && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            background: "#f8f8f8",
            padding: "1rem",
            color: "#333",
            textAlign: "center",
          }}
        >
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
    </Wrapper>
  );
};

export default BankAccounts;
