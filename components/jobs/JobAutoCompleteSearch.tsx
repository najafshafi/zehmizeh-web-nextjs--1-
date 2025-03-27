import { Button } from "react-bootstrap";
import styled from "styled-components";
import { convertToTitleCase } from "@/helpers/utils/misc";
import SearchBox from "@/components/ui/SearchBox";

export const Wrapper = styled.div`
  .overlay {
    position: absolute;
    width: 100%;
    top: 80px;
    z-index: 1;
    background-color: white;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  opacity: 0.1;
  border: 1px solid gray;
  margin: 0.5rem 0rem;
`;

const SearchResults = styled.ul`
  list-style-type: none;
  padding-left: 0;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  li {
    padding: 0.5rem 1rem;
    cursor: pointer;
    :first-child {
      padding-top: 1rem;
    }
    :last-child {
      padding-bottom: 1rem;
    }
  }
  .loadmore-btn {
    text-align: center;
  }
`;

const LoadMoreButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className="bg-primary text-black px-4 py-2 rounded-md"
    >
      Load More
    </Button>
  );
};

const JobAutoCompleteSearch = ({
  jobs,
  filteredJobs,
  onJobClick,
  onSearchValueChange,
  searchValue,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading,
  searchSubmitted,
}: {
  jobs: any;
  filteredJobs: any;
  onJobClick: (id: any) => any;
  onSearchValueChange: (e: any) => void;
  searchValue: string;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  searchSubmitted: boolean;
}) => {
  const onClear = () => {
    onSearchValueChange("");
  };
  return (
    <Wrapper>
      <SearchBox
        placeholder="Search"
        value={searchValue}
        onChange={(e) => onSearchValueChange(e.target.value)}
        isLoading={isLoading}
        id="search-msg-input"
        onClear={onClear}
        maxLength={100}
        enableBorder={false}
        height={72}
      />
      {searchValue !== "" && !searchSubmitted && jobs && jobs.length > 0 && (
        <SearchResults className="overlay">
          {filteredJobs.map((opt, index) => (
            <>
              <li
                key={opt?.job_post_id}
                onClick={onJobClick(opt?.job_post_id)}
                className="capital-first-ltr"
              >
                {convertToTitleCase(opt?.job_title)}
              </li>
              {index != filteredJobs.length - 1 ? <Divider /> : null}
            </>
          ))}
          {jobs.length > 0 && hasNextPage ? (
            <div className="loadmore-btn p-2">
              <LoadMoreButton
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
              />
            </div>
          ) : null}
        </SearchResults>
      )}
    </Wrapper>
  );
};

export default JobAutoCompleteSearch;
