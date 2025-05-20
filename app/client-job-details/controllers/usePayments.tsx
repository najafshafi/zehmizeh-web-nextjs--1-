"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getPaymentFees } from "@/helpers/http/common";
import { manageMilestoneNew } from "@/helpers/http/jobs";

const PaymentDetailsContxt = React.createContext<any>(null);

// todo: Mudit- To sometimes randomly poayment calculationsm, doesn't show up as per yogesh, right now not able to reproduce this
const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("OTHER");
  const [amount, setAmount] = useState("");
  const [jobType, setJobType] = useState("");

  const { data } = useQuery(["get-payment-fees"], () => getPaymentFees(), {
    keepPreviousData: true,
  });

  const feeStructure = data?.data[0]?.fee_structure;

  const updatePaymentMethod = React.useCallback((method: string) => {
    setSelectedPaymentMethod(method);
  }, []);

  const minFixedCharge = useMemo(() => {
    let minFixedChargeValue = 0;
    if (feeStructure) {
      minFixedChargeValue = feeStructure[selectedPaymentMethod]?.minFixedCharge;
    }
    return minFixedChargeValue;
  }, [feeStructure, selectedPaymentMethod]);

  const minFixedAmount = useMemo(() => {
    let minFixedAmountValue = 0;
    if (feeStructure) {
      minFixedAmountValue = feeStructure[selectedPaymentMethod]?.minFixedAmount;
    }
    return minFixedAmountValue;
  }, [feeStructure, selectedPaymentMethod]);

  const zehMizehCharge = useMemo(() => {
    let zehmizehFees = 0;
    if (feeStructure) {
      const zehmizehFeesPerc = feeStructure[selectedPaymentMethod]?.percentage;
      if (amount) {
        zehmizehFees = (parseFloat(amount) * zehmizehFeesPerc) / 100;
      }
      return zehmizehFees;
    }
  }, [selectedPaymentMethod, amount, feeStructure]);

  const totalPayableAmount = useMemo(() => {
    let totalPayable = 0;
    if (amount) {
      totalPayable = parseFloat(amount) + (zehMizehCharge || 0);
    }
    return totalPayable;
  }, [amount, zehMizehCharge]);

  // Pays amount directly to freelancer without doing escrow
  const payDirectlyToFreelancer = useCallback(
    async (
      milestoneId: string,
      token: string,
      milestone_id_arr: string[] = []
    ): Promise<unknown> => {
      const data = await manageMilestoneNew({
        action: "edit_milestone",
        status: "paid",
        milestone_id: milestoneId,
        payment_method: selectedPaymentMethod,
        token,
        milestone_id_arr,
        is_pay_now: true,
      });
      return data;
    },
    [selectedPaymentMethod]
  );

  const value = React.useMemo(
    () => ({
      selectedPaymentMethod,
      updatePaymentMethod,
      fees: feeStructure ? feeStructure[selectedPaymentMethod]?.percentage : 0,
      amount,
      setAmount,
      zehMizehCharge,
      totalPayableAmount,
      jobType,
      setJobType,
      minFixedCharge,
      minFixedAmount,
      payDirectlyToFreelancer,
    }),
    [
      selectedPaymentMethod,
      updatePaymentMethod,
      feeStructure,
      amount,
      setAmount,
      zehMizehCharge,
      totalPayableAmount,
      jobType,
      setJobType,
      minFixedCharge,
      minFixedAmount,
      payDirectlyToFreelancer,
    ]
  );

  return (
    <PaymentDetailsContxt.Provider value={value}>
      {children}
    </PaymentDetailsContxt.Provider>
  );
};

function usePayments() {
  return React.useContext(PaymentDetailsContxt);
}

export { PaymentProvider, usePayments };
