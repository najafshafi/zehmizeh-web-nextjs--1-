/*
 * This will display the selected filters on top of the listings
 */

import styled from "styled-components";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";
import CrossIcon from "@/public/icons/cross-black.svg";
import { RATINGS_FILTER_ENUM } from "@/helpers/const/constants";
const FilterChip = styled.div`
  background: #f6f6f6;
  padding: 0.75rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid #d9d9d9;
  gap: 10px;
  text-transform: capitalize;
`;

export default function SelectedFilters() {
  const { filters, updateFilterHandler } = useSearchFilters();

  const textForUI = (text: string) => {
    if (text === "fixed") return "Project-Based";
    return text;
  };

  const filterResults = (item: string, field: string) => () => {
    const selected = filters[field];

    if (selected.includes(item)) {
      selected.splice(selected.indexOf(item), 1);
    } else {
      selected.push(item);
    }

    updateFilterHandler(field, selected);

    if (field === "job_type" && !selected.includes("hourly")) {
      filters?.hourly_rate?.forEach((hourly_rate, index) => {
        setTimeout(() => {
          filterResults(hourly_rate, "hourly_rate")();
        }, 1 + index);
      });
    }
  };

  const hourlyRateHandler = (flag) => {
    const payload: any = {};
    if (flag) payload.isNAChecked = true;
    updateFilterHandler("hourly_rate", payload);
  };

  return (
    <div className="my-4 g-2 flex flex-wrap">
      {filters?.job_status &&
        filters?.job_status?.map((status: string) => (
          <FilterChip className="filter-chip flex items-center" key={status}>
            Job Type: {status === "prospects" ? "Open" : status}
            <CrossIcon
              className="pointer"
              onClick={filterResults(status, "job_status")}
            />
          </FilterChip>
        ))}
      {filters?.languages &&
        filters?.languages?.map((language: string) => (
          <FilterChip className="filter-chip flex items-center" key={language}>
            {language.split("#")[0]}
            <CrossIcon
              className="pointer"
              onClick={filterResults(language, "languages")}
            />
          </FilterChip>
        ))}
      {filters?.location &&
        filters?.location?.map((location: string) => (
          <FilterChip className="filter-chip flex items-center" key={location}>
            Location: {location}
            <CrossIcon
              className="pointer"
              onClick={filterResults(location, "location")}
            />
          </FilterChip>
        ))}
      {filters?.categories &&
        filters?.categories?.map((category: string) => (
          <FilterChip className="filter-chip flex items-center" key={category}>
            {category.split("#")[0]}
            <CrossIcon
              className="pointer"
              onClick={filterResults(category, "categories")}
            />
          </FilterChip>
        ))}
      {filters?.skills &&
        filters?.skills?.map((skill: string) => (
          <FilterChip className="filter-chip flex items-center" key={skill}>
            {skill.split("#")[0]}
            <CrossIcon
              className="pointer"
              onClick={filterResults(skill, "skills")}
            />
          </FilterChip>
        ))}
      {filters?.job_type &&
        filters?.job_type?.map((jobTypeItem: string) => (
          <FilterChip
            className="filter-chip flex items-center"
            key={jobTypeItem}
          >
            Project Type: {textForUI(jobTypeItem)}
            <CrossIcon
              className="pointer"
              onClick={filterResults(jobTypeItem, "job_type")}
            />
          </FilterChip>
        ))}

      {Array.isArray(filters?.hourly_rate) &&
        filters?.hourly_rate?.map((hourly_rate: string) => (
          <FilterChip
            className="filter-chip flex items-center"
            key={hourly_rate}
          >
            Hourly Rate: {hourly_rate}
            <CrossIcon
              className="pointer"
              onClick={filterResults(hourly_rate, "hourly_rate")}
            />
          </FilterChip>
        ))}

      {Array.isArray(filters?.fixed_budget) &&
        filters?.fixed_budget?.map((fixed_budget: string) => (
          <FilterChip
            className="filter-chip flex items-center"
            key={fixed_budget}
          >
            Fix Budget: {fixed_budget}
            <CrossIcon
              className="pointer"
              onClick={filterResults(fixed_budget, "fixed_budget")}
            />
          </FilterChip>
        ))}

      {filters?.account_type &&
        filters?.account_type?.map((talentTypeItem: string) => (
          <FilterChip
            className="filter-chip flex items-center"
            key={talentTypeItem}
          >
            Account Type: {talentTypeItem}
            <CrossIcon
              className="pointer"
              onClick={filterResults(talentTypeItem, "account_type")}
            />
          </FilterChip>
        ))}
      {filters?.freelancerFilters &&
        filters?.freelancerFilters?.map((freelancer: string) => (
          <FilterChip
            className="filter-chip flex items-center"
            key={freelancer}
          >
            My Freelancer: {freelancer}
            <CrossIcon
              className="pointer"
              onClick={filterResults(freelancer, "freelancerFilters")}
            />
          </FilterChip>
        ))}
      {filters?.rating &&
        filters?.rating?.map((rating: string) => (
          <FilterChip className="filter-chip flex items-center" key={rating}>
            Rating: {RATINGS_FILTER_ENUM[rating]}
            <CrossIcon
              className="pointer"
              onClick={filterResults(rating, "rating")}
            />
          </FilterChip>
        ))}

      {filters?.hourly_rate && !Array.isArray(filters?.hourly_rate) && (
        <>
          {(filters?.hourly_rate?.min || filters?.hourly_rate?.max) && (
            <FilterChip className="filter-chip flex items-center">
              Hourly rate: ${filters?.hourly_rate?.min ?? 0} - $
              {filters?.hourly_rate?.max ?? 0}
              <CrossIcon
                className="pointer"
                onClick={() =>
                  hourlyRateHandler(filters?.hourly_rate?.isNAChecked)
                }
              />
            </FilterChip>
          )}

          {filters?.hourly_rate?.isNAChecked && (
            <FilterChip className="filter-chip flex items-center">
              NA Checked
              <CrossIcon
                className="pointer"
                onClick={() =>
                  updateFilterHandler("hourly_rate", {
                    ...filters?.hourly_rate,
                    isNAChecked: false,
                  })
                }
              />
            </FilterChip>
          )}
        </>
      )}
    </div>
  );
}
