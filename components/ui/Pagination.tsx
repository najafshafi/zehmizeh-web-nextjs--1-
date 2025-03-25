// app/components/PaginationComponent.tsx
"use client"; // Mark as client component since it handles state and navigation

import ChevronUp from "@/public/icons/chevronUp.svg";

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
    <div>
      <div className="pagination w-full min-w-[500px] mx-auto flex flex-wrap items-center gap-2.5 justify-center py-4">
        <div className="previous-next">
          <button
            onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
            className="btn flex justify-center items-center border-none shadow-none"
            disabled={currentPage === 1}
          >
            <ChevronUp />
          </button>
        </div>

        <ul className="flex list-none p-0 m-0">
          {start > 1 && (
            <>
              <li className={currentPage === 1 ? "active" : ""}>
                <button
                  onClick={() => handlePageClick(1)}
                  className="relative flex items-center justify-center h-12 w-12 rounded-[10px] border-none bg-white mr-2.5 shadow-[0px_4.8px_28.8px_rgba(0,0,0,0.08)] text-[#999] hover:scale-110 hover:transition-all hover:duration-200 hover:ease-in-out"
                >
                  1
                </button>
              </li>
              {start > 2 && (
                <li>
                  <button className="relative flex items-center justify-center h-12 w-12 rounded-[10px] border-none bg-white mr-2.5 shadow-[0px_4.8px_28.8px_rgba(0,0,0,0.08)] text-[#999] cursor-default">
                    ...
                  </button>
                </li>
              )}
            </>
          )}

          {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
            (page) => (
              <li key={page} className={currentPage === page ? "active" : ""}>
                <button
                  onClick={() => handlePageClick(page)}
                  className="relative flex items-center justify-center h-12 w-12 rounded-[10px] border-none bg-white mr-2.5 shadow-[0px_4.8px_28.8px_rgba(0,0,0,0.08)] text-[#999] hover:scale-110 hover:transition-all hover:duration-200 hover:ease-in-out"
                >
                  {page}
                </button>
              </li>
            )
          )}

          {end < totalPages - 1 && (
            <>
              <li>
                <button className="relative flex items-center justify-center h-12 w-12 rounded-[10px] border-none bg-white mr-2.5 shadow-[0px_4.8px_28.8px_rgba(0,0,0,0.08)] text-[#999] cursor-default">
                  ...
                </button>
              </li>
              <li className={currentPage === totalPages - 1 ? "active" : ""}>
                <button
                  onClick={() => handlePageClick(totalPages - 1)}
                  className="relative flex items-center justify-center h-12 w-12 rounded-[10px] border-none bg-white mr-2.5 shadow-[0px_4.8px_28.8px_rgba(0,0,0,0.08)] text-[#999] hover:scale-110 hover:transition-all hover:duration-200 hover:ease-in-out"
                >
                  {totalPages - 1}
                </button>
              </li>
              <li className={currentPage === totalPages ? "active" : ""}>
                <button
                  onClick={() => handlePageClick(totalPages)}
                  className="relative flex items-center justify-center h-12 w-12 rounded-[10px] border-none bg-white mr-2.5 shadow-[0px_4.8px_28.8px_rgba(0,0,0,0.08)] text-[#999] hover:scale-110 hover:transition-all hover:duration-200 hover:ease-in-out"
                >
                  {totalPages}
                </button>
              </li>
            </>
          )}

          {end === totalPages - 1 && (
            <li className={currentPage === totalPages ? "active" : ""}>
              <button
                onClick={() => handlePageClick(totalPages)}
                className="relative flex items-center justify-center h-12 w-12 rounded-[10px] border-none bg-white mr-2.5 shadow-[0px_4.8px_28.8px_rgba(0,0,0,0.08)] text-[#999] hover:scale-110 hover:transition-all hover:duration-200 hover:ease-in-out"
              >
                {totalPages}
              </button>
            </li>
          )}
        </ul>

        <div className="previous-next">
          <button
            onClick={() =>
              handlePageClick(Math.min(currentPage + 1, totalPages))
            }
            className="next btn flex justify-center items-center border-none shadow-none"
            disabled={currentPage === totalPages}
          >
            <ChevronUp />
          </button>
        </div>
      </div>

      <style jsx>{`
        .active button {
          background-color: #343a40 !important;
          border-color: #343a40;
          color: #fff !important;
        }
        .next {
          transform: rotate(90deg);
        }
        .btn {
          margin: auto;
          padding: 0;
          border: none;
          transform: rotate(-90deg);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
