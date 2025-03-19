import Search from './Search';
import { SearchFilterProvider } from '@/helpers/contexts/search-filter-context';

/* eslint-disable react/display-name */
export default function () {
  return (
    <SearchFilterProvider>
      <Search />
    </SearchFilterProvider>
  );
}

/* 
    Right now only following filters are supported, others will be supported later as discussed with Umang
    - Language filter
    - Skill filter
    - Talent Type filter
    - Job Type filter

    *-Remaining-*
    - Invite button api integration is remaining, api not available
*/
