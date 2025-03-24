import { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { StyledButton } from "@/components/forms/Buttons";
import AddCard from "./AddCard";
import { deleteCard } from "@/helpers/http/client";
import TrashIcon from "@/public/icons/trash.svg";
import NoDataFound from "@/components/ui/NoDataFound";

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
  .payment-text {
    color: #404040;
  }
  .light-text {
    opacity: 0.7;
  }
`;

type Props = {
  paymentData: any;
  refetch: () => void;
  onNewAdded: () => void;
};

const PaymentInfo = ({ paymentData, refetch, onNewAdded }: Props) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [showAddCardForm, setShowAddCardForm] = useState<boolean>(false);

  const toggleAddCardForm = () => {
    /* This will toggle add card form */
    setShowAddCardForm(!showAddCardForm);
  };

  const onDelete = (id: string) => () => {
    /* This function will delete the bank card */

    if (selectedId == "") {
      setSelectedId(id);

      const promise = deleteCard(id);

      /* Delete api call */
      toast.promise(promise, {
        loading: "Loading...",
        success: (res) => {
          /* Once the card is deleted, it will refetch the profile to get the latest cards */
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

  const onCardAdded = () => {
    /* This will close the add card form and refetch the profile details again */
    toggleAddCardForm();
    onNewAdded();
    refetch();
  };

  return (
    <div className="m-auto">
      <Wrapper>
        {/* Heading */}
        <div className="title text-2xl font-normal">Credit Card Details</div>

        {paymentData?.length === 0 && !showAddCardForm && (
          <NoDataFound className="py-5" />
        )}

        {/* Saved cards */}
        <div className="listings">
          {paymentData?.length > 0 &&
            paymentData?.map((item: any) => (
              <div
                className="payment-item flex items-center justify-between mt-3"
                key={item?.user_card_id}
              >
                <div>
                  <div className="payment-text light-text text-sm font-light">
                    CARD NUMBER
                  </div>
                  <div className="payment-text text-base font-normal mt-1">
                    xxxx xxxx xxxx {item?.last_4_digit}
                  </div>
                </div>
                <div>
                  <div className="payment-text light-text text-sm font-light">
                    EXP
                  </div>
                  <div className="payment-text text-base font-normal mt-1">
                    {item?.exp_date}
                  </div>
                </div>
                <div
                  onClick={onDelete(item?.user_card_id)}
                  className={`cursor-pointer ${
                    item?.user_card_id == selectedId ? "opacity-4" : ""
                  }`}
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
        </div>

        {!showAddCardForm && (
          <StyledButton
            className="w-100 mt-3"
            variant="outline-dark"
            onClick={toggleAddCardForm}
          >
            Add Card
          </StyledButton>
        )}

        {/* Add Card form */}
        {showAddCardForm && (
          <AddCard onCancel={toggleAddCardForm} onCardAdded={onCardAdded} />
        )}
      </Wrapper>
    </div>
  );
};

export default PaymentInfo;
