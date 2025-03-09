/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import styled from 'styled-components';
import { Pagination } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import useResponsive from 'helpers/hooks/useResponsive';
import ChevronUp from "../../public/icons/chevronUp.svg";

const Paginationwrap = styled(Pagination)`
  .pagination {
    flex-wrap: wrap;
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
  ul > li {
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
  .page-item {
    .page-link {
      color: #999;
    }
    &.active {
      .page-link {
        background-color: #343a40;
        border-color: #343a40;
        color: #fff;
      }
    }
  }
`;
function PaginationComponent({
  total,
  onPageChange,
  currentPage,
}: {
  total: number;
  onPageChange: (e: any) => void;
  currentPage: number;
}) {
  const { isMobile } = useResponsive();
  return (
    <Paginationwrap>
      <ReactPaginate
        previousLabel={
          <p className="btn">
            <ChevronUp />
          </p>
        }
        nextLabel={
          <p className="next btn">
            <ChevronUp />
          </p>
        }
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={total}
        marginPagesDisplayed={isMobile ? 1 : 2}
        pageRangeDisplayed={isMobile ? 0 : 3}
        onPageChange={onPageChange}
        previousClassName="previous-next"
        nextClassName="previous-next"
        containerClassName={'pagination'}
        activeClassName={'active'}
        forcePage={currentPage - 1}
      />
    </Paginationwrap>
  );
}
export default PaginationComponent;
