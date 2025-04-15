import { useState } from "react";
import toast from "react-hot-toast";
import AddCard from "./AddCard";
import { deleteCard } from "@/helpers/http/client";
import TrashIcon from "@/public/icons/trash.svg";
import NoDataFound from "@/components/ui/NoDataFound";
import CustomButton from "@/components/custombutton/CustomButton";

type CardData = {
  user_card_id: string;
  last_4_digit: string;
  exp_date: string;
};

type Props = {
  paymentData: CardData[];
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
    <div className="mx-auto">
      <div className="bg-white shadow-[0px_4px_60px_rgba(0,0,0,0.05)] rounded-xl p-8 md:min-h-[570px] md:min-w-[561px] min-h-fit ">
        {/* Heading */}
        <div className="text-2xl font-normal">Credit Card Details</div>

        {paymentData?.length === 0 && !showAddCardForm && (
          <NoDataFound className="py-5" />
        )}

        {/* Saved cards */}
        <div className="max-h-[400px] overflow-y-auto">
          {paymentData?.length > 0 &&
            paymentData?.map((item: CardData) => (
              <div
                className="border border-[#E6E6E6] rounded-[10px] p-5 flex items-center justify-between mt-3"
                key={item?.user_card_id}
              >
                <div>
                  <div className="text-sm font-light text-[#404040] opacity-70">
                    CARD NUMBER
                  </div>
                  <div className="text-base font-normal mt-1 text-[#404040]">
                    xxxx xxxx xxxx {item?.last_4_digit}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-light text-[#404040] opacity-70">
                    EXP
                  </div>
                  <div className="text-base font-normal mt-1 text-[#404040]">
                    {item?.exp_date}
                  </div>
                </div>
                <div
                  onClick={onDelete(item?.user_card_id)}
                  className={`cursor-pointer ${
                    item?.user_card_id == selectedId ? "opacity-40" : ""
                  }`}
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
        </div>

        {!showAddCardForm && (
          <CustomButton
            text="Add Card"
            className={`px-8 py-4 w-full text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white mt-5`}
            onClick={toggleAddCardForm}
          />
        )}

        {/* Add Card form */}
        {showAddCardForm && (
          <AddCard onCancel={toggleAddCardForm} onCardAdded={onCardAdded} />
        )}
      </div>
    </div>
  );
};

export default PaymentInfo;
