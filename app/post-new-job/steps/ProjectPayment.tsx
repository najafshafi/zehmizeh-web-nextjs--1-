"use client";

import { usePostJobContext } from "../context";
import { FooterButtons } from "../partials/FooterButtons";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Radio from "@/components/forms/Radio";
import React from "react";

// Define proper types for budget
interface BaseBudget {
  isProposal: boolean;
}

interface HourlyBudget extends BaseBudget {
  type: "hourly";
  min_amount?: number;
  max_amount?: number;
  amount?: number;
}

interface FixedBudget extends BaseBudget {
  type: "fixed";
  min_amount?: number;
  max_amount?: number;
  amount?: number;
}

type Budget = HourlyBudget | FixedBudget;

const BUDGET_TYPES = [
  {
    label: "Project-Based",
    id: "fixed",
  },
  {
    label: "Hourly",
    id: "hourly",
  },
] as const;

type BudgetFieldProps = {
  label: string;
  fieldKey: "min_amount" | "max_amount" | "amount";
};

const BudgetField = (props: BudgetFieldProps) => {
  const { label, fieldKey } = props;

  const { formData, setFormData, errors } = usePostJobContext();

  const isValidNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === "" || (re.test(value) && Number(value) > 0)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex-1">
      <div className="mb-2">{label}</div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          $
        </span>
        <input
          type="text"
          value={
            formData?.budget && fieldKey in formData.budget
              ? Number(formData.budget[fieldKey]) || ""
              : ""
          }
          onChange={(e) => {
            if (isValidNumber(e) && formData.budget) {
              setFormData({
                budget: {
                  ...formData.budget,
                  [fieldKey]: Number(e.target.value),
                  isProposal: false,
                } as Budget,
              });
            }
          }}
          className="pl-8 pr-4 py-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={5}
        />
      </div>
      {errors?.budget &&
        typeof errors.budget === "object" &&
        fieldKey in errors.budget &&
        typeof errors.budget[fieldKey] === "string" && (
          <ErrorMessage message={errors.budget[fieldKey] as string} />
        )}
    </div>
  );
};

export const ProjectPayment = () => {
  const { formData, setFormData } = usePostJobContext();

  const onProposalChange = (flag: boolean) => {
    if (!formData.budget) return;

    if (!flag) {
      // Not a proposal. It'll take min and max amount
      const newBudget: Budget = { ...formData.budget, isProposal: flag };
      setFormData({ budget: newBudget });
    } else {
      // It is a proposal
      const updatedBudget = { ...formData.budget } as Budget;
      if (formData.budget.type === "hourly") {
        delete updatedBudget.amount;
        updatedBudget.min_amount = 1;
        updatedBudget.max_amount = 1;
        updatedBudget.isProposal = flag;
      }
      if (formData.budget.type === "fixed") {
        delete updatedBudget.min_amount;
        delete updatedBudget.max_amount;
        updatedBudget.amount = 1;
        updatedBudget.isProposal = flag;
      }
      setFormData({ budget: updatedBudget });
    }
  };

  const onProjectStructureChange = (type: "fixed" | "hourly") => {
    if (!formData.budget) return;

    const updatedBudget = { ...formData.budget } as Budget;
    updatedBudget.type = type;
    if (type === "hourly") {
      delete updatedBudget.amount;
      updatedBudget.min_amount = 0;
      updatedBudget.max_amount = 0;
    } else {
      delete updatedBudget.amount;
      updatedBudget.min_amount = 0;
      updatedBudget.max_amount = 0;
    }
    setFormData({ budget: updatedBudget });
  };

  return (
    <div className="flex flex-col space-y-6">
      {formData?.budget &&
        typeof formData?.budget === "object" &&
        !!Object.keys(formData?.budget)?.length && (
          <div className="w-full">
            {/* START ----------------------------------------- Payment structure */}
            <div className="mb-6">
              <div>
                <label className="block text-base font-bold mb-1 text-left">
                  Payment Structure<span className="text-red-500">&nbsp;*</span>
                </label>
                <span className="block text-sm text-gray-600 mb-2 text-left">
                  If you would like to pay for{" "}
                  <b>the completion of the project</b>, select a
                  &quot;Project-Based&quot; structure. If you would like to pay
                  according to the <b>time spent on the project</b>, select
                  &quot;Hourly.
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                {BUDGET_TYPES.map((item) => (
                  <div key={item.id} className="flex items-center gap-1">
                    <button
                      className={`py-4 px-4 rounded-xl border-2  transition-all duration-200 ${
                        formData.budget?.type === item.id
                          ? "border-2 border-black text-black"
                          : ""
                      }`}
                      type="button"
                      onClick={() => onProjectStructureChange(item.id)}
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* END ------------------------------------------- Payment structure */}

            {/* START ----------------------------------------- Approximate Rate */}
            <div className="mb-6">
              <div className="flex justify-start flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {formData.budget.type === "fixed" ? (
                    <div>
                      <label className="block text-base font-bold mb-1 text-left">
                        Approximate Budget (Optional)
                      </label>
                      <span className="block text-sm text-gray-600 text-left">
                        If you choose not to post an approximate budget, this
                        section of your post will say &quot;Open to
                        Proposals.&quot;
                      </span>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-base font-bold mb-1 text-left">
                        Approximate Rate (Optional)
                      </label>
                      <span className="block text-sm text-gray-600 text-left">
                        If you choose not to post an approximate rate, this
                        section of your post will say &quot;Open to
                        Proposals.&quot;
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <Radio
                  value="yes"
                  checked={!formData.budget.isProposal}
                  toggle={() => onProposalChange(false)}
                  label="&nbsp;Yes"
                  className="flex items-center"
                />
                <Radio
                  checked={!!formData.budget.isProposal}
                  toggle={() => onProposalChange(true)}
                  label="&nbsp;No"
                  value="no"
                  className="flex items-center"
                />
              </div>
            </div>
            {/* END ------------------------------------------- Approximate Rate */}

            {/* START ----------------------------------------- Amount */}
            <div className="mb-6">
              {formData.budget.type === "fixed" &&
                !formData?.budget?.isProposal && (
                  <div className="mt-3 w-full">
                    <span className="font-bold block mb-2 text-left">
                      If you&apos;d rather post a single budget instead of a
                      range, put the same number in each box.
                    </span>
                    <div className="flex flex-row mt-2 gap-5 w-1/2 text-left ">
                      {/* START ----------------------------------------- Min budget fixed */}
                      <BudgetField label="Min. Budget" fieldKey="min_amount" />
                      {/* END ------------------------------------------- Min budget fixed */}

                      {/* START ----------------------------------------- Max budget fixed */}
                      <BudgetField label="Max. Budget" fieldKey="max_amount" />
                      {/* END ------------------------------------------- Max budget fixed */}
                    </div>
                  </div>
                )}

              {formData.budget.type === "hourly" &&
                !formData.budget?.isProposal && (
                  <div className="mt-3">
                    <span className="font-bold block mb-2 text-left">
                      If you&apos;d rather post a single rate instead of a
                      range, put the same number in each box.
                    </span>
                    <div className="flex flex-row  w-1/2 mt-3 gap-5 text-left">
                      {/* START ----------------------------------------- Min Rate Hourly */}
                      <BudgetField label="Min. Rate" fieldKey="min_amount" />
                      {/* END ------------------------------------------- Min Rate Hourly */}

                      {/* START ----------------------------------------- Max Rate Hourly */}
                      <BudgetField label="Max. Rate" fieldKey="max_amount" />
                      {/* END ------------------------------------------- Max Rate Hourly */}
                    </div>
                  </div>
                )}
            </div>
            {/* END ------------------------------------------- Amount */}
          </div>
        )}
      <FooterButtons />
    </div>
  );
};
