/*
 * This is the Fixed Budget filter
 */

import { Form } from "react-bootstrap";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const FixedBudgetFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const onSelectItem = (value: string) => {
    let updatedFixBudgetFilter;

    if (filters.fixed_budget.includes(value)) {
      updatedFixBudgetFilter = filters.fixed_budget.filter(
        (rate: string) => rate !== value
      );
    } else {
      updatedFixBudgetFilter = [...filters.fixed_budget, value];
    }

    updateFilterHandler("fixed_budget", updatedFixBudgetFilter);
  };

  return (
    <div className="mx-4">
      <div className="filter__checkbox__row flex items-center">
        <Form.Check
          inline
          label="$1 - $100"
          name="fixed_budget_type"
          type="checkbox"
          value="1-100"
          id="c_card_1_100"
          onChange={(e) => onSelectItem(e.target.value)}
          checked={filters.fixed_budget.includes("1-100")}
          className="d-inline-flex items-center g-1 me-2"
        />
      </div>
      <div className="filter__checkbox__row flex items-center">
        <Form.Check
          inline
          label="$100 - $1000"
          name="fixed_budget_type"
          type="checkbox"
          value="100-1000"
          id="c_card_100_1000"
          onChange={(e) => onSelectItem(e.target.value)}
          checked={filters.fixed_budget.includes("100-1000")}
          className="d-inline-flex items-center g-1 me-2"
        />
      </div>
      <div className="filter__checkbox__row flex items-center">
        <Form.Check
          inline
          label="$1000+"
          name="fixed_budget_type"
          type="checkbox"
          value="1000-99999"
          id="c_card_1000_99999"
          onChange={(e) => onSelectItem(e.target.value)}
          checked={filters.fixed_budget.includes("1000-99999")}
          className="d-inline-flex items-center g-1 me-2"
        />
      </div>
    </div>
  );
};

export default FixedBudgetFilter;
