"use client"; // Ensure this is a client component
import { useState } from "react";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/styled/Badges";
import MoreButton from "./MoreButton";
import { managePayment } from "@/helpers/http/freelancer";
import styled from "styled-components";
import {
  formatRoutingNumber,
  formatingAccountNumber,
} from "@/helpers/utils/helper";

const StyledBankItem = styled.div`
  border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
  border-radius: 0.875rem;
  .bank-table {
    border-collapse: separate;
    border-spacing: 0 0.5rem;
    table-layout: fixed;
  }
`;

const BankAccount = ({
  item,
  refetch,
}: {
  item: any;
  country: string;
  refetch: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onDelete = () => {
    /*
     * This function will delete the selected bank account
     */
    setLoading(true);

    const body = {
      action: "delete_account",
      delete_id: item?.user_bank_id,
    };

    // API call to delete an account
    const promise = managePayment(body);

    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        refetch();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onMakeDefault = () => {
    /*
     * This function will make the selected bank account as default one
     */
    setLoading(true);

    const body = {
      action: "edit_account",
      account_id: item?.user_bank_id,
    };

    // API call to make the account as the default account
    const promise = managePayment(body);

    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        refetch();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  return (
    <StyledBankItem
      className="flex justify-content-between mb-2 gap-2 p-4"
      key={item?.user_bank_id}
    >
      <div>
        {/* Default or not badge */}
        {item?.is_default ? (
          <div className="mb-3">
            <StatusBadge color="blue">Default</StatusBadge>
          </div>
        ) : null}

        {/* Account details */}
        <table className="mt-3 bank-table">
          <tr className="fs-1rem font-normal">
            <td>
              <span className="acc-info--label">Name on Account: &nbsp;</span>
            </td>
            <td>{item?.account_holder_name}</td>
          </tr>
          <tr className="fs-1rem font-normal">
            <td>
              <span className="acc-info--label">Account Type: &nbsp;</span>
            </td>
            <td className="capitalize">
              {item?.account_holder_type === "individual"
                ? "Individual"
                : "Business"}
            </td>
          </tr>
          <tr className="fs-1rem font-normal">
            <td>
              <span className="acc-info--label">Account Number: &nbsp;</span>
            </td>
            <td>{formatingAccountNumber(item?.last_4_digit)}</td>
          </tr>
          <tr className="fs-1rem font-normal">
            <td>
              <span className="acc-info--label">Routing Number: &nbsp;</span>
            </td>
            <td>{formatRoutingNumber(item?.routing_number)}</td>
          </tr>
        </table>
      </div>

      {/* Default bank account cannot be deleted */}
      {!item?.is_default && (
        <MoreButton
          onDelete={onDelete}
          onMakeDefault={onMakeDefault}
          disabled={loading}
        />
      )}
    </StyledBankItem>
  );
};

export default BankAccount;
