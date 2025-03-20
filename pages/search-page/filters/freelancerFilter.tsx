/*
 * This is the ...Talent Type... filter
 */
import Checkbox from "@/components/forms/FilterCheckBox2";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const FreelancerFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const onSelectItem = (item: string) => {
    const selectedJobType = filters.freelancerFilters || [];
    if (selectedJobType?.includes(item)) {
      selectedJobType.splice(selectedJobType.indexOf(item), 1);
    } else {
      selectedJobType.push(item);
    }
    updateFilterHandler("freelancerFilters", selectedJobType);
  };
  console.log(
    "filters?.freelancerFilters?.includes",
    filters?.freelancerFilters
  );
  return (
    <div>
      <div className="filter__checkbox__row flex items-center">
        <Checkbox
          checked={filters?.freelancerFilters?.includes("savedFreelancers")}
          toggle={() => onSelectItem("savedFreelancers")}
        />{" "}
        <div className="checkbox-label fs-1rem fw-400">
          My Saved Freelancers
        </div>
      </div>
      <div className="filter__checkbox__row flex items-center">
        <Checkbox
          checked={filters?.freelancerFilters?.includes("invitedFreelancers")}
          toggle={() => onSelectItem("invitedFreelancers")}
        />{" "}
        <div className="checkbox-label fs-1rem fw-400">
          My Invited Freelancers
        </div>
      </div>
      <div className="filter__checkbox__row flex items-center">
        <Checkbox
          checked={filters?.freelancerFilters?.includes("proposalFreelancers")}
          toggle={() => onSelectItem("proposalFreelancers")}
        />{" "}
        <div className="checkbox-label fs-1rem fw-400">
          Sent Proposals to Me
        </div>
      </div>
      <div className="filter__checkbox__row flex items-center">
        <Checkbox
          checked={filters?.freelancerFilters?.includes("workingFreelancers")}
          toggle={() => onSelectItem("workingFreelancers")}
        />{" "}
        <div className="checkbox-label fs-1rem fw-400">
          Freelancers I Worked With
        </div>
      </div>
    </div>
  );
};

export default FreelancerFilter;
