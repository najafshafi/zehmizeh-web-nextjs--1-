/*
 * This is the Fixed Budget filter
 */

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
        <label
          htmlFor="c_card_1_100"
          className="inline-flex items-center gap-1 mr-2 cursor-pointer"
        >
          <input
            type="checkbox"
            id="c_card_1_100"
            name="fixed_budget_type"
            value="1-100"
            onChange={(e) => onSelectItem(e.target.value)}
            checked={filters.fixed_budget.includes("1-100")}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span>$1 - $100</span>
        </label>
      </div>
      <div className="filter__checkbox__row flex items-center">
        <label
          htmlFor="c_card_100_1000"
          className="inline-flex items-center gap-1 mr-2 cursor-pointer"
        >
          <input
            type="checkbox"
            id="c_card_100_1000"
            name="fixed_budget_type"
            value="100-1000"
            onChange={(e) => onSelectItem(e.target.value)}
            checked={filters.fixed_budget.includes("100-1000")}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span>$100 - $1000</span>
        </label>
      </div>
      <div className="filter__checkbox__row flex items-center">
        <label
          htmlFor="c_card_1000_99999"
          className="inline-flex items-center gap-1 mr-2 cursor-pointer"
        >
          <input
            type="checkbox"
            id="c_card_1000_99999"
            name="fixed_budget_type"
            value="1000-99999"
            onChange={(e) => onSelectItem(e.target.value)}
            checked={filters.fixed_budget.includes("1000-99999")}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span>$1000+</span>
        </label>
      </div>
    </div>
  );
};

export default FixedBudgetFilter;
