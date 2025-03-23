import { useState, useEffect } from "react";
import styled from "styled-components";
import { StyledButton } from "@/components/forms/Buttons";
import PaymentSummary from "./PaymentSummary";
import { transition } from "@/styles/transitions";
import { Row, Col, Container } from "react-bootstrap";
import { usePayments } from "@/pages/client-job-details-page/controllers/usePayments";
import toast from "react-hot-toast";

const CardsWrapper = styled.div`
  .listing {
    max-height: 300px;
    overflow-y: auto;
  }
  .card-item {
    border: 1px solid ${(props) => props.theme.colors.gray6};
    border-radius: 10px;
    padding: 1.25rem;
    ${() => transition()};
  }
  .selected {
    border: 2px solid ${(props) => props.theme.font.color.heading};
  }
  .payment-text {
    color: #404040;
  }
  .light-text {
    opacity: 0.7;
  }
`;

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
    }
    onPay(selectedCardId);
  };

  return (
    <CardsWrapper>
      <div className="fs-20 font-normal mt-3">Select Card</div>
      <Container className="listing">
        {cards?.map((item: any) => (
          <Row
            key={item?.user_card_id}
            className={`card-item mt-3 pointer ${
              item?.stripe_card_id == selectedCardId ? "selected" : ""
            }`}
            onClick={onSelectCard(item?.stripe_card_id)}
          >
            <Col md={8} xs={8}>
              <div className="payment-text light-text fs-sm fw-300">
                CARD NUMBER
              </div>
              <div className="payment-text fs-1rem font-normal mt-1">
                xxxx xxxx xxxx {item?.last_4_digit}
              </div>
            </Col>
            <Col md={4} xs={4}>
              <div className="payment-text light-text fs-sm fw-300">EXP</div>
              <div className="payment-text fs-1rem font-normal mt-1">
                {item?.exp_date}
              </div>
            </Col>
          </Row>
        ))}
      </Container>

      <PaymentSummary />

      <div className="flex justify-center">
        <StyledButton
          disabled={processingPayment}
          onClick={onContinuePaying}
          className="mt-3 w-100"
        >
          {jobType === "hourly" ? "Pay" : "Deposit Milestone Payment"}
        </StyledButton>
      </div>
    </CardsWrapper>
  );
};

export default SavedCards;
