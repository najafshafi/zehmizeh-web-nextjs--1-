/*
 * This is the ...Talent Type... filter
 */
import Checkbox from '@/components/forms/Checkbox';
import { useSearchFilters } from '@/helpers/contexts/search-filter-context';

const TalentTypeFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const onSelectItem = (item: string) => {
    const selectedJobType = filters.account_type || [];
    if (selectedJobType?.includes(item)) {
      selectedJobType.splice(selectedJobType.indexOf(item), 1);
    } else {
      selectedJobType.push(item);
    }
    updateFilterHandler('account_type', selectedJobType);
  };

  return (
    <div>
      <div className="filter__checkbox__row d-flex align-items-center">
        <Checkbox
          checked={filters?.account_type?.includes('freelancer')}
          toggle={() => onSelectItem('freelancer')}
        />{' '}
        <div className="checkbox-label fs-1rem fw-400">Freelancers</div>
      </div>
      <div className="filter__checkbox__row d-flex align-items-center">
        <Checkbox
          checked={filters?.account_type?.includes('agency')}
          toggle={() => onSelectItem('agency')}
        />{' '}
        <div className="checkbox-label fs-1rem fw-400">Agencies</div>
      </div>
    </div>
  );
};

export default TalentTypeFilter;
