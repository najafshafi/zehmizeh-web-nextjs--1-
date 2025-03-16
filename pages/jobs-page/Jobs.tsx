/*
 * This is the main component of this route
 */

// 'use client';
// import { useEffect, useState, useMemo, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import cns from 'classnames';
// import { Form } from 'react-bootstrap';
// import { Wrapper } from './jobs.styled';
// import Loader from '@/components/Loader';
// import Tabs from '@/components/ui/Tabs';
// import NoDataFound from '@/components/ui/NoDataFound';
// import JobAutoCompleteSearch from '@/components/jobs/JobAutoCompleteSearch';
// import PaginationComponent from '@/components/ui/Pagination';
// import Listings from './listings';
// import useStartPageFromTop from '@/helpers/hooks/useStartPageFromTop';
// import useDebounce from '@/helpers/hooks/useDebounce';
// import useResponsive from '@/helpers/hooks/useResponsive';
// import useOnClickOutside from '@/helpers/hooks/useClickOutside';
// import { useAuth } from '@/helpers/contexts/auth-context';
// import useFreelancerJobs from './hooks/useFreelancerJobs';
// import useGetAllFreelancerJobs from './hooks/useGetAllFreelancerJobs';
// import { TABS } from './consts';
// import PageTitle from '@/components/styled/PageTitle';

// const RECORDS_PER_PAGE = 10;

// const Jobs = () => {
//   useStartPageFromTop();

//   const { user } = useAuth();

//   const { isDesktop, isLaptop } = useResponsive();

//   const [activeTab, setActiveTab] = useState<string>('active');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [searchValue, setSearchValue] = useState('');
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [sortValue, setSortValue] = useState<string>('');
//   const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
//   const ref = useRef(null);
//   const onClose = () => {
//     setSearchValue('');
//   };
//   useOnClickOutside(ref, onClose);

//   const [query, setQuery] = useState('');
//   const deboubcedSearch = useDebounce(searchValue, 500);

//   const { data, isLoading, totalResults, refetch, isRefetching } = useFreelancerJobs({
//     query,
//     limit: RECORDS_PER_PAGE,
//   });

//   const { jobs, fetchNextPage, hasNextPage, isFetchingNextPage, loading } = useGetAllFreelancerJobs(deboubcedSearch);

//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     /* This will set the default or applied filter from the url and
//     then will start fetching the data once the query is set */

//     // Defaults
//     let NEW_ACTIVE_TAB = 'active'; // default active tab = all_jobs
//     let NEW_PAGE = 1; // default current page = 1
//     let KEYWORD = ''; // default keyword = ''
//     let QUERY = '';
//     let FILTER = '';

//     if (location.search) {
//       const params: any = new URLSearchParams(location.search);
//       const paramsActiveTab = params.get('filter');
//       const pageNo = params.get('pg');
//       const keyword = params.get('keyword');
//       const filter = params.get('sort');

//       if (paramsActiveTab) {
//         setActiveTab(paramsActiveTab);
//         NEW_ACTIVE_TAB = paramsActiveTab;
//       }
//       if (pageNo) {
//         setCurrentPage(pageNo);
//         NEW_PAGE = pageNo;
//       }
//       if (keyword) {
//         KEYWORD = keyword;
//         setSearchTerm(KEYWORD);
//         setSearchValue(KEYWORD);
//         setSearchSubmitted(true);
//       }

//       if (filter) {
//         FILTER = filter;
//         setSortValue(filter);
//         NEW_ACTIVE_TAB = 'applied_job';
//       }
//     }

//     QUERY = `filter=${NEW_ACTIVE_TAB}&pg=${NEW_PAGE}&keyword=${KEYWORD}&sort=${FILTER}`;
//     setQuery(QUERY);
//   }, [location.search]);

//   const onSearch = (value: string) => {
//     setSearchTerm(value);

//     let NEW_PAGE = currentPage;
//     if (currentPage !== 1) {
//       setCurrentPage(1);
//       NEW_PAGE = 1;
//     }

//     const searchQuery = `filter=${activeTab}&pg=${NEW_PAGE}&keyword=${value}`;
//     changeWindowLocation(searchQuery);

//     setQuery(searchQuery);
//   };

//   const onTabChange = (value: string) => {
//     // This will remember the selected tab so that can be retrived when coming back from any other page

//     setCurrentPage(1);
//     setActiveTab(value);
//     let searchQuery = `filter=${value}&pg=1&keyword=${searchTerm}`;
//     if (value === 'applied_job') {
//       searchQuery += `&sort=${sortValue}`;
//     }
//     changeWindowLocation(searchQuery);

//     setQuery(searchQuery);
//     setSearchValue(searchTerm);
//   };

//   const onPageChange = (page: { selected: number }) => {
//     /* This will set next page as active and load new page data - Pagination is implemented locally  */
//     setCurrentPage(page?.selected + 1);
//     const searchQuery = `filter=${activeTab}&pg=${page?.selected + 1}&keyword=${searchTerm}&sort=${
//       sortValue === 'all' ? '' : sortValue
//     }`;
//     changeWindowLocation(searchQuery);

//     setQuery(searchQuery);
//     setSearchValue(searchTerm);
//   };

//   const changeWindowLocation = (path: string) => {
//     const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + `?${path}`;

//     window.history.pushState({ path: newurl }, '', newurl);
//   };

//   const sortBy = (value: string) => {
//     setCurrentPage(1);
//     setSortValue(value == 'all' ? '' : value);
//     const searchQuery = `filter=${activeTab}&pg=1&keyword=${searchTerm}&sort=${value == 'all' ? '' : value}`;
//     changeWindowLocation(searchQuery);

//     setQuery(searchQuery);
//   };

//   const onJobClick = (id: string) => () => {
//     navigate(`/job-details/${id}`);
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     onSearch(searchValue);
//     setSearchSubmitted(true);
//   };

//   const onSearchValueChange = (val: string) => {
//     if (val === '') {
//       onSearch(val);
//     }
//     setSearchSubmitted(false);
//     setSearchValue(val);
//   };

//   const filteredJobs = useMemo(() => {
//     return jobs?.pages || [];
//   }, [jobs?.pages]);

//   return (
//     <Wrapper className="content-hfill">
//       <PageTitle className="text-center">{user?.first_name}’s Projects</PageTitle>
//       <Form onSubmit={handleSubmit} className="project-filter" ref={ref}>
//         <JobAutoCompleteSearch
//           jobs={jobs?.pages}
//           filteredJobs={filteredJobs}
//           onJobClick={onJobClick}
//           onSearchValueChange={onSearchValueChange}
//           searchValue={searchValue}
//           hasNextPage={hasNextPage}
//           fetchNextPage={fetchNextPage}
//           isFetchingNextPage={isFetchingNextPage}
//           isLoading={loading}
//           searchSubmitted={searchSubmitted}
//         />
//       </Form>
//       {/* Tabs and search button */}
//       <div
//         className={cns('d-flex justify-content-center', {
//           'flex-column g-2': !isDesktop && !isLaptop,
//         })}
//       >
//         <Tabs activeTab={activeTab} tabs={TABS} onTabChange={onTabChange} />
//         {/* <div className="find-btn">
//           <Search searchTerm={searchTerm} onChange={onSearch} />
//         </div> */}
//       </div>

//       {(isLoading || isRefetching) && <Loader />}

//       {/* Jobs listing */}

//       {!isLoading && !isRefetching && (
//         <div className="listings mt-4">
//           {/* {!isLoading && data?.length > 0 && ( */}
//           <Listings
//             data={data}
//             listingType={activeTab}
//             refetch={refetch}
//             sortFilter={sortBy}
//             toggleReset={sortValue === '' ? 'Filter by' : sortValue}
//           />
//           {/*  )} */}
//         </div>
//       )}

//       {!isLoading && !isRefetching && data?.length == 0 && <NoDataFound className="py-5" />}

//       {/* Pagination */}
//       {!isRefetching && !isLoading && data?.length > 0 && (
//         <div className="d-flex justify-content-center mt-3">
//           <PaginationComponent
//             total={Math.ceil(totalResults / RECORDS_PER_PAGE)}
//             onPageChange={onPageChange}
//             currentPage={currentPage}
//           />
//         </div>
//       )}
//     </Wrapper>
//   );
// };

// export default Jobs;



'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import cns from 'classnames';
import { Form } from 'react-bootstrap';
import { Wrapper } from './jobs.styled';
import Loader from '@/components/Loader';
import Tabs from '@/components/ui/Tabs';
import NoDataFound from '@/components/ui/NoDataFound';
import JobAutoCompleteSearch from '@/components/jobs/JobAutoCompleteSearch';
import PaginationComponent from '@/components/ui/Pagination';
import Listings from './listings';
import useStartPageFromTop from '@/helpers/hooks/useStartPageFromTop';
import useDebounce from '@/helpers/hooks/useDebounce';
import useResponsive from '@/helpers/hooks/useResponsive';
import useOnClickOutside from '@/helpers/hooks/useClickOutside';
import { useAuth } from '@/helpers/contexts/auth-context';
import useFreelancerJobs from './hooks/useFreelancerJobs';
import useGetAllFreelancerJobs from './hooks/useGetAllFreelancerJobs';
import { TABS } from './consts';
import PageTitle from '@/components/styled/PageTitle';

const RECORDS_PER_PAGE = 10;

const Jobs = () => {
  useStartPageFromTop();

  const { user } = useAuth();
  const { isDesktop, isLaptop } = useResponsive();

  const [activeTab, setActiveTab] = useState<string>('active');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortValue, setSortValue] = useState<string>('');
  const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const ref = useRef(null);

  const onClose = () => {
    setSearchValue('');
  };
  useOnClickOutside(ref, onClose);

  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, totalResults, refetch, isRefetching } = useFreelancerJobs({
    query,
    limit: RECORDS_PER_PAGE,
  });

  const { jobs, fetchNextPage, hasNextPage, isFetchingNextPage, loading } = useGetAllFreelancerJobs(debouncedSearch);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let NEW_ACTIVE_TAB = 'active';
    let NEW_PAGE = 1;
    let KEYWORD = '';
    let QUERY = '';
    let FILTER = '';

    if (searchParams) {
      const paramsActiveTab = searchParams.get('filter');
      const pageNo = searchParams.get('pg');
      const keyword = searchParams.get('keyword');
      const filter = searchParams.get('sort');

      if (paramsActiveTab) {
        setActiveTab(paramsActiveTab);
        NEW_ACTIVE_TAB = paramsActiveTab;
      }
      if (pageNo) {
        setCurrentPage(Number(pageNo));
        NEW_PAGE = Number(pageNo);
      }
      if (keyword) {
        KEYWORD = keyword;
        setSearchTerm(KEYWORD);
        setSearchValue(KEYWORD);
        setSearchSubmitted(true);
      }
      if (filter) {
        FILTER = filter;
        setSortValue(filter);
        NEW_ACTIVE_TAB = 'applied_job';
      }
    }

    QUERY = `filter=${NEW_ACTIVE_TAB}&pg=${NEW_PAGE}&keyword=${KEYWORD}&sort=${FILTER}`;
    setQuery(QUERY);
  }, [searchParams]);

  const onSearch = (value: string) => {
    setSearchTerm(value);
    let NEW_PAGE = currentPage;
    if (currentPage !== 1) {
      setCurrentPage(1);
      NEW_PAGE = 1;
    }
    const searchQuery = `filter=${activeTab}&pg=${NEW_PAGE}&keyword=${value}`;
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
  };

  const onTabChange = (value: string) => {
    setCurrentPage(1);
    setActiveTab(value);
    let searchQuery = `filter=${value}&pg=1&keyword=${searchTerm}`;
    if (value === 'applied_job') {
      searchQuery += `&sort=${sortValue}`;
    }
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
    setSearchValue(searchTerm);
  };

  const onPageChange = (page: { selected: number }) => {
    setCurrentPage(page.selected + 1);
    const searchQuery = `filter=${activeTab}&pg=${page.selected + 1}&keyword=${searchTerm}&sort=${
      sortValue === 'all' ? '' : sortValue
    }`;
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
    setSearchValue(searchTerm);
  };

  const sortBy = (value: string) => {
    setCurrentPage(1);
    setSortValue(value === 'all' ? '' : value);
    const searchQuery = `filter=${activeTab}&pg=1&keyword=${searchTerm}&sort=${value === 'all' ? '' : value}`;
    router.push(`?${searchQuery}`);
    setQuery(searchQuery);
  };

  const onJobClick = (id: string) => () => {
    router.push(`/job-details/${id}`);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSearch(searchValue);
    setSearchSubmitted(true);
  };

  const onSearchValueChange = (val: string) => {
    if (val === '') {
      onSearch(val);
    }
    setSearchSubmitted(false);
    setSearchValue(val);
  };

  const filteredJobs = useMemo(() => {
    return jobs?.pages || [];
  }, [jobs?.pages]);

  return (
    <Wrapper className="w-full">
      <PageTitle className="text-center">{user?.first_name}’s Projects</PageTitle>
      <form onSubmit={handleSubmit} className="project-filter " ref={ref}>
        <JobAutoCompleteSearch
          jobs={jobs?.pages}
          filteredJobs={filteredJobs}
          onJobClick={onJobClick}
          onSearchValueChange={onSearchValueChange}
          searchValue={searchValue}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={loading}
          searchSubmitted={searchSubmitted}
        />
      </form>
      <div
        className={cns('flex justify-center', {
          'flex-col gap-2': !isDesktop && !isLaptop,
        })}
      >
        <Tabs activeTab={activeTab} tabs={TABS} onTabChange={onTabChange} />
      </div>

      {(isLoading || isRefetching) && <Loader />}

      {!isLoading && !isRefetching && (
        <div className="listings mt-4">
          <Listings
            data={data}
            listingType={activeTab}
            refetch={refetch}
            sortFilter={sortBy}
            toggleReset={sortValue === '' ? 'Filter by' : sortValue}
          />
        </div>
      )}

      {!isLoading && !isRefetching && data?.length === 0 && <NoDataFound className="py-12" />}

      {!isRefetching && !isLoading && data?.length > 0 && (
        <div className="flex justify-center mt-3">
          <PaginationComponent
            total={Math.ceil(totalResults / RECORDS_PER_PAGE)}
            onPageChange={onPageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default Jobs;