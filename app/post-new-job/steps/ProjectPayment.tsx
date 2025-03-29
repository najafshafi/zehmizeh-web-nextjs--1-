import { BudgetSliderWrapper } from "@/components/styled/budgetSlider";
import { usePostJobContext } from "../context";
import { FooterButtons } from "../partials/FooterButtons";
import { FormLabel, FormLabelSubText, PostForm } from "../postJob.styled";
import { OptionButton } from "@/components/forms/OptionButton";
import { Form } from "react-bootstrap";
import Radio from "@/components/forms/Radio";
import ErrorMessage from "@/components/ui/ErrorMessage";

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

const BudgetField = (props: { label: string; fieldKey: string }) => {
  const { label, fieldKey } = props;

  const { formData, setFormData, errors } = usePostJobContext();

  const isValidNumber = (e) => {
    const re = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === "" || (re.test(value) && value > 0)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <div className="mb-2">{label}</div>
      <span className="input-symbol-euro">
        <Form.Control
          value={Number(formData?.budget?.[fieldKey]) || ""}
          onChange={(e) => {
            if (isValidNumber(e))
              setFormData({
                budget: {
                  ...formData.budget,
                  [fieldKey]: Number(e.target.value),
                  isProposal: false,
                },
              });
          }}
          className="budget-input"
          maxLength={5}
        />
      </span>
      {typeof errors?.budget?.[fieldKey] === "string" &&
        errors?.budget?.[fieldKey] && (
          <ErrorMessage message={errors?.budget?.[fieldKey] || ""} />
        )}
    </div>
  );
};

export const ProjectPayment = () => {
  const { formData, setFormData } = usePostJobContext();

  const onProposalChange = (flag: boolean) => {
    if (!flag) {
      // Not a proposal. It'll take min and max amount
      const newBudget = { ...formData.budget, isProposal: flag };
      setFormData({ budget: newBudget });
    } else {
      // It is a proposal
      const updatedBudget = { ...formData.budget };
      if (formData.budget.type == "hourly") {
        delete updatedBudget.amount;
        updatedBudget.min_amount = 1;
        updatedBudget.max_amount = 1;
        updatedBudget.isProposal = flag;
      }
      if (formData.budget.type == "fixed") {
        delete updatedBudget.min_amount;
        delete updatedBudget.max_amount;
        updatedBudget.amount = 1;
        updatedBudget.isProposal = flag;
      }
      setFormData({ budget: updatedBudget });
    }
  };

  const onProjectStructureChange = (type: typeof formData.budget.type) => {
    const updatedBudget = { ...formData.budget };
    updatedBudget.type = type;
    if (type == "hourly") {
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
    <PostForm>
      {formData?.budget &&
        typeof formData?.budget === "object" &&
        !!Object.keys(formData?.budget)?.length && (
          <BudgetSliderWrapper>
            {/* START ----------------------------------------- Payment structure */}
            <div className="form-group">
              <div>
                <FormLabel className="text-left">
                  Payment Structure<span className="mandatory">&nbsp;*</span>
                </FormLabel>
                <FormLabelSubText>
                  If you would like to pay for{" "}
                  <b>the completion of the project</b>, select a "Project-Based"
                  structure. If you would like to pay according to the{" "}
                  <b>time spent on the project</b>, select "Hourly.
                </FormLabelSubText>
              </div>

              <div className="d-flex align-items-center g-2 mt-3">
                {BUDGET_TYPES.map((item) => (
                  <div key={item.id} className="d-flex align-items-center g-1">
                    <OptionButton
                      selected={formData.budget.type === item.id}
                      key={item.id}
                      onClick={() => onProjectStructureChange(item.id)}
                      margin="0"
                      padding="1rem 1rem"
                    >
                      {item.label}
                    </OptionButton>
                  </div>
                ))}
              </div>
            </div>
            {/* END ------------------------------------------- Payment structure */}

            {/* START ----------------------------------------- Approximate Rate */}
            <div className="form-group">
              <div className="d-flex justify-content-start budget-options flex-wrap gap-3 mt-3">
                <div className="d-flex align-items-center gap-1">
                  {formData.budget.type === "fixed" ? (
                    <div>
                      <FormLabel>Approximate Budget (Optional)</FormLabel>
                      <FormLabelSubText>
                        If you choose not to post an approximate budget, this
                        section of your post will say "Open to Proposals."
                      </FormLabelSubText>
                    </div>
                  ) : (
                    <div>
                      <FormLabel>Approximate Rate (Optional)</FormLabel>
                      <FormLabelSubText>
                        If you choose not to post an approximate rate, this
                        section of your post will say "Open to Proposals."
                      </FormLabelSubText>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex gap-3 checkbox-class">
                <Radio
                  value="yes"
                  checked={!formData.budget.isProposal}
                  toggle={() => onProposalChange(false)}
                  label="&nbsp;Yes"
                  className="d-flex align-items-center"
                />
                <Radio
                  checked={!!formData.budget.isProposal}
                  toggle={() => onProposalChange(true)}
                  label="&nbsp;No"
                  value="no"
                  className="d-flex align-items-center"
                />
              </div>
            </div>
            {/* END ------------------------------------------- Approximate Rate */}

            {/* START ----------------------------------------- Amount */}
            <div className="form-group">
              {formData.budget.type == "fixed" &&
                !formData?.budget?.isProposal && (
                  <div className="mt-3 w-100">
                    <span className="fw-bold">
                      If you'd rather post a single budget instead of a range,
                      put the same number in each box.
                    </span>
                    <div className="d-flex flex-row mt-2 gap-4">
                      {/* START ----------------------------------------- Min budget fixed */}
                      <BudgetField label="Min. Budget" fieldKey="min_amount" />
                      {/* END ------------------------------------------- Min budget fixed */}

                      {/* START ----------------------------------------- Max budget fixed */}
                      <BudgetField label="Max. Budget" fieldKey="max_amount" />
                      {/* END ------------------------------------------- Max budget fixed */}
                    </div>
                  </div>
                )}

              {formData.budget.type == "hourly" &&
                !formData.budget?.isProposal && (
                  <div className="mt-3">
                    <span className="fw-bold">
                      If you'd rather post a single rate instead of a range, put
                      the same number in each box.
                    </span>
                    <div className="d-flex flex-row w-100 mt-3 gap-4">
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
          </BudgetSliderWrapper>
        )}
      <FooterButtons />
    </PostForm>
  );
};
