// app/components/PaginationComponent.tsx
'use client'; // Mark as client component since it handles state and navigation

import Link from 'next/link';
import styled from 'styled-components';
import ChevronUp from '@/public/icons/chevronUp.svg';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const PaginationWrap = styled.div`
  .pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .previous-next {
    a {
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
    a {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 3rem;
      width: 3rem;
      border-radius: 10px;
      line-height: 1.25;
      background-color: #fff;
      margin-right: 10px;
      box-shadow: 0px 4.8px 28.8px rgba(0, 0, 0, 0.08);
      color: #999;
      text-decoration: none;
    }

    &.active {
      a {
        background-color: #343a40 !important;
        border-color: #343a40;
        color: #fff !important;
      }
    }

    a:hover {
      transition: all 0.2s ease-in-out;
      transform: scale(1.1);
    }
  }
`;

interface PaginationProps {
  total: number;
  currentPage: number;
  onPageChange?: (page: number) => void; // Optional callback for custom handling
}

export default function PaginationComponent({ total, currentPage, onPageChange }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768; // Simple mobile check

  // Generate page numbers
  const pageNumbers = [];
  const marginPagesDisplayed = isMobile ? 1 : 2;
  const pageRangeDisplayed = isMobile ? 0 : 3;
  const totalPages = Math.ceil(total);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page change with Next.js query params
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      window.history.pushState(null, '', `${pathname}?${params.toString()}`);
      if (onPageChange) onPageChange(page); // Trigger custom callback if provided
    },
    [pathname, searchParams, onPageChange]
  );

  // Determine visible page range
  const getVisiblePages = () => {
    const halfRange = Math.floor(pageRangeDisplayed / 2);
    let start = Math.max(currentPage - halfRange, 1);
    let end = Math.min(start + pageRangeDisplayed - 1, totalPages);

    if (end - start < pageRangeDisplayed - 1) {
      start = Math.max(end - pageRangeDisplayed + 1, 1);
    }

    return { start, end };
  };

  const { start, end } = getVisiblePages();

  return (
    <PaginationWrap>
      <div className="pagination">
        <div className="previous-next">
          <Link
            href={{
              pathname,
              query: { ...searchParams, page: Math.max(currentPage - 1, 1) },
            }}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(Math.max(currentPage - 1, 1));
            }}
            className="btn"
          >
            <ChevronUp />
          </Link>
        </div>

        <ul>
          {start > 1 && (
            <>
              <li>
                <Link
                  href={{ pathname, query: { ...searchParams, page: 1 } }}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                  className={currentPage === 1 ? 'active' : ''}
                >
                  1
                </Link>
              </li>
              {start > 2 && <li className="break-me">...</li>}
            </>
          )}

          {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
            <li key={page} className={currentPage === page ? 'active' : ''}>
              <Link
                href={{ pathname, query: { ...searchParams, page: page.toString() } }}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </Link>
            </li>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <li className="break-me">...</li>}
              <li>
                <Link
                  href={{ pathname, query: { ...searchParams, page: totalPages } }}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                  className={currentPage === totalPages ? 'active' : ''}
                >
                  {totalPages}
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="previous-next">
          <Link
            href={{
              pathname,
              query: { ...searchParams, page: Math.min(currentPage + 1, totalPages) },
            }}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(Math.min(currentPage + 1, totalPages));
            }}
            className="next btn"
          >
            <ChevronUp />
          </Link>
        </div>
      </div>
    </PaginationWrap>
  );
}