/*
 * This will display filters and list of Jobs / Talents
 */
"use client";
import { useMemo, useState } from "react";
import styled from "styled-components";
import Loader from "@/components/Loader";
import NoDataFound from "@/components/ui/NoDataFound";
import PaginationComponent from "@/components/ui/Pagination";
import JobCard from "./job-card";
import TalentCard from "./talent-card";
import SelectedFilters from "./selected-filters";
import Filters from "./filters/Filters";
import MobileFilterModal from "./filters/MobileFilterModal";
import useResponsive from "@/helpers/hooks/useResponsive";
import { useSearchFilters } from "@/helpers/contexts/search-filter-context";

const Wrapper = styled.div`
  background: ${(props) => props.theme.colors.white};
  padding: 5rem 0rem;
  gap: 30px;
  .search-result-text {
    line-height: 1.8rem;
    letter-spacing: -0.02em;
  }
  .search-result-container {
    max-width: 870px;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
  .mobile-filter-btn {
    position: fixed;
    bottom: 0;
    z-index: +1;
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.2);
    background: ${(props) => props.theme.colors.white};
    border-radius: 12px 12px 0px 0px;
  }
`;

export default function FiltersAndListings({
  data,
  loading,
  searchTerm,
  totalResult,
  currentPage,
  onPageChanged,
  searchType,
}: {
  data?: any;
  loading: boolean;
  searchTerm: string;
  totalResult: number;
  currentPage: number;
  onPageChanged: (page: any) => void;
  searchType?: string;
}) {
  const { isDesktop, isLaptop } = useResponsive();

  const { isFilterApplied, modalOpen } = useSearchFilters();

  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const toggleFilterModal = () => {
    // This will toggle the filter modal for mobile view
    setShowFilterModal(!showFilterModal);
  };

  const RECORDS_PER_PAGE = 10; // Per page 10 records will be displayed

  // Calculating total pages based on the number of records and records per page
  const totalPages = useMemo<number>(
    () => Math.ceil(totalResult / RECORDS_PER_PAGE),
    [totalResult]
  );

  return (
    <Wrapper className="content d-flex justify-content-center">
      {/* Filters */}

      {/* Filters in Desktop */}
      {isDesktop && !isLaptop && <Filters />}

      {/* Filter button in Mobile sticky at bottom */}
      {(!isDesktop || isLaptop) && (
        <div
          className="mobile-filter-btn w-100 d-flex align-items-center justify-content-center p-3 pointer"
          onClick={toggleFilterModal}
        >
          Filters
        </div>
      )}

      {/* Lisings */}
      <div className="search-result-container w-100">
        {!loading && searchTerm !== "" && (
          <div className="search-result-text fs-24 fw-400 mb-4">
            {searchTerm ? (
              <>
                ‘{totalResult}’ results found for ‘{searchTerm}’
              </>
            ) : (
              <>‘{totalResult}’ results found</>
            )}
          </div>
        )}

        {/* Selected Filters */}
        {isFilterApplied && <SelectedFilters />}

        {/* Listings */}
        {loading ? (
          <div className="search-result-container w-100 justify-content-center">
            <Loader />
          </div>
        ) : data?.length > 0 ? (
          <>
            <div className="search-work__list">
              {data?.map((item: any, index: number) =>
                searchType == "freelancers" ? (
                  <TalentCard key={item.user_id} data={item} />
                ) : (
                  <JobCard
                    index={index}
                    key={item.job_post_id}
                    workDetails={item}
                  />
                )
              )}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="d-flex align-items-center justify-content-center">
                <PaginationComponent
                  total={totalPages}
                  onPageChange={onPageChanged}
                  currentPage={currentPage}
                />
              </div>
            )}
          </>
        ) : (
          <NoDataFound
            title={
              searchType == "freelancers"
                ? "No matching freelancers found!"
                : ""
            }
          />
        )}
      </div>

      {/* Mobile filter */}
      <MobileFilterModal
        isSkillAndCategoryModalOpen={!!modalOpen}
        show={showFilterModal}
        onClose={toggleFilterModal}
      />
    </Wrapper>
  );
}
