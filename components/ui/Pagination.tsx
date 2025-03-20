// app/components/PaginationComponent.tsx
"use client"; // Mark as client component since it handles state and navigation

import styled from "styled-components";
import ChevronUp from "@/public/icons/chevronUp.svg";

const PaginationWrap = styled.div`
  .pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .previous-next {
    button {
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      position: initial;
      box-shadow: none;
    }
    .btn {
      margin: auto;
      padding: 0;
      border: none;
      transform: rotate(-90deg);
      cursor: pointer;
    }
    .next {
      transform: rotate(90deg);
    }
  }

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 3rem;
      width: 3rem;
      border-radius: 10px;
      border: none;
      line-height: 1.25;
      background-color: #fff;
      margin-right: 10px;
      box-shadow: 0px 4.8px 28.8px rgba(0, 0, 0, 0.08);
      color: #999;
      text-decoration: none;
      cursor: pointer;
    }

    &.active {
      button {
        background-color: #343a40 !important;
        border-color: #343a40;
        color: #fff !important;
      }
    }

    button:hover {
      transition: all 0.2s ease-in-out;
      transform: scale(1.1);
    }
  }
`;

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange: (page: { selected: number }) => void; // Match Jobs.tsx expectation
}

export default function PaginationComponent({
  total,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768; // Simple mobile check

  // Generate page numbers
  const pageRangeDisplayed = isMobile ? 0 : 3;
  const totalPages = total; // Total pages value is already calculated in parent component

  // Determine visible page range
  const getVisiblePages = () => {
    const halfRange = Math.floor(pageRangeDisplayed / 2);
    let start = Math.max(currentPage - halfRange, 1);
    const end = Math.min(start + pageRangeDisplayed - 1, totalPages);

    if (end - start < pageRangeDisplayed - 1) {
      start = Math.max(end - pageRangeDisplayed + 1, 1);
    }

    return { start, end };
  };

  const { start, end } = getVisiblePages();

  const handlePageClick = (page: number) => {
    onPageChange({ selected: page - 1 }); // Subtract 1 to match Jobs.tsx expectation
  };

  return (
    <PaginationWrap>
      <div className="pagination">
        <div className="previous-next">
          <button
            onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
            className="btn"
            disabled={currentPage === 1}
          >
            <ChevronUp />
          </button>
        </div>

        <ul>
          {start > 1 && (
            <>
              <li className={currentPage === 1 ? "active" : ""}>
                <button onClick={() => handlePageClick(1)}>1</button>
              </li>
              {start > 2 && <li className="break-me p-3 ">...</li>}
            </>
          )}

          {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
            (page) => (
              <li key={page} className={currentPage === page ? "active" : ""}>
                <button onClick={() => handlePageClick(page)}>{page}</button>
              </li>
            )
          )}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <li className="break-me p-3">...</li>}
              <li className={currentPage === totalPages ? "active" : ""}>
                <button onClick={() => handlePageClick(totalPages)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}
        </ul>

        <div className="previous-next">
          <button
            onClick={() =>
              handlePageClick(Math.min(currentPage + 1, totalPages))
            }
            className="next btn"
            disabled={currentPage === totalPages}
          >
            <ChevronUp />
          </button>
        </div>
      </div>
    </PaginationWrap>
  );
}
