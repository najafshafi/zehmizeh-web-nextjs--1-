/*
 * This is the Hourly rate filter
 */

import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const HourlyRateFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const onSelectItem = (value: string) => {
    let updatedHourlyFilter;

    if (filters.hourly_rate.includes(value)) {
      updatedHourlyFilter = filters.hourly_rate.filter(
        (rate: string) => rate !== value
      );
    } else {
      updatedHourlyFilter = [...filters.hourly_rate, value];
    }

    updateFilterHandler("hourly_rate", updatedHourlyFilter);
  };

  return (
    <div className="mx-4">
      <div className="filter__checkbox__row flex items-center">
        <label
          htmlFor="c_card_1_25"
          className="inline-flex items-center gap-1 mr-2 cursor-pointer"
        >
          <input
            type="checkbox"
            id="c_card_1_25"
            name="hourly_budget_type"
            value="1-25"
            onChange={(e) => onSelectItem(e.target.value)}
            checked={filters.hourly_rate.includes("1-25")}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span>$1 - $25/hour</span>
        </label>
      </div>
      <div className="filter__checkbox__row flex items-center">
        <label
          htmlFor="c_card_25_100"
          className="inline-flex items-center gap-1 mr-2 cursor-pointer"
        >
          <input
            type="checkbox"
            id="c_card_25_100"
            name="hourly_budget_type"
            value="25-100"
            onChange={(e) => onSelectItem(e.target.value)}
            checked={filters.hourly_rate.includes("25-100")}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span>$25 - $100/hour</span>
        </label>
      </div>
      <div className="filter__checkbox__row flex items-center">
        <label
          htmlFor="c_card_100_999"
          className="inline-flex items-center gap-1 mr-2 cursor-pointer"
        >
          <input
            type="checkbox"
            id="c_card_100_999"
            name="hourly_budget_type"
            value="100-999"
            onChange={(e) => onSelectItem(e.target.value)}
            checked={filters.hourly_rate.includes("100-999")}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span>$100+/hour</span>
        </label>
      </div>
    </div>
  );
};

export default HourlyRateFilter;
