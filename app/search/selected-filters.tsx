/*
 * This will display the selected filters on top of the listings
 */

import { useSearchFilters } from "@/helpers/contexts/search-filter-context";
import CrossIcon from "@/public/icons/cross-black.svg";
import { RATINGS_FILTER_ENUM } from "@/helpers/const/constants";

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
      filters?.hourly_rate?.forEach((hourly_rate: string, index: number) => {
        setTimeout(() => {
          filterResults(hourly_rate, "hourly_rate")();
        }, 1 + index);
      });
    }
  };

  const hourlyRateHandler = (flag: boolean) => {
    const payload: any = {};
    if (flag) payload.isNAChecked = true;
    updateFilterHandler("hourly_rate", payload);
  };

  return (
    <div className="my-4 g-2 flex flex-wrap">
      {filters?.job_status &&
        filters?.job_status?.map((status: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={status}
          >
            Job Type: {status === "prospects" ? "Open" : status}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(status, "job_status")}
            />
          </div>
        ))}
      {filters?.languages &&
        filters?.languages?.map((language: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={language}
          >
            {language.split("#")[0]}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(language, "languages")}
            />
          </div>
        ))}
      {filters?.location &&
        filters?.location?.map((location: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={location}
          >
            Location: {location}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(location, "location")}
            />
          </div>
        ))}
      {filters?.categories &&
        filters?.categories?.map((category: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={category}
          >
            {category.split("#")[0]}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(category, "categories")}
            />
          </div>
        ))}
      {filters?.skills &&
        filters?.skills?.map((skill: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={skill}
          >
            {skill.split("#")[0]}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(skill, "skills")}
            />
          </div>
        ))}
      {filters?.job_type &&
        filters?.job_type?.map((jobTypeItem: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={jobTypeItem}
          >
            Project Type: {textForUI(jobTypeItem)}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(jobTypeItem, "job_type")}
            />
          </div>
        ))}

      {Array.isArray(filters?.hourly_rate) &&
        filters?.hourly_rate?.map((hourly_rate: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={hourly_rate}
          >
            Hourly Rate: {hourly_rate}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(hourly_rate, "hourly_rate")}
            />
          </div>
        ))}

      {Array.isArray(filters?.fixed_budget) &&
        filters?.fixed_budget?.map((fixed_budget: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={fixed_budget}
          >
            Fix Budget: {fixed_budget}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(fixed_budget, "fixed_budget")}
            />
          </div>
        ))}

      {filters?.account_type &&
        filters?.account_type?.map((talentTypeItem: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={talentTypeItem}
          >
            Account Type: {talentTypeItem}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(talentTypeItem, "account_type")}
            />
          </div>
        ))}
      {filters?.freelancerFilters &&
        filters?.freelancerFilters?.map((freelancer: string) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={freelancer}
          >
            My Freelancer: {freelancer}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(freelancer, "freelancerFilters")}
            />
          </div>
        ))}
      {filters?.rating &&
        filters?.rating?.map((rating: keyof typeof RATINGS_FILTER_ENUM) => (
          <div
            className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center"
            key={rating}
          >
            Rating: {RATINGS_FILTER_ENUM[rating]}
            <CrossIcon
              className="cursor-pointer"
              onClick={filterResults(rating, "rating")}
            />
          </div>
        ))}

      {filters?.hourly_rate && !Array.isArray(filters?.hourly_rate) && (
        <>
          {(filters?.hourly_rate?.min || filters?.hourly_rate?.max) && (
            <div className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center">
              Hourly rate: ${filters?.hourly_rate?.min ?? 0} - $
              {filters?.hourly_rate?.max ?? 0}
              <CrossIcon
                className="cursor-pointer"
                onClick={() =>
                  hourlyRateHandler(filters?.hourly_rate?.isNAChecked)
                }
              />
            </div>
          )}

          {filters?.hourly_rate?.isNAChecked && (
            <div className="bg-[#f6f6f6] px-[0.875rem] py-3 rounded-[0.5rem] border border-[#d9d9d9] gap-2.5 capitalize flex items-center">
              NA Checked
              <CrossIcon
                className="cursor-pointer"
                onClick={() =>
                  updateFilterHandler("hourly_rate", {
                    ...filters?.hourly_rate,
                    isNAChecked: false,
                  })
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
