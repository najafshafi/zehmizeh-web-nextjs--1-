/*
 * This is the ...Talent Type... filter
 */
import Checkbox from '@/components/forms/Checkbox';
import { useSearchFilters } from '@/helpers/contexts/search-filter-context';

const PortfolioFilter = () => {
  const { filters, updateFilterHandler } = useSearchFilters();

  const onSelectItem = (item: string) => {
    const selectedJobType = filters.hasPortfolio || [];
    if (selectedJobType?.includes(item)) {
      selectedJobType.splice(selectedJobType.indexOf(item), 1);
    } else {
      selectedJobType.push(item);
    }
    updateFilterHandler('hasPortfolio', selectedJobType);
  };

  return (
    <div>
      <div className="filter__checkbox__row d-flex align-items-center">
        <Checkbox
          checked={filters?.hasPortfolio?.includes('portfolioAdded')}
          toggle={() => onSelectItem('portfolioAdded')}
        />{' '}
        <div className="checkbox-label fs-1rem fw-400">
          Portfolio Added
        </div>
      </div>
      <div className="filter__checkbox__row d-flex align-items-center">
        <Checkbox
          checked={filters?.hasPortfolio?.includes('noPortfolio')}
          toggle={() => onSelectItem('noPortfolio')}
        />{' '}
        <div className="checkbox-label fs-1rem fw-400">
          No Portfolio
        </div>
      </div>
    </div>
  );
};

export default PortfolioFilter;
