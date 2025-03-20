/*
 * This is the Hourly rate filter
 */

import { Form } from "react-bootstrap";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const HourlyRateFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const onSelectItem = (value) => {
    let updatedHourlyFilter;

    if (filters.hourly_rate.includes(value)) {
      updatedHourlyFilter = filters.hourly_rate.filter(
        (rate) => rate !== value
      );
    } else {
      updatedHourlyFilter = [...filters.hourly_rate, value];
    }

    updateFilterHandler("hourly_rate", updatedHourlyFilter);
  };

  return (
    <div className="mx-4">
      <div className="filter__checkbox__row flex items-center">
        <Form.Check
          inline
          label="$1 - $25/hour"
          name="hourly_budget_type"
          type="checkbox"
          value="1-25"
          id="c_card_1_25"
          onChange={(e) => onSelectItem(e.target.value)}
          checked={filters.hourly_rate.includes("1-25")}
          className="d-inline-flex items-center g-1 me-2"
        />
      </div>
      <div className="filter__checkbox__row flex items-center">
        <Form.Check
          inline
          label="$25 - $100/hour"
          name="hourly_budget_type"
          type="checkbox"
          value="25-100"
          id="c_card_25_100"
          onChange={(e) => onSelectItem(e.target.value)}
          checked={filters.hourly_rate.includes("25-100")}
          className="d-inline-flex items-center g-1 me-2"
        />
      </div>
      <div className="filter__checkbox__row flex items-center">
        <Form.Check
          inline
          label="$100+/hour"
          name="hourly_budget_type"
          type="checkbox"
          value="100-999"
          id="c_card_100_999"
          onChange={(e) => onSelectItem(e.target.value)}
          checked={filters.hourly_rate.includes("100-999")}
          className="d-inline-flex items-center g-1 me-2"
        />
      </div>
    </div>
  );
};

export default HourlyRateFilter;
