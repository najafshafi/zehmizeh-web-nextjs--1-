"use client"
import styled from 'styled-components';
import useToggle from '@/helpers/hooks/useToggle';
import Arrow from '@/public/icons/select-arrow.svg';
import Cross from '@/public/icons/cross-black.svg';
import cns from 'classnames';
import { convertToTitleCase, pxToRem } from '@/helpers/utils/misc';
import React from 'react';
import useOnClickOutside from '@/helpers/hooks/useClickOutside';
import SearchIcon from '@/public/icons/search.svg';
import { useJobOptions } from '../PaymentController';
const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  .project-filter {
    &__label {
      width: 300px;
      border: 1px solid #d9d9d9;
      background-color: white;
      height: 38px;
      border-radius: ${pxToRem(6)};
      padding: 0 10px;
      transition: all 0.25s;

      @media (max-width: 768px) {
        width: 100%;
      }

      svg {
        transform: rotate(180deg);
      }
      &.open {
        border-color: #858585;
        svg {
          transform: rotate(0deg);
        }
      }
    }
    &__body {
      background-color: white;
      box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.18);
      position: absolute;
      width: 300px;
      top: 60px;
      border-radius: ${pxToRem(6)};
    }
  }
  .word-break-unset {
    word-break: unset !important;
    min-width: fit-content !important;
  }
`;

const SearchInput = styled.div`
  border: 1px solid #d9d9d9;
  margin: 1rem;
  height: 48px;
  border-radius: ${pxToRem(6)};
  color: rgba(0, 0, 0, 0.7);
  svg,
  path {
    stroke: currentColor;
  }
  input {
    color: currentColor;
    outline: 0;
    border: 0;
  }
  /* width: 268px; */
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
  }
`;

function ProjectFilter({ onChange, value }: any) {
  const { value: isOpen, toggle, close } = useToggle();
  const [searchValue, setSearchValue] = React.useState('');
  const jobs = useJobOptions();
  const ref = React.useRef(null);
  useOnClickOutside(ref, close);
  const onJobClick = (id: string) => () => {
    onChange(id);
    const job = jobs.find((job) => job.job_post_id === id);
    setSearchValue(job?.job_title || '');
    close();
  };
  const onClear = () => {
    setSearchValue('');
  };
  const selectedProject = jobs ? jobs.find((job) => job.job_post_id === value) : null;
  const filteredJobs = React.useMemo(() => {
    if (!searchValue) return jobs;
    return jobs.filter((job) => {
      return job.job_title.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [jobs, searchValue]);
  return (
    <Wrapper ref={ref}>
      <div
        className={cns('project-filter__label flex items-center justify-between', {
          open: isOpen,
        })}
        onClick={toggle}
      >
        <span className="capital-first-ltr text-truncate">
          {selectedProject?.job_title ? convertToTitleCase(selectedProject?.job_title) : 'Filter by Project'}
        </span>
        <div className="flex">
          <Arrow />
          {!!selectedProject && <Cross className="ms-2 pointer" onClick={onJobClick('')} />}
        </div>
      </div>
      {isOpen && (
        <div className="project-filter__body">
            <SearchInput className="px-2 flex gap-1 items-center">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
            <span onClick={onClear} className="cursor-pointer word-break-unset">
              Clear
            </span>
          </SearchInput>
          {jobs && jobs.length > 0 && (
            <SearchResults>
              {filteredJobs.map((opt) => (
                <li key={opt?.job_post_id} onClick={onJobClick(opt?.job_post_id)} className="capital-first-ltr">
                  {convertToTitleCase(opt?.job_title)}
                </li>
              ))}
            </SearchResults>
          )}
        </div>
      )}
    </Wrapper>
  );
}

export default React.memo(ProjectFilter);
