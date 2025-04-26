import Checkbox from "@/components/forms/FilterCheckBox2";
import HourlyRateFilter from "./hourly-rate-filter";
import FixedBudgetFilter from "./fixed-budget-filter";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const JobTypeFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const onSelectItem = (item: string) => {
    const selectedJobType = filters.job_type || [];
    if (selectedJobType.includes(item)) {
      selectedJobType.splice(selectedJobType.indexOf(item), 1);
    } else {
      selectedJobType.push(item);
    }
    updateFilterHandler("job_type", selectedJobType);

    if (!selectedJobType.includes("hourly") && filters.hourly_rate.length > 0) {
      updateFilterHandler("hourly_rate", []);
    }

    if (!selectedJobType.includes("fixed") && filters.fixed_budget.length > 0) {
      updateFilterHandler("fixed_budget", []);
    }
  };

  return (
    <div>
      <div className="filter__checkbox__row flex items-center">
        <Checkbox
          checked={filters?.job_type?.includes("hourly")}
          toggle={() => onSelectItem("hourly")}
        />
        <div className=" fs-1rem fw-400">Hourly</div>
      </div>
      {filters?.job_type?.includes("hourly") && <HourlyRateFilter />}

      <div className="filter__checkbox__row flex items-center">
        <Checkbox
          checked={filters?.job_type?.includes("fixed")}
          toggle={() => onSelectItem("fixed")}
        />
        <div className=" fs-1rem fw-400">Project-Based</div>
      </div>
      {filters?.job_type?.includes("fixed") && <FixedBudgetFilter />}
    </div>
  );
};

export default JobTypeFilter;
