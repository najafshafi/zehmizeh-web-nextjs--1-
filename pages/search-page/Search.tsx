/*
 * This is the main component of this route
 */
import { MainContainer } from './Search.styled';
import SearchBox from '@/components/search/SearchBox';
import Banner from './banner';
import FiltersAndListings from './filters-and-listings';
import { useSearchFilters } from '@/helpers/contexts/search-filter-context';
import { ModalAfterPostingProject } from './modals/ModalAfterPostingProject';
const isFreelancerLaunch = false;

export default function Search() {
  const { searchType, data, loading, page, setPage, searchTerm, setSearchTerm } = useSearchFilters();

  const onSearch = (keyword: string) => {
    // This will just set the search keyword in state
    setSearchTerm(keyword);
  };

  return (
    <MainContainer className="d-flex-column justify-content-center content-hfill">
      {/* Search banner */}

      <Banner searchType={searchType}>
        <SearchBox onSubmit={onSearch} searchType={searchType} />
        {isFreelancerLaunch && (
          <div className="info mt-5 text-center fs-20 fw-400">
            ZehMizeh is not currently open for clients to join, which means there’s no one to post any projects for now.
            Clients will officially be invited to the site on <b>December 2022</b>, so mark your calendar and keep your
            eye on this board!
          </div>
        )}
      </Banner>

      {/*
       * Filters and listings: Search results, paginations, selected filters and applying filter
       * will be in this component
       */}
      <FiltersAndListings
        currentPage={page}
        totalResult={data?.total}
        onPageChanged={({ selected }) => {
          setPage(selected + 1);
          window.scrollTo(0, 0);
        }}
        searchTerm={searchTerm}
        data={data?.data}
        loading={loading}
        searchType={searchType}
      />

      {/* START ----------------------------------------- After posting project. Link will have hash value and based on that showing this text */}
      <ModalAfterPostingProject />
      {/* END ------------------------------------------- After posting project. Link will have hash value and based on that showing this text */}
    </MainContainer>
  );
}
