/*
 * This is the main file of all the filters
  Each accordian item here is a different filter
 */
import AccordionView from "@/components/accordion/AccordionView";
import TalentTypeFilter from "./talent-type-filter";
import LanguageFilter from "./language-filter";
import { SkillFilter } from "./skills-filter";
import LocationFilter from "./location-filter";
import RatingsFilter from "./ratings-filter";
import HourlyRateFilter from "./hourly-rate-filter";
import FreelancerFilter from "./freelancerFilter";
import JobTypeFilter from "./job-type-filter/job-type-filter";
import { FilterWrapper } from "./Filters.styled";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";
import { SkillCategoryFilter } from "./skills-category-filter";
import { useAuth } from "@/helpers/contexts/auth-context";
import PortfolioFilter from "./portfolioFilter";
import JobStatusFilter from "./job-status-filter";

type Props = Partial<{
  onApply: () => void;
  showApplyBtn: boolean;
}>;

const Filters = ({ onApply, showApplyBtn }: Props) => {
  const { user } = useAuth();
  const { clearFilters, isFilterApplied } = useSearchFilters();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const searchType = params?.type;

  return (
    <FilterWrapper>
      {/* Filter Header */}

      <div className="filter__header flex items-center justify-between">
        <div className="fs-18 fw-400 filter__header__title">Filters</div>
        <div className="flex items-center">
          {isFilterApplied && (
            <>
              {showApplyBtn && (
                <div
                  onClick={onApply}
                  className="fs-14 fw-400 filter__header__clearbtn pointer me-3"
                >
                  Apply
                </div>
              )}
              <div
                onClick={clearFilters}
                className="fs-14 fw-400 filter__header__clearbtn pointer"
              >
                Clear all
              </div>
            </>
          )}
        </div>
      </div>

      {/* All applicable filter */}
      {searchType == "freelancers" ? (
        <>
          <AccordionView
            title="Skill Categories"
            details={<SkillCategoryFilter />}
          />
          <AccordionView title="Skills" details={<SkillFilter />} />
          {/* START ----------------------------------------- Hiding my freelancers filter when freelancer looking at other freelancers */}
          {user?.user_type !== "freelancer" && (
            <AccordionView
              title="My Freelancers"
              details={<FreelancerFilter />}
            />
          )}
          {/* END ------------------------------------------- Hiding my freelancers filter when freelancer looking at other freelancers */}

          <AccordionView title="Rating" details={<RatingsFilter />} />
          <AccordionView title="Portfolio" details={<PortfolioFilter />} />
          <AccordionView title="Language" details={<LanguageFilter />} />
          <AccordionView title="Location" details={<LocationFilter />} />
          <AccordionView title="Hourly Rate" details={<HourlyRateFilter />} />
          <AccordionView title="Account Type" details={<TalentTypeFilter />} />
        </>
      ) : (
        <>
          <AccordionView
            title="Skills Category"
            details={<SkillCategoryFilter />}
          />
          <AccordionView title="Skills" details={<SkillFilter />} />
          <AccordionView title="Job Status" details={<JobStatusFilter />} />
          <AccordionView title="Budget" details={<JobTypeFilter />} />
          <AccordionView title="Language" details={<LanguageFilter />} />
        </>
      )}
    </FilterWrapper>
  );
};

export default Filters;
