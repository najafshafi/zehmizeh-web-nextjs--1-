import { useState, useEffect } from "react";
import PaymentSummary from "./PaymentSummary";
import { usePayments } from "../../controllers/usePayments";
import toast from "react-hot-toast";
import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  cards: any;
  processingPayment?: boolean;
  onPay: (id: string) => void;
};

const SavedCards = ({ cards, processingPayment, onPay }: Props) => {
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const { jobType } = usePayments();

  // Automatically select the first card when component mounts or cards change
  useEffect(() => {
    if (cards?.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].stripe_card_id);
    }
  }, [cards]);

  const onSelectCard = (id: string) => () => {
    setSelectedCardId(id);
  };

  const onContinuePaying = () => {
    if (!selectedCardId) {
      toast.error("Please select a card.");
      return;
    }
    onPay(selectedCardId);
  };

  return (
    <div>
      <div className="fs-20 font-normal mt-3">Select Card</div>
      <div className="max-h-[300px] overflow-y-auto">
        {cards?.map((item: any) => (
          <div
            key={item?.user_card_id}
            className={`flex flex-row mt-3 cursor-pointer transition-all duration-200 ease-in hover:shadow-[0px_8px_36px_rgba(0,0,0,0.16)] hover:-translate-y-[2px] ${
              item?.stripe_card_id == selectedCardId
                ? "border-2 border-[#404040]"
                : "border border-[#d8d8d8]"
            } rounded-[10px] p-5`}
            onClick={onSelectCard(item?.stripe_card_id)}
          >
            <div className="w-2/3">
              <div className="text-[#404040] opacity-70 fs-sm fw-300">
                CARD NUMBER
              </div>
              <div className="text-[#404040] fs-1rem font-normal mt-1">
                xxxx xxxx xxxx {item?.last_4_digit}
              </div>
            </div>
            <div className="w-1/3">
              <div className="text-[#404040] opacity-70 fs-sm fw-300">EXP</div>
              <div className="text-[#404040] fs-1rem font-normal mt-1">
                {item?.exp_date}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PaymentSummary />

      <div className="flex justify-center">
        <CustomButton
          text={jobType === "hourly" ? "Pay" : "Deposit Milestone Payment"}
          className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-3 w-full"
          disabled={processingPayment}
          onClick={onContinuePaying}
        />
      </div>
    </div>
  );
};

export default SavedCards;
